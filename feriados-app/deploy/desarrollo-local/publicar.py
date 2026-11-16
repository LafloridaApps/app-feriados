#!/usr/bin/env python3
"""Empaqueta los cinco repositorios; Docker se ejecuta exclusivamente en la VM."""
import argparse
import datetime as dt
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import tarfile
import tempfile
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
PROJECTS = ('smcapis', 'api-departamentos', 'api-funcionarios', 'newsolicitudes', 'app-feriados')
EXCLUDED = {'.git', '.aws', '.codex', '.agents', '.idea', '.vscode', 'node_modules', 'dist',
            'target', '__pycache__', '.pytest_cache', 'coverage'}
FORBIDDEN_SUFFIXES = {'.pem', '.key', '.p12', '.pfx', '.jks', '.log', '.gz', '.zip', '.tar'}
SECRET_KEYWORDS = ('password', 'secret', 'encryption-key')
PLACEHOLDER = re.compile(r'\$\{[^}]+\}')
STAGING_NAME = re.compile(r'feriados-upload\.\w{10}', re.ASCII)
PATH_SEGMENT = re.compile(r'[\w.-]+', re.ASCII)
MANIFEST = 'manifest.json'
RELEASE_SH = 'release.sh'
RELEASE_PY = 'release.py'


def run(args, **kwargs):
    return subprocess.check_output(args, text=True, **kwargs).rstrip("\n")


def _excluded(rel):
    return any(part in EXCLUDED or part.startswith('.env') for part in rel.parts)


def _literal_credential(line):
    if line.lstrip().startswith('#'):
        return None
    separators = [pos for pos in (line.find('='), line.find(':')) if pos != -1]
    if not separators:
        return None
    key = line[:min(separators)]
    lowered = key.lower()
    if '#' in key or not any(word in lowered for word in SECRET_KEYWORDS):
        return None
    value = line[len(key) + 1:].strip()
    if not value or PLACEHOLDER.fullmatch(value):
        return None
    return key.strip()


def _valid_staging(path):
    """Acepta solo rutas absolutas seguras con el nombre que entrega mktemp."""
    if not path.startswith('/'):
        return False
    *parents, name = path.split('/')
    return bool(STAGING_NAME.fullmatch(name)) and all(
        segment not in ('', '.', '..') and PATH_SEGMENT.fullmatch(segment)
        for segment in parents[1:])


def _check_credentials(rel, path):
    # Las claves deben llegar por el entorno de Compose, nunca dentro de la imagen.
    if 'main/resources' not in str(rel) or path.suffix not in {'.properties', '.yaml', '.yml'}:
        return
    for line in path.read_text().splitlines():
        key = _literal_credential(line)
        if key:
            raise ValueError(f'Credencial literal en {rel}: {key}')


def _candidate_files(root, roots, names):
    files = [root / name for name in names]
    for directory in roots:
        if (root / directory).is_symlink():
            raise ValueError(f'Directorio enlazado no permitido: {directory}')
        files.extend((root / directory).rglob('*'))
    return files


def _selected_files(root, candidates):
    result = []
    for path in sorted(set(candidates)):
        rel = path.relative_to(root)
        if _excluded(rel) or path.suffix.lower() in FORBIDDEN_SUFFIXES:
            continue
        if path.is_symlink():
            raise ValueError(f'Enlace no permitido en contexto: {rel}')
        if path.is_file():
            _check_credentials(rel, path)
            result.append(path)
    return result


def source_files(root, frontend):
    # Lista cerrada: no se transfieren deploy.sh, respaldos ni configuraciones del servidor.
    roots = ('src', 'public', 'deploy/intranet') if frontend else ('src', '.mvn')
    names = ('package.json', 'package-lock.json', 'index.html', 'vite.config.js') if frontend else ('pom.xml', 'mvnw')
    result = _selected_files(root, _candidate_files(root, roots, names))
    for name in names:
        if root / name not in result:
            raise ValueError(f'Falta {root / name}')
    return result


def archive(root, paths, dest):
    # Contenido y cabeceras normalizados: la misma fuente produce la misma huella.
    with dest.open('wb') as raw, \
            gzip.GzipFile(fileobj=raw, mode='wb', filename='', mtime=0) as gz, \
            tarfile.open(fileobj=gz, mode='w') as tar:
        for path in paths:
            info = tar.gettarinfo(str(path), arcname=str(path.relative_to(root)))
            info.uid = info.gid = info.mtime = 0
            info.uname = info.gname = ''
            info.mode = 0o755 if path.name == 'mvnw' else 0o644
            with path.open('rb') as source:
                tar.addfile(info, source)
    return hashlib.sha256(dest.read_bytes()).hexdigest()


def remote_action(staging, remote, version, deploy):
    """Promueve el paquete bajo sudo, sin otorgar escritura del árbol /opt al usuario SSH."""
    names = [MANIFEST, *(f'{name}.tar.gz' for name in PROJECTS), RELEASE_SH, RELEASE_PY]
    quoted = shlex.quote
    commands = [
        'set -euo pipefail',
        'umask 077',
        'mkdir -p /opt/qa-replica/feriados-stack-releases',
        'mkdir -m 700 -- ' + quoted(remote),
        'install -m 600 -- ' + ' '.join(quoted(staging + '/' + name) for name in names) + ' ' + quoted(remote + '/'),
        'bash ' + quoted(remote + '/' + RELEASE_SH) + ' build ' + quoted(version),
    ]
    if deploy:
        commands.append('bash ' + quoted(remote + '/' + RELEASE_SH) + ' deploy ' + quoted(version))
    return 'sudo bash -c ' + quoted('\n'.join(commands))


def main():
    parser = argparse.ArgumentParser(description='Publica los cinco proyectos en server-app.')
    parser.add_argument('version', nargs='?')
    parser.add_argument('--deploy', action='store_true')
    parser.add_argument('--dry-run', action='store_true', help='Empaqueta y valida sin SSH ni Docker.')
    args = parser.parse_args()
    target = os.environ.get('FERIADOS_VM', 'desarrollo@server-app')
    if target not in ('desarrollo@server-app', 'desarrollo@192.168.122.65'):
        parser.error('Solo se admite desarrollo local: server-app / 192.168.122.65.')
    frontend = Path(os.environ.get('FERIADOS_SOURCE', HERE.parents[1])).resolve()
    base = Path(os.environ.get('FERIADOS_PROJECTS_ROOT', frontend.parent.parent)).resolve()
    with tempfile.TemporaryDirectory(prefix='feriados-stack-') as temp:
        temp = Path(temp)
        manifest = {'format': 1, 'projects': {}, 'tools_sha256': {
            name: hashlib.sha256((HERE / name).read_bytes()).hexdigest()
            for name in ('publicar.py', RELEASE_PY, RELEASE_SH)}}
        for name in PROJECTS:
            root = frontend if name == 'app-feriados' else base / name
            paths = source_files(root, name == 'app-feriados')
            packed = temp / f'{name}.tar.gz'
            sha = archive(root, paths, packed)
            selected = {str(p.relative_to(root)) for p in paths}
            status = run(['git', '-C', str(root), 'status', '--porcelain=v1', '--untracked-files=all'])
            manifest['projects'][name] = {
                'revision': run(['git', '-C', str(root), 'rev-parse', 'HEAD']),
                'source_dirty': bool(status), 'git_status': status.splitlines(),
                'included_untracked': [line[3:] for line in status.splitlines()
                                       if line.startswith('?? ') and line[3:] in selected],
                'files': sorted(selected), 'source_sha256': sha,
            }
        fingerprint = hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
        version = args.version or f'qa-{dt.datetime.now(ZoneInfo("America/Santiago")):%Y%m%d-%H%M%S}-{fingerprint[:12]}'
        if not re.fullmatch(r'\w[\w.-]{0,63}', version, re.ASCII) or version == 'latest':
            parser.error('Versión inválida; latest no está permitido.')
        manifest.update(version=version, bundle_sha256=fingerprint)
        (temp / MANIFEST).write_text(json.dumps(manifest, indent=2) + '\n')
        print(f'Versión conjunta: {version}\nDestino: {target}\nDesplegar: {args.deploy}', flush=True)
        for name, metadata in manifest['projects'].items():
            print(f'  image-{name}:{version}  commit={metadata["revision"][:8]} '
                  f'cambios={metadata["source_dirty"]} sha256={metadata["source_sha256"]}', flush=True)
        if args.dry_run:
            print('Paquetes validados; no se estableció conexión ni se desplegó.')
            return
        remote = f'/opt/qa-replica/feriados-stack-releases/{version}'
        ssh = ['-F', '/dev/null', '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ControlMaster=auto',
               '-o', 'ControlPersist=60', '-o', f'ControlPath={temp}/ssh']
        staging = None
        try:
            staging = run(['ssh', *ssh, target,
                           'umask 077; mktemp -d /tmp/feriados-upload.XXXXXXXXXX'])
            if not _valid_staging(staging):
                raise ValueError('La VM devolvió una ruta temporal inesperada')
            uploads = [temp / MANIFEST, *(temp / f'{name}.tar.gz' for name in PROJECTS),
                       HERE / RELEASE_SH, HERE / RELEASE_PY]
            subprocess.run(['scp', *ssh, *(str(path) for path in uploads), f'{target}:{staging}/'], check=True)
            action = remote_action(staging, remote, version, args.deploy)
            subprocess.run(['ssh', '-tt', *ssh, target, action], check=True)
        finally:
            if staging and _valid_staging(staging):
                subprocess.run(['ssh', *ssh, '-o', 'BatchMode=yes', target,
                                'rm -rf -- ' + shlex.quote(staging)],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['ssh', *ssh, '-O', 'exit', target], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(('Desplegada' if args.deploy else 'Construida') + f' versión conjunta {version}.')
        print('Acceso: http://server-app/feriados/')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit(f'Publicación interrumpida: {error}')
