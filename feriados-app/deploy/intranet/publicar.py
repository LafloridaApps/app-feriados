#!/usr/bin/env python3
"""Publicación incremental de commits integrados; main local se promueve tras verificar."""
import argparse
import datetime as dt
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import tempfile
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
COMMON = HERE.parent / 'desarrollo-local'
TARGET = 'desarrollo@192.168.10.49'
BASE = '/home/desarrollo/intranet'


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def remote_query(ssh, mode):
    runtime = (HERE / 'release.py').read_text()
    command = 'python3 -c ' + shlex.quote(runtime) + ' ' + mode
    output = subprocess.check_output(['ssh', *ssh, TARGET, command], text=True)
    return json.loads(output) if mode == 'state' else output


def remote_run(ssh, version, mode):
    path = f'{BASE}/releases/{version}/release.py'
    subprocess.run(['ssh', '-tt', *ssh, TARGET, 'python3 ' + shlex.quote(path) + ' ' + mode], check=True)


def same_images(actual, expected):
    return all(actual[p]['image_id'] == metadata['image_id'] and actual[p].get('running', True)
               for p, metadata in expected.items())


def recover(ssh, gitflow, frontend, version, rollback=False):
    path = gitflow.receipt_path(frontend.parent, version)
    receipt = json.loads(path.read_text())
    records = receipt['git']
    active = None
    if rollback:
        # No rebobinar main si alguien lo movió después; pedir coordinación antes de mutar servidor.
        for record in records.values():
            current = gitflow.git(record['repository'], 'rev-parse', 'main')
            if current not in (record['revision'], record['previous_main']):
                raise ValueError('main cambió después de publicar; no se ejecuta una reversión automática')
            checkout = gitflow.main_checkout(record['repository'])
            if checkout and not gitflow.clean(checkout):
                raise ValueError('main tiene cambios pendientes; no se inicia la reversión')
        try:
            active = remote_query(ssh, 'state')
        except subprocess.CalledProcessError:
            pass  # Puede faltar un contenedor tras una desconexión durante create/start.
        if active is None or not same_images(active, receipt['active_before']):
            remote_run(ssh, version, 'rollback')
        active = remote_query(ssh, 'state')
        if not same_images(active, receipt['active_before']):
            raise ValueError('La reversión remota no coincide con las imágenes anteriores')
        for record in records.values():
            current = gitflow.git(record['repository'], 'rev-parse', 'main')
            gitflow.move_main(record['repository'], current, record['previous_active_revision'], allow_rewind=True)
        receipt['status'] = 'rolled_back'
    else:
        active = remote_query(ssh, 'state')
        if same_images(active, receipt['active_before']):
            print('El servidor conserva las imágenes anteriores; main no se modifica.')
            return
        for project, record in records.items():
            deployed = gitflow.active_revision(record['repository'], active[project])
            if deployed != record['revision']:
                raise ValueError('El estado remoto es mixto o diferente; usa --rollback con esta versión')
        # Confirmar que el runtime alcanzó su verificación final, no solo que arrancó contenedores.
        command = 'test -f ' + shlex.quote(f'{BASE}/releases/{version}/activated.json')
        subprocess.run(['ssh', *ssh, TARGET, command], check=True)
        gitflow.promote(records)
        receipt['status'] = 'active'
    gitflow.save_receipt(frontend.parent, version, receipt)
    print(f'Recuperación completada: {receipt["status"]}; main local coincide con los commits activos.')


def main():
    parser = argparse.ArgumentParser(description='Publica solo commits nuevos en intranet; actualiza main local al verificar.')
    parser.add_argument('version', nargs='?')
    parser.add_argument('--dry-run', action='store_true', help='Inspecciona Git local sin escribir, conectar ni fusionar.')
    parser.add_argument('--check', action='store_true', help='Inspección remota, sin escribir ni fusionar.')
    parser.add_argument('--plan', action='store_true', help='Compara commits con imágenes activas, sin escribir ni fusionar.')
    parser.add_argument('--build-only', action='store_true', help='Construye candidatos; no despliega ni mueve main.')
    parser.add_argument('--commit-message', help='Confirma cambios pendientes con este mensaje antes de preparar las fusiones.')
    parser.add_argument('--rollback', metavar='VERSION', help='Restaura imágenes y main local según el recibo de publicación.')
    parser.add_argument('--recover', metavar='VERSION', help='Comprueba un despliegue interrumpido y completa main si está verificado.')
    args = parser.parse_args()
    if sum(bool(x) for x in (args.dry_run, args.check, args.plan, args.rollback, args.recover)) > 1:
        parser.error('Usa un solo modo de inspección o recuperación.')
    if (args.check or args.plan or args.dry_run or args.rollback or args.recover) and (args.build_only or args.commit_message):
        parser.error('Los modos de inspección/recuperación no confirman cambios ni construyen.')
    gitflow = load('git_release', HERE / 'git_release.py')
    packer = load('stack_packer', COMMON / 'publicar.py')
    frontend = Path(os.environ.get('FERIADOS_SOURCE', HERE.parents[1])).resolve()
    projects_root = Path(os.environ.get('FERIADOS_PROJECTS_ROOT', frontend.parent.parent)).resolve()
    roots = {p: frontend if p == 'app-feriados' else projects_root / p for p in packer.PROJECTS}
    if args.dry_run:
        for name, root in roots.items():
            dirty = not gitflow.clean(root)
            print(f'{name}: rama={gitflow.git(root, "branch", "--show-current")} '
                  f'commit={gitflow.git(root, "rev-parse", "HEAD")[:12]} pendientes={dirty}')
        print('No se fusionó ni publicó. Una publicación requiere commits; usa --plan para comparar con intranet.')
        return
    version = args.version or f'intranet-{dt.datetime.now(ZoneInfo("America/Santiago")):%Y%m%d-%H%M%S}'
    for item in (version, args.rollback, args.recover):
        if item and (not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.-]{0,63}', item) or item == 'latest'):
            parser.error('Versión inválida')
    with tempfile.TemporaryDirectory(prefix='intranet-release-') as temporary:
        temp = Path(temporary)
        ssh = ['-F', '/dev/null', '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ControlMaster=auto',
               '-o', 'ControlPersist=60', '-o', f'ControlPath={temp}/ssh']
        worktrees = []
        staging = None
        try:
            if args.check:
                print(remote_query(ssh, 'check'), end='')
                return
            if args.rollback or args.recover:
                recover(ssh, gitflow, frontend, args.rollback or args.recover, rollback=bool(args.rollback))
                return
            if not args.plan and gitflow.receipt_path(frontend.parent, version).exists():
                raise ValueError('Ya existe un recibo de esa versión; usa otra etiqueta o --recover/--rollback')
            if not args.plan:
                print(remote_query(ssh, 'check'), end='')
            active = remote_query(ssh, 'state')  # Solo lectura antes de cualquier commit/fusión/escritura remota.
            if args.plan:
                for name, root in roots.items():
                    deployed = gitflow.active_revision(root, active[name])
                    source = gitflow.git(root, 'rev-parse', 'HEAD')
                    print(f'{name}: activo={deployed[:12]} rama={source[:12]} pendientes={not gitflow.clean(root)} '
                          + ('MISMO COMMIT' if source == deployed else 'REVISAR INTEGRACIÓN'))
                return
            for name, root in roots.items():
                packer.source_files(root, name == 'app-feriados')  # Revisar credenciales antes de cualquier commit.
            if not args.commit_message:
                for root in roots.values():
                    if not gitflow.clean(root):
                        raise ValueError(f'{root}: hay cambios sin commit. Confirma tus cambios o usa --commit-message "mensaje"; no se publica código sin commit.')
            manifest = {'format': 2, 'target': '192.168.10.49', 'version': version, 'projects': {},
                        'frontend_build_args': {'VITE_MAIN_MENU_URL': 'https://intranet.laflorida.cl/home'},
                        'tools_sha256': {name: hashlib.sha256(path.read_bytes()).hexdigest() for name, path in {
                            'publicar.py': HERE / 'publicar.py', 'release.py': HERE / 'release.py',
                            'git_release.py': HERE / 'git_release.py', 'stack_tools.py': COMMON / 'release.py'}.items()}}
            records = {}
            for name, root in roots.items():
                checkout = temp / ('source-' + name)
                record = gitflow.prepare(root, checkout, version, args.commit_message)
                worktrees.append((record['repository'], checkout))
                changed = gitflow.select(record['repository'], record, active[name])
                record['previous_active_revision'] = gitflow.active_revision(record['repository'], active[name])
                records[name] = record
                metadata = {**record, 'changed': changed, 'source_dirty': False, 'git_status': [],
                            'previous_image_id': active[name]['image_id']}
                if changed:
                    source = checkout / 'feriados-app' if name == 'app-feriados' else checkout
                    files = packer.source_files(source, name == 'app-feriados')
                    metadata.update(source_sha256=packer.archive(source, files, temp / f'{name}.tar.gz'),
                                    files=[str(path.relative_to(source)) for path in files], included_untracked=[])
                else:
                    metadata.update(image=active[name]['image'], image_id=active[name]['image_id'],
                                    image_version=active[name]['version'], source_sha256=active[name].get('source_sha256'))
                manifest['projects'][name] = metadata
                print(f'{name}: ' + ('PUBLICAR ' if changed else 'OMITIR, ya activo ') + record['revision'][:12], flush=True)
            selected = [p for p, metadata in manifest['projects'].items() if metadata['changed']]
            receipt = {'version': version, 'status': 'prepared', 'git': records, 'active_before': active, 'selected': selected}
            receipt_file = gitflow.save_receipt(frontend.parent, version, receipt)
            if not selected:
                if not same_images(remote_query(ssh, 'state'), active):
                    raise ValueError('Las imágenes cambiaron durante la preparación')
                gitflow.promote(records)
                receipt['status'] = 'unchanged'
                gitflow.save_receipt(frontend.parent, version, receipt)
                print('No hay commits nuevos: no se transfirió, construyó ni reinició ninguna imagen. main local alineado.')
                return
            manifest['bundle_sha256'] = hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
            (temp / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
            staging = packer.run(['ssh', *ssh, TARGET, 'umask 077; mktemp -d /tmp/intranet-upload.XXXXXXXXXX'])
            if not re.fullmatch(r'/tmp/intranet-upload\.[A-Za-z0-9]{10}', staging):
                raise ValueError('Ruta temporal inesperada')
            subprocess.run(['scp', *ssh, str(temp / 'manifest.json'), *(str(temp / f'{p}.tar.gz') for p in selected),
                            str(HERE / 'release.py'), f'{TARGET}:{staging}/'], check=True)
            subprocess.run(['scp', *ssh, str(COMMON / 'release.py'), f'{TARGET}:{staging}/stack_tools.py'], check=True)
            remote = f'{BASE}/releases/{version}'
            names = ['manifest.json', 'release.py', 'stack_tools.py', *(f'{p}.tar.gz' for p in selected)]
            q = shlex.quote
            commands = ['set -euo pipefail', 'umask 077', f'mkdir -m 700 -- {q(remote)}',
                        'install -m 600 -- ' + ' '.join(q(staging + '/' + name) for name in names) + ' ' + q(remote + '/'),
                        f'python3 {q(remote + "/release.py")} build']
            if not args.build_only:
                commands.append(f'python3 {q(remote + "/release.py")} deploy')
            subprocess.run(['ssh', '-tt', *ssh, TARGET, 'bash -c ' + q('\n'.join(commands))], check=True)
            if args.build_only:
                receipt['status'] = 'built'
                gitflow.save_receipt(frontend.parent, version, receipt)
                print(f'Construido {version}. main no cambió. Para desplegar ejecuta el runtime remoto y después --recover {version}.')
                return
            try:
                gitflow.promote(records)
            except BaseException:
                receipt['status'] = 'main_promotion_failed'
                gitflow.save_receipt(frontend.parent, version, receipt)
                remote_run(ssh, version, 'rollback')
                raise ValueError('No se pudo promover main local; se solicitó reversión de las imágenes. Revisar el recibo de publicación.') from None
            receipt['status'] = 'active'
            gitflow.save_receipt(frontend.parent, version, receipt)
            print(f'INTRANET PUBLICADA: {version}. main local coincide con lo verificado. No se ejecutó push.\n'
                  f'Recibo: {receipt_file}\nVolver atrás: ./subir-intranet.sh --rollback {version}', flush=True)
        except subprocess.CalledProcessError:
            print(f'Publicación interrumpida. main no se promueve antes de verificar.\n'
                  f'Si se perdió la conexión, inspecciona con ./subir-intranet.sh --recover {version}', flush=True)
            raise
        finally:
            for root, checkout in reversed(worktrees):
                gitflow.remove(root, checkout)
            if staging and re.fullmatch(r'/tmp/intranet-upload\.[A-Za-z0-9]{10}', staging):
                subprocess.run(['ssh', *ssh, '-o', 'BatchMode=yes', TARGET, 'rm -rf -- ' + shlex.quote(staging)],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['ssh', *ssh, '-O', 'exit', TARGET], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'Publicación de intranet interrumpida: {error}')
