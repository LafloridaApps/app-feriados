#!/usr/bin/env python3
"""Runtime exclusivo de intranet. Check no escribe; build no reemplaza servicios."""
import argparse
import copy
import fcntl
import hashlib
import http.client
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import socket
import signal
import subprocess
import sys
import tarfile
import time
import urllib.parse
import urllib.request

BASE = Path('/home/desarrollo/intranet')
HERE = Path(__file__).resolve().parent if '__file__' in globals() else BASE
SERVICES = {
    'smcapis': ('smc-api', 'smcapis-container', 'smcapis', 8085),
    'api-departamentos': ('departamentos', 'api-departamentos-container', 'api-departamentos', 8086),
    'api-funcionarios': ('funcionarios', 'api-funcionarios-container', 'api-funcionarios', 8088),
    'newsolicitudes': ('new-solicitudes', 'new-solicitudes-container', 'newsolicitudes', 8087),
    'app-feriados': ('app-feriados', 'app-feriados', 'image-app-feriados', 8090),
}


def run(*args, env=None):
    return subprocess.check_output(args, stderr=subprocess.PIPE, text=True, env=env).strip()


def inspect(name, image=False):
    return json.loads(run('docker', 'image' if image else 'container', 'inspect', name))[0]


def save(path, value):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as output:
        json.dump(value, output, indent=2)
        output.write('\n')


def digest(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()


def environment(directory):
    path = BASE / directory / '.env'
    if not path.exists():
        if directory != 'app-feriados':
            raise ValueError(f'Falta el archivo de entorno de {directory}')
        return {}
    result = {}
    for line in path.read_text().splitlines():
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        key, separator, value = line.partition('=')
        if not separator or not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', key):
            raise ValueError(f'Formato .env no compatible en {directory}; no se modifica')
        # Docker env-file interpreta los valores literalmente, sin evaluar comandos.
        result[key] = value
    return result


def fingerprint(container):
    value = {'id': container['Id'], 'image': container['Image'], 'config': container['Config'],
             'host': container['HostConfig'], 'mounts': container['Mounts'],
             'networks': container['NetworkSettings']['Networks']}
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()


def check(quiet=False):
    if socket.gethostname() != 'Srv-Intranet' or not BASE.is_dir():
        raise ValueError('Destino incorrecto: se requiere Srv-Intranet y /home/desarrollo/intranet')
    running = {}
    for project, (directory, name, repository, port) in SERVICES.items():
        configured = environment(directory)
        container = inspect(name)
        if not container['State']['Running']:
            raise ValueError(f'{name} no está activo')
        active = dict(item.split('=', 1) for item in container['Config']['Env'])
        drift = [key for key, value in configured.items() if active.get(key) != value]
        if drift:
            raise ValueError(f'{directory}: .env distinto del contenedor en claves: ' + ', '.join(drift))
        if project != 'app-feriados' and 'laflorida' not in container['NetworkSettings']['Networks']:
            raise ValueError(f'{name} no pertenece a la red laflorida')
        target_port = {'smcapis': 8083, 'api-departamentos': 8085, 'api-funcionarios': 8084,
                       'newsolicitudes': 8081, 'app-feriados': 5173}[project]
        bindings = container['HostConfig']['PortBindings'].get(f'{target_port}/tcp') or []
        if not any(int(binding['HostPort']) == port for binding in bindings):
            raise ValueError(f'{name}: cambió el mapeo de puertos; revisar antes de publicar')
        for mount in container['Mounts']:
            if mount['Destination'].rstrip('/') in ('', '/app', '/usr/share/nginx/html') or mount['Destination'].endswith('.jar'):
                raise ValueError(f'{name}: un montaje oculta el código de la imagen')
        running[project] = container
        if not quiet:
            print(f'{directory}: activo; entorno coincide ({len(configured)} variables); puerto {port}; '
              f'imagen {container["Config"]["Image"]}', flush=True)
    if shutil.disk_usage(BASE).free < 10 * 1024**3:
        raise ValueError('Se requieren al menos 10 GB libres antes de construir y respaldar')
    if not shutil.which('mysqldump'):
        raise ValueError('Falta mysqldump para respaldar las bases antes de reemplazar servicios')
    if not quiet:
        print('Configuración de intranet comprobada, sin modificar variables ni contenedores.', flush=True)
    return running


def state():
    if socket.gethostname() != 'Srv-Intranet' or not BASE.is_dir():
        raise ValueError('Destino incorrecto')
    # Recuperación debe poder inspeccionar contenedores detenidos y disco con poco espacio.
    running = {project: inspect(data[1]) for project, data in SERVICES.items()}
    result = {}
    for project, container in running.items():
        labels = inspect(container['Image'], image=True)['Config'].get('Labels') or {}
        image = container['Config']['Image']
        result[project] = {'image': image, 'image_id': container['Image'], 'running': container['State']['Running'],
                           'revision': labels.get('org.opencontainers.image.revision'),
                           'source_sha256': labels.get('local.source.sha256'),
                           'version': labels.get('org.opencontainers.image.version') or image.rsplit(':', 1)[-1]}
    return result


def unpack_compatible(release, project, expected):
    archive = release / f'{project}.tar.gz'
    if digest(archive) != expected:
        raise ValueError(f'Huella incorrecta: {project}')
    destination = release / project
    destination.mkdir()
    # Compatible con Python 3.10: nunca extraer enlaces, dispositivos ni rutas que escapen.
    with tarfile.open(archive) as package:
        for member in package.getmembers():
            name = Path(member.name)
            if name.is_absolute() or '..' in name.parts or not (member.isfile() or member.isdir()):
                raise ValueError('Ruta o enlace no permitido')
            target = destination / name
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with package.extractfile(member) as source, target.open('wb') as output:
                shutil.copyfileobj(source, output)
            target.chmod(0o755 if target.name == 'mvnw' else 0o644)
    return destination


def tools(manifest):
    spec = importlib.util.spec_from_file_location('stack_tools', HERE / 'stack_tools.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.image_name = lambda project, version: (SERVICES[project][2] + ':' + version
        if manifest['projects'][project].get('changed', True) else manifest['projects'][project]['image_id'])
    module.unpack = unpack_compatible
    return module


def verify_candidates(module, running, version, manifest):
    frontend_version = version if manifest['projects']['app-feriados'].get('changed', True) else None
    class MixedCandidates(module.Candidates):
        def _verify_candidates(self):
            for project in SERVICES:
                print(f'Verificando candidato: {project}', flush=True)
                if project == 'app-feriados':
                    module.wait_check(lambda: module.check_frontend(self.local[project], frontend_version), seconds=45)
                else:
                    module.wait_check(lambda p=project: module.check_backend(p, self.local[p]))
    candidate = MixedCandidates(running, version)
    try:
        candidate.start()
    except BaseException:
        try:
            candidate.save_diagnostics(HERE)
        except (OSError, ValueError, subprocess.CalledProcessError):
            print('No se pudo guardar el diagnóstico de candidatos.', flush=True)
        raise
    finally:
        candidate.cleanup()


def baseline(running):
    return {p: {'fingerprint': fingerprint(container),
                'env_sha256': digest(BASE / SERVICES[p][0] / '.env') if p != 'app-feriados' else None}
            for p, container in running.items()}


def validate_baseline(running):
    if baseline(running) != json.loads((HERE / 'baseline.json').read_text()):
        raise ValueError('Cambió la configuración desde la construcción; preparar una publicación nueva')


def backup(running, version, selected=None):
    directory = HERE / 'before'
    directory.mkdir(mode=0o700)
    aliases = []
    for project, container in running.items():
        if selected is not None and project not in selected:
            continue
        folder, name, repository, _ = SERVICES[project]
        save(directory / f'{name}.json', container)
        config = directory / folder
        config.mkdir(mode=0o700)
        for filename in ('.env', 'deploy.sh'):
            source = BASE / folder / filename
            if source.exists():
                shutil.copy2(source, config / filename)
                (config / filename).chmod(0o600)
        tag = f'{repository}:rollback-{version}'
        if subprocess.run(['docker', 'image', 'inspect', tag], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
            raise ValueError('La etiqueta de reversión ya existe; no se sobrescribe')
        run('docker', 'tag', container['Image'], tag)
        aliases.append(tag)
    run('docker', 'save', '-o', str(directory / 'images.tar'), *aliases)
    save(directory / 'images-sha256.json', {'sha256': digest(directory / 'images.tar')})
    for project in ('api-funcionarios', 'api-departamentos', 'newsolicitudes'):
        if selected is not None and project not in selected:
            continue
        env = environment(SERVICES[project][0])
        database = env.get('DB', 'departamentos')
        if not re.fullmatch(r'[A-Za-z0-9_]+', database):
            raise ValueError('Nombre de base inválido')
        process_env = os.environ.copy()
        process_env['MYSQL_PWD'] = env['DB_PASSWORD']
        output_path = directory / f'{database}.sql'
        fd = os.open(output_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'wb') as output:
            result = subprocess.run(['mysqldump', '--host=' + env['HOST'], '--user=' + env['DB_USER'],
                                     '--single-transaction', '--no-tablespaces', '--set-gtid-purged=OFF', database],
                                    env=process_env, stdout=output, stderr=subprocess.PIPE)
        if result.returncode:
            raise ValueError(f'No se pudo respaldar {database}; no se reemplazó ningún servicio')
        save(directory / f'{database}-sha256.json', {'sha256': digest(output_path)})
    save(HERE / 'prepared.json', {'version': version, 'prepared_at': time.time()})
    print('Respaldadas imágenes, configuraciones y bases MySQL de los servicios que se reemplazarán.', flush=True)


def engine(method, path, body=None):
    connection = http.client.HTTPConnection('localhost', timeout=60)
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.connect('/var/run/docker.sock')
    connection.sock = sock
    try:
        connection.request(method, path, body=json.dumps(body) if body is not None else None,
                           headers={'Content-Type': 'application/json'})
        response = connection.getresponse()
        raw = response.read()
        if response.status >= 400:
            raise ValueError(f'Docker rechazó {method} (HTTP {response.status})')
        return json.loads(raw) if raw else None
    finally:
        connection.close()


def config_for_image(original, image, project, module):
    image_config = inspect(image, image=True)['Config']
    config = copy.deepcopy(original['Config'])
    config['Image'] = image
    config['Hostname'] = ''
    for key in ('Entrypoint', 'Cmd', 'WorkingDir', 'User', 'Healthcheck'):
        config.pop(key, None)
        if key in image_config:
            config[key] = image_config[key]
    if project != 'app-feriados':
        config['Cmd'] = module.SAFE_ARGS
    values = dict(item.split('=', 1) for item in original['Config']['Env'])
    values.update(environment(SERVICES[project][0]))
    config['Env'] = [key + '=' + value for key, value in values.items()]
    config['Labels'] = {**(config.get('Labels') or {}), **(image_config.get('Labels') or {})}
    config['HostConfig'] = copy.deepcopy(original['HostConfig'])
    endpoints = {}
    for network, settings in original['NetworkSettings']['Networks'].items():
        aliases = [a for a in settings.get('Aliases') or [] if a not in (original['Id'][:12], original['Id'])]
        endpoints[network] = {'Aliases': aliases} if network not in ('bridge', 'host', 'none') else {}
    config['NetworkingConfig'] = {'EndpointsConfig': endpoints}
    return config


def exists(name):
    return subprocess.run(['docker', 'container', 'inspect', name], stdout=subprocess.DEVNULL,
                          stderr=subprocess.DEVNULL).returncode == 0


def wait_live(module, project, version=None):
    port = SERVICES[project][3]
    origin = f'http://127.0.0.1:{port}'
    if project == 'app-feriados':
        if version is not None:
            module.wait_check(lambda: module.check_frontend(origin, version or None), seconds=45)
        else:
            module.wait_check(lambda: module.get(origin + '/home'), seconds=45)
    elif version:
        module.wait_check(lambda: module.check_backend(project, origin))
    else:
        def health():
            if json.loads(module.get(origin + '/actuator/health')[1]).get('status') != 'UP':
                raise ValueError('Salud anterior distinta de UP')
        module.wait_check(health)


def proxy_check(module, version):
    original_get = module.get
    def via_host(url):
        request = urllib.request.Request(url, headers={'Host': 'intranet.laflorida.cl'})
        with urllib.request.urlopen(request, timeout=8) as response:
            return response.headers.get_content_type(), response.read()
    module.get = via_host
    try:
        module.check_frontend('http://192.168.10.49', version, '/feriados')
        for name in ('usuarios', 'modulos'):
            module.check_page(json.loads(via_host(f'http://192.168.10.49/solicitudes/{name}/pagina?page=0&size=1&busqueda=')[1]))
    finally:
        module.get = original_get


def verify_image_ids(manifest, active=False):
    for project, metadata in manifest['projects'].items():
        ref = SERVICES[project][1] if active else (metadata['image'] if metadata.get('changed', True) else metadata['image_id'])
        actual = inspect(ref, image=not active)
        image_id = actual['Image'] if active else actual['Id']
        if image_id != metadata['image_id']:
            raise ValueError(f'Imagen distinta de la publicación: {project}')


def activate(module, manifest, running):
    version = manifest['version']
    touched = []
    try:
        for project, original in running.items():
            if not manifest['projects'][project].get('changed', True):
                continue
            name = SERVICES[project][1]
            backup_name = name + '-before-' + version
            if exists(backup_name) or fingerprint(inspect(name)) != fingerprint(original):
                raise ValueError(f'{name}: cambió el estado o ya existe su respaldo')
            config = config_for_image(original, manifest['projects'][project]['image'], project, module)
            run('docker', 'rename', name, backup_name)
            touched.append(project)
            save(HERE / 'touched.json', touched)
            run('docker', 'stop', backup_name)
            engine('POST', '/containers/create?name=' + urllib.parse.quote(name), config)
            run('docker', 'start', name)
            # Arrancar todos antes de validar: funcionarios y departamentos se consultan entre sí.
        for project in SERVICES:
            wait_live(module, project, version if manifest['projects'][project].get('changed', True) else '')
        verify_image_ids(manifest, active=True)
        proxy_check(module, version if manifest['projects']['app-feriados'].get('changed', True) else None)
        for project in SERVICES:
            state = inspect(SERVICES[project][1])
            if not state['State']['Running'] or (manifest['projects'][project].get('changed', True) and state['RestartCount']):
                raise ValueError(f'Contenedor inestable: {project}')
        save(HERE / 'activated.json', {'version': version, 'activated_at': time.time()})
    except BaseException:
        try:
            rollback(module, version, touched)
        except BaseException:
            raise ValueError(f'ERROR: falló la reversión. Revisar {HERE}/before y ejecutar python3 {HERE}/release.py rollback') from None
        raise
    print(f'INTRANET PUBLICADA: {version}\nReversión: python3 {HERE}/release.py rollback', flush=True)


def rollback(module, version, touched=None):
    touched = touched if touched is not None else json.loads((HERE / 'touched.json').read_text())
    for project in reversed(touched):
        name = SERVICES[project][1]
        backup_name = name + '-before-' + version
        if not exists(backup_name):
            raise ValueError(f'No está el contenedor anterior de {project}; detener recuperación')
        if exists(name):
            log = HERE / f'{project}-failed.log'
            fd = os.open(log, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
            with os.fdopen(fd, 'w') as output:
                subprocess.run(['docker', 'logs', '--tail', '200', name], stdout=output, stderr=subprocess.STDOUT)
            run('docker', 'rm', '-f', name)
        run('docker', 'rename', backup_name, name)
        run('docker', 'start', name)
    for project in touched:
        previous = json.loads((HERE / 'before' / f'{SERVICES[project][1]}.json').read_text())
        if inspect(SERVICES[project][1])['Image'] != previous['Image']:
            raise ValueError('No se recuperó la imagen anterior')
        wait_live(module, project)
    save(HERE / 'rolled-back.json', {'version': version, 'at': time.time(), 'services': touched})
    print('Reversión de los servicios afectados comprobada. Las bases y los .env no se modificaron.', flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=('check', 'state', 'build', 'deploy', 'rollback'))
    mode = parser.parse_args().mode
    os.umask(0o077)
    signal.signal(signal.SIGTERM, lambda *_: (_ for _ in ()).throw(KeyboardInterrupt()))
    if mode in ('check', 'state'):
        if mode == 'check':
            check()
        else:
            print(json.dumps(state()))
        return
    if socket.gethostname() != 'Srv-Intranet' or HERE.parent != BASE / 'releases':
        raise ValueError('Runtime fuera del destino permitido')
    with (BASE / '.deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        manifest = json.loads((HERE / 'manifest.json').read_text())
        version = manifest['version']
        if not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.-]{0,63}', version) or version == 'latest' or HERE.name != version:
            raise ValueError('Versión inválida')
        if manifest.get('target') != '192.168.10.49' or set(manifest['projects']) != set(SERVICES):
            raise ValueError('El manifiesto no corresponde a intranet')
        module = tools(manifest)
        if mode == 'rollback':
            rollback(module, version)
            return
        running = check()
        if mode == 'build':
            for project, metadata in manifest['projects'].items():
                if metadata.get('previous_image_id') and running[project]['Image'] != metadata['previous_image_id']:
                    raise ValueError('Las imágenes activas cambiaron desde el plan; no se construye una propuesta obsoleta')
            save(HERE / 'baseline.json', baseline(running))
            selected = tuple(p for p, meta in manifest['projects'].items() if meta.get('changed', True))
            if not selected:
                raise ValueError('No hay commits nuevos para construir')
            all_projects = module.PROJECTS
            module.PROJECTS = selected
            try:
                module.build(HERE, manifest)
            finally:
                module.PROJECTS = all_projects
            verify_candidates(module, running, version, manifest)
            save(HERE / 'candidates-passed.json', {'version': version, 'checked_at': time.time()})
        else:
            manifest = json.loads((HERE / 'built.json').read_text())
            if not manifest.get('build_complete') or not (HERE / 'candidates-passed.json').exists():
                raise ValueError('Falta una construcción y prueba completas')
            if (HERE / 'prepared.json').exists() or (HERE / 'before').exists():
                raise ValueError('La publicación ya tiene respaldos; revisar estado antes de repetirla')
            validate_baseline(running)
            verify_image_ids(manifest)
            passed = json.loads((HERE / 'candidates-passed.json').read_text())
            if time.time() - passed.get('checked_at', 0) > 300:
                verify_candidates(module, running, version, manifest)
            selected = [p for p, meta in manifest['projects'].items() if meta.get('changed', True)]
            backup(running, version, selected)
            # Un cambio ajeno durante los respaldos no debe sobrescribirse.
            validate_baseline(check())
            activate(module, manifest, running)


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(f'Operación de intranet fallida: {error.cmd[0]} terminó con código {error.returncode}. No se muestran salidas sensibles.')
    except (OSError, ValueError, KeyError) as error:
        raise SystemExit(f'Operación de intranet fallida: {error}')
