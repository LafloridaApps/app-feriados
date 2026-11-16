#!/usr/bin/env python3
"""Construcción, prueba y reversión coordinadas; ejecutar con sudo solo en server-app."""
import argparse
import copy
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import socket
import signal
import subprocess
import tarfile
import time
import urllib.error
import urllib.request
import urllib.parse

ROOT = Path('/opt/qa-replica')
RELEASES = ROOT / 'feriados-stack-releases'
COMPOSE = ROOT / 'compose.json'
BUILT = 'built.json'
PROJECTS = ('smcapis', 'api-departamentos', 'api-funcionarios', 'newsolicitudes', 'app-feriados')
PORTS = dict(zip(PROJECTS, (8083, 8085, 8084, 8081, 5173)))
SAFE_ARGS = ['--spring.jpa.hibernate.ddl-auto=validate', '--spring.sql.init.mode=never',
             '--spring.flyway.enabled=false', '--spring.liquibase.enabled=false',
             '--app.inicializacion.habilitada=false']


def call(args, capture=False, env=None):
    result = subprocess.run(args, check=True, text=True, env=env,
                            stdout=subprocess.PIPE if capture else None,
                            stderr=subprocess.PIPE if capture else None)
    return result.stdout.strip() if capture else ''


def docker(*args, capture=False, env=None):
    return call(['docker', *args], capture=capture, env=env)


def compose(*args, path=COMPOSE, capture=False):
    return call(['docker', 'compose', '--ansi', 'never', '-f', str(path), *args], capture=capture)


def inspect(ref, image=False):
    return json.loads(docker('image' if image else 'container', 'inspect', ref, capture=True))[0]


def write_json(path, value):
    temporary = path.with_name(path.name + '.tmp')
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w') as output:
        json.dump(value, output, indent=2)
        output.write('\n')
    os.replace(temporary, path)


def write_public_manifest(source, manifest):
    # Nginx sirve este archivo con su worker sin privilegios. No contiene secretos.
    path = source / 'release.json'
    write_json(path, manifest)
    path.chmod(0o644)


def image_exists(name):
    return subprocess.run(['docker', 'image', 'inspect', name], stdout=subprocess.DEVNULL,
                          stderr=subprocess.DEVNULL).returncode == 0


def image_name(project, version):
    return f'image-{project}:{version}'


def unpack(release, project, expected):
    archive = release / f'{project}.tar.gz'
    if hashlib.sha256(archive.read_bytes()).hexdigest() != expected:
        raise ValueError(f'Huella incorrecta: {project}')
    destination = release / project
    destination.mkdir()
    with tarfile.open(archive) as package:
        for entry in package.getmembers():
            parts = Path(entry.name)
            if parts.is_absolute() or '..' in parts.parts or not (entry.isfile() or entry.isdir()):
                raise ValueError('Ruta o enlace no permitido en el paquete')
        package.extractall(destination, filter='data')
    return destination


def pin_bases(dockerfile):
    bases, lines = {}, []
    for line in dockerfile.splitlines():
        if line.startswith('FROM '):
            fields = line.split()
            tag = fields[1]
            docker('pull', tag)
            metadata = inspect(tag, image=True)
            digest = metadata['RepoDigests'][0]
            bases[tag] = {'digest': digest, 'id': metadata['Id']}
            fields[1] = digest
            line = ' '.join(fields)
        lines.append(line)
    return '\n'.join(lines) + '\n', bases


def backend_dockerfile(source):
    unit, integration = [], []
    for test in sorted((source / 'src/test').rglob('*.java')):
        text = test.read_text()
        if '@Test' not in text:
            continue
        qualified = re.search(r'package\s+([\w.]+);', text)
        name = f'{qualified[1]}.{test.stem}' if qualified else test.stem
        (integration if re.search(r'@(?:SpringBootTest|DataJpaTest|DataJdbcTest)', text) else unit).append(name)
    if not unit:
        raise ValueError('No se encontraron pruebas unitarias para el backend')
    # Solo pruebas aisladas: los contextos con bases reales se verifican como candidatos.
    tests = ','.join(unit)
    return f'''FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline
COPY src/ src/
RUN ./mvnw -B clean package -Dtest={tests} -DfailIfNoTests=true
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
''', {'unit_tests': unit, 'integration_tests_not_run_at_build': integration}


def build(release, manifest):
    # Comprobar las cinco etiquetas antes de construir cualquiera.
    for project in PROJECTS:
        if image_exists(image_name(project, manifest['version'])) or (release / project).exists():
            raise ValueError(f'La versión ya existe o está incompleta: {project}. Usar otra versión.')
    for project in PROJECTS:
        metadata = manifest['projects'][project]
        source = unpack(release, project, metadata['source_sha256'])
        if project == 'app-feriados':
            recipe = (source / 'deploy/intranet/Dockerfile').read_text()
            recipe += '\nCOPY release.json /usr/share/nginx/html/version.json\n'
        else:
            recipe, tests = backend_dockerfile(source)
            metadata.update(tests)
        recipe, metadata['bases'] = pin_bases(recipe)
        dockerfile = release / f'Dockerfile.{project}.pinned'
        dockerfile.write_text(recipe)
        if project == 'app-feriados':
            write_public_manifest(source, manifest)
        image = image_name(project, manifest['version'])
        args = ['build', '--pull=false', '-f', str(dockerfile), '-t', image,
                '--label', f'org.opencontainers.image.version={manifest["version"]}',
                '--label', f'org.opencontainers.image.revision={metadata["revision"]}',
                '--label', f'local.source.sha256={metadata["source_sha256"]}']
        if project == 'app-feriados':
            for key, value in manifest.get('frontend_build_args', {'VITE_MAIN_MENU_URL': '/intranet/home'}).items():
                args += ['--build-arg', f'{key}={value}']
        docker(*args, str(source))
        metadata.update(image=image, image_id=inspect(image, image=True)['Id'])
        write_json(release / BUILT, manifest)
    manifest['runtime_policy'] = {'backend_args': SAFE_ARGS, 'frontend_build_args': {**manifest.get('frontend_build_args', {'VITE_MAIN_MENU_URL': '/intranet/home'}), 'VITE_API_BASE_URL': ''}}
    manifest['build_complete'] = True
    write_json(release / BUILT, manifest)
    print('Las cinco imágenes están construidas; todavía no se reemplazó ningún servicio.')


def normalize(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())


def service_mapping(config):
    mapping = {}
    for project in PROJECTS:
        needles = [normalize(project)]
        if project == 'newsolicitudes':
            needles += ['newsolicitudes', 'nuevassolicitudes']
        matches = []
        for name, spec in config['services'].items():
            values = (name, spec.get('container_name', ''), spec.get('image', '').split(':')[0])
            if any(needle in normalize(value) for needle in needles for value in values):
                matches.append(name)
        if len(matches) != 1:
            raise ValueError(f'No se identifica un único servicio para {project}: {matches}. Revisar Compose.')
        mapping[project] = matches[0]
    if len(set(mapping.values())) != len(PROJECTS):
        raise ValueError('Se detectaron servicios duplicados')
    return mapping


def runtime(mapping):
    result = {}
    for project, service in mapping.items():
        ids = compose('ps', '-q', service, capture=True).splitlines()
        if len(ids) != 1:
            raise ValueError(f'{service}: se requiere un contenedor existente y activo para preservar su configuración')
        container = inspect(ids[0])
        if not container['State']['Running']:
            raise ValueError(f'{service}: el contenedor actual no está activo')
        # Un montaje de un JAR/build externo ocultaría la nueva imagen.
        if project != 'app-feriados':
            for mount in container['Mounts']:
                destination = mount['Destination'].rstrip('/')
                if destination in ('', '/app') or destination.endswith('.jar'):
                    raise ValueError(f'{service}: montaje sobre el código de la imagen; revisar antes de publicar')
        result[project] = container
    return result


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def get(url):
    with urllib.request.urlopen(url, timeout=8) as response:
        return response.headers.get_content_type(), response.read()


def check_page(data):
    page = data.get('page', data)
    if not (isinstance(data.get('content'), list) and
            type(page.get('totalElements')) is int and page['totalElements'] >= len(data['content']) and
            type(page.get('totalPages')) is int and page['totalPages'] >= 0):
        raise ValueError('Contrato de paginación inválido')
    if page['totalElements'] > 0 and page['totalPages'] == 0:
        raise ValueError('Totales de paginación inconsistentes')


def check_backend(project, base):
    health = json.loads(get(base + '/actuator/health')[1])
    if health.get('status') != 'UP':
        raise ValueError(f'{project}: salud distinta de UP')
    if project == 'newsolicitudes':
        for name in ('usuarios', 'modulos'):
            check_page(json.loads(get(base + f'/solicitudes/{name}/pagina?page=0&size=1&busqueda=')[1]))
    elif project == 'api-departamentos':
        data = json.loads(get(base + '/api/departamentos/list')[1])
        if not isinstance(data, list):
            raise ValueError('Departamentos: respuesta distinta de una lista')
    elif project == 'api-funcionarios':
        data = json.loads(get(base + '/api/funcionario/search?pattern=QA_NO_EXISTENTE_94731&pageNumber=0')[1])
        if not (isinstance(data, dict) and isinstance(data.get('funcionarios'), list)
                and all(type(data.get(key)) is int and data[key] >= 0 for key in ('currentPage', 'totalItems', 'totalPages', 'size'))):
            raise ValueError('Funcionarios: paginación de búsqueda inválida')
    elif project == 'smcapis':
        data = json.loads(get(base + '/api/inventario/catalogo-articulos')[1])
        if not isinstance(data, list):
            raise ValueError('SMC: catálogo distinto de una lista')


def check_frontend(base, version, prefix=''):
    if version is not None and json.loads(get(base + prefix + '/version.json')[1]).get('version') != version:
        raise ValueError('Versión pública incorrecta')
    html = get(base + prefix + '/home')[1]
    if b'<div id="root">' not in html:
        raise ValueError('No se encontró la aplicación React')
    assets = re.findall(rb'(?:src|href)="(/feriados/assets/[^" ]+)"', html)
    if not assets:
        raise ValueError('El HTML no contiene recursos compilados')
    for asset in assets:
        path = asset.decode() if prefix else asset.decode().removeprefix('/feriados')
        kind, content = get(base + path)
        if kind == 'text/html' or not content:
            raise ValueError('Archivo estático inválido')
    try:
        get(base + prefix + '/assets/__qa_no_existe__.js')
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return
        raise
    raise ValueError('Un recurso inexistente devolvió HTTP 200')


def _error_detail(error):
    if isinstance(error, urllib.error.HTTPError):
        return f'HTTP {error.code} en {urllib.parse.urlsplit(error.url).path}'
    if isinstance(error, urllib.error.URLError):
        reason = error.reason
        detail = f'URLError: {type(reason).__name__}'
        code = getattr(reason, 'errno', None)
        if code is not None:
            detail += f', errno={code}'
        return detail
    return type(error).__name__


def _raise_timeout(error, seconds):
    # No exponer cuerpos de respuesta, URLs con credenciales o trazas.
    raise ValueError(f'No pasó la comprobación en {seconds}s ({_error_detail(error)})') from None


def wait_check(check, seconds=150):
    deadline = time.monotonic() + seconds
    while True:
        try:
            check()
            return
        except (OSError, ValueError, KeyError, AssertionError) as error:
            if time.monotonic() >= deadline:
                _raise_timeout(error, seconds)
            time.sleep(2)


def dependency_args(project, addresses):
    result = []
    if project in ('api-departamentos', 'newsolicitudes'):
        result += [f'--api.funcionario-url={addresses["api-funcionarios"]}']
    if project in ('api-funcionarios', 'newsolicitudes'):
        result += [f'--api.departamento-url={addresses["api-departamentos"]}']
    if project == 'api-funcionarios':
        result += [f'--api.funcionario-smc-url={addresses["smcapis"]}']
    if project == 'newsolicitudes':
        result += [f'--api.externo-url={addresses["smcapis"]}']
    return result


class Candidates:
    def __init__(self, running, version):
        self.running, self.version = running, version
        self.names, self.local, self.addresses, self.ports = [], {}, {}, {}
        backends = [running[p] for p in PROJECTS[:-1]]
        modes = [c['HostConfig']['NetworkMode'] for c in backends]
        self.host = all(mode == 'host' for mode in modes)
        if not self.host:
            common = set(backends[0]['NetworkSettings']['Networks'])
            for container in backends[1:]:
                common &= set(container['NetworkSettings']['Networks'])
            common -= {'host', 'none'}
            if not common or 'host' in modes:
                raise ValueError('Los backends necesitan una red común o todos network_mode=host')
            self.network = min(common)

    def name(self, project):
        return f'qa-{project}-' + hashlib.sha256(self.version.encode()).hexdigest()[:12]

    def start(self):
        self._reserve_ports()
        self._assign_addresses()
        for project in PROJECTS:
            self._start_candidate(project)
        self._verify_candidates()

    def _reserve_ports(self):
        # Reservar puertos en conjunto reduce colisiones; Docker/Java siguen detectando carreras externas.
        for project in PROJECTS[:-1]:
            self.ports[project] = self._unique_port()

    def _unique_port(self):
        port = free_port()
        while port in self.ports.values():
            port = free_port()
        return port

    def _assign_addresses(self):
        # Definir todos los alias antes de arrancar permite configurar dependencias circulares.
        for project in PROJECTS[:-1]:
            if self.host:
                self.addresses[project] = f'http://127.0.0.1:{self.ports[project]}'
            else:
                # Red interna de Docker: el TLS lo termina el Nginx del servidor, no los contenedores.
                self.addresses[project] = f'http://{self.name(project)}:{self.ports[project]}'  # NOSONAR

    def _start_candidate(self, project):
        container = self.running[project]
        name = self.name(project)
        self.names.append(name)
        host_port = free_port() if project == 'app-feriados' else self.ports[project]
        args = self._run_args(project, name, host_port)
        environment = os.environ.copy()
        if project != 'app-feriados':
            self._copy_container_config(container, args, environment)
        args.append(image_name(project, self.version))
        if project != 'app-feriados':
            args += SAFE_ARGS + [f'--server.port={host_port}'] + dependency_args(project, self.addresses)
        docker(*args, capture=True, env=environment)
        self.local[project] = f'http://127.0.0.1:{host_port}'

    def _run_args(self, project, name, host_port):
        memory = '128m' if project == 'app-feriados' else '512m'
        args = ['run', '-d', '--name', name, '--memory', memory]
        if project == 'app-feriados':
            return args + ['-p', f'127.0.0.1:{host_port}:5173']
        if self.host:
            return args + ['--network', 'host']
        return args + ['--network', self.network, '--network-alias', name,
                       '-p', f'127.0.0.1:{host_port}:{host_port}']

    def _copy_container_config(self, container, args, environment):
        for value in container['Config'].get('Env') or []:
            key, _, val = value.partition('=')
            environment[key] = val
            args.extend(['--env', key])
        for host in container['HostConfig'].get('ExtraHosts') or []:
            args.extend(['--add-host', host])
        for group in container['HostConfig'].get('GroupAdd') or []:
            args.extend(['--group-add', str(group)])
        for mount in container['Mounts']:
            if mount['Type'] not in ('bind', 'volume'):
                continue
            source = mount['Name'] if mount['Type'] == 'volume' else mount['Source']
            args.extend(['--mount', f'type={mount["Type"]},src={source},dst={mount["Destination"]},readonly'])

    def _verify_candidates(self):
        for project in PROJECTS:
            print(f'Verificando candidato: {project}', flush=True)
            if project == 'app-feriados':
                wait_check(lambda p=project: check_frontend(self.local[p], self.version), seconds=30)
            else:
                wait_check(lambda p=project: check_backend(p, self.local[p]))
        print('Las cinco imágenes candidatas pasaron las comprobaciones.')

    def save_diagnostics(self, release):
        directory = release / ('candidate-failure-' + str(time.time_ns()))
        directory.mkdir(mode=0o700)
        states = {}
        for name in self.names:
            try:
                container = inspect(name)
            except subprocess.CalledProcessError:
                continue
            state = container['State']
            states[name] = {key: state.get(key) for key in ('Status', 'Running', 'ExitCode', 'OOMKilled')}
            print(f'Candidato {name}: estado={state.get("Status")} '
                  f'exit={state.get("ExitCode")} oom={state.get("OOMKilled")}', flush=True)
            log = directory / (name + '.log')
            fd = os.open(log, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'w') as output:
                subprocess.run(['docker', 'logs', '--tail', '200', name], stdout=output, stderr=subprocess.STDOUT)
        write_json(directory / 'states.json', states)
        print(f'Diagnóstico protegido guardado en: {directory}', flush=True)

    def cleanup(self):
        failed = []
        for name in reversed(self.names):
            result = subprocess.run(['docker', 'rm', '-f', name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if result.returncode and subprocess.run(['docker', 'container', 'inspect', name],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
                failed.append(name)
        if failed:
            raise ValueError('No se pudieron retirar candidatos: ' + ', '.join(failed))
        self.names.clear()


def live_base(container, project):
    mode = container['HostConfig']['NetworkMode']
    if mode == 'host':
        return f'http://127.0.0.1:{PORTS[project]}'
    ports = container['NetworkSettings'].get('Ports', {}).get(f'{PORTS[project]}/tcp')
    if ports:
        return f'http://127.0.0.1:{ports[0]["HostPort"]}'
    networks = container['NetworkSettings']['Networks']
    address = next((n['IPAddress'] for n in networks.values() if n.get('IPAddress')), None)
    if not address:
        raise ValueError(f'No se puede comprobar {project} desde la VM')
    # Red interna de Docker: la comprobación ocurre dentro de la VM, sin TLS.
    return f'http://{address}:{PORTS[project]}'  # NOSONAR


def _strip_build_keys(spec):
    for key in ('build', 'entrypoint', 'command', 'working_dir'):
        spec.pop(key, None)


def _is_build_mount(mount):
    if isinstance(mount, dict):
        target = mount.get('target', '')
    elif ':' in mount:
        target = mount.split(':')[1]
    else:
        target = ''
    return target.rstrip('/') in ('/usr/share/nginx/html', '/usr/share/nginx/html/feriados')


def _update_frontend(spec):
    # Solo retirar el montaje del build; conservar otros recursos del servicio.
    spec['volumes'] = [mount for mount in spec.get('volumes', []) if not _is_build_mount(mount)]
    spec['mem_limit'] = '128m'
    spec['healthcheck'] = {'test': ['CMD', 'wget', '-q', '-O', '/dev/null', 'http://127.0.0.1:5173/index.html'],
                           'interval': '15s', 'timeout': '3s', 'retries': 3, 'start_period': '5s'}


def _update_backend(spec, project, addresses):
    # Sin migraciones ni inicializaciones de datos implícitas en desarrollo local.
    spec['command'] = SAFE_ARGS + [f'--server.port={PORTS[project]}'] + dependency_args(project, addresses)
    # Un healthcheck heredado puede depender de herramientas ausentes en la imagen nueva.
    # La disponibilidad se comprueba desde la VM mediante Actuator y contratos de lectura.
    spec.pop('healthcheck', None)


def update_config(config, mapping, version, addresses):
    changed = copy.deepcopy(config)
    for project, service in mapping.items():
        spec = changed['services'][service]
        spec['image'] = image_name(project, version)
        _strip_build_keys(spec)
        if project == 'app-feriados':
            _update_frontend(spec)
        else:
            _update_backend(spec, project, addresses)
    return changed


def verify_live(mapping, manifest):
    running = runtime(mapping)
    for project in PROJECTS:
        current = running[project]
        expected = manifest['projects'][project]['image_id']
        if current['Image'] != expected:
            raise ValueError(f'{project}: el contenedor no usa la imagen solicitada')
        if project != 'app-feriados':
            wait_check(lambda p=project, container=current: check_backend(p, live_base(container, p)))
    wait_check(lambda: check_frontend('http://127.0.0.1', manifest['version'], '/feriados'), seconds=45)
    for name in ('usuarios', 'modulos'):
        check_page(json.loads(get(f'http://127.0.0.1/solicitudes/{name}/pagina?page=0&size=1&busqueda=')[1]))
    for project, previous in running.items():
        logs = subprocess.run(['docker', 'logs', '--since', previous['State']['StartedAt'], previous['Id']],
                              capture_output=True, text=True, check=True)
        if re.search(r'Application run failed|OutOfMemoryError|APPLICATION FAILED TO START', logs.stdout + logs.stderr):
            raise ValueError(f'{project}: errores de arranque en los registros')
        current = inspect(previous['Id'])
        if not current['State']['Running'] or current['RestartCount'] != previous['RestartCount']:
            raise ValueError(f'{project}: contenedor inestable')


def _service_addresses(candidate, mapping):
    addresses = {}
    for project in PROJECTS[:-1]:
        host = '127.0.0.1' if candidate.host else mapping[project]
        # Red interna de Docker: el tráfico no sale de la VM y el TLS lo termina el Nginx del servidor.
        addresses[project] = f'http://{host}:{PORTS[project]}'  # NOSONAR
    return addresses


def deploy(release, manifest):
    if not manifest.get('build_complete'):
        raise ValueError('La construcción de los cinco proyectos no está completa')
    version = manifest['version']
    for project in PROJECTS:
        if inspect(image_name(project, version), image=True)['Id'] != manifest['projects'][project]['image_id']:
            raise ValueError(f'La imagen {project} no corresponde a esta publicación')
    original = json.loads(COMPOSE.read_text())
    mapping = service_mapping(original)
    running = runtime(mapping)
    print('Servicios: ' + ', '.join(f'{p} → {s}' for p, s in mapping.items()), flush=True)
    candidate = Candidates(running, version)
    try:
        candidate.start()
    except BaseException:
        try:
            candidate.save_diagnostics(release)
        except (OSError, ValueError, subprocess.CalledProcessError):
            print('No se pudo guardar el diagnóstico de los candidatos.', flush=True)
        raise
    finally:
        candidate.cleanup()
    # Respaldar cada intento por separado, incluso al volver a una versión anterior.
    attempt = release / ('deploy-' + time.strftime('%Y%m%dT%H%M%SZ', time.gmtime()) + '-' + str(os.getpid()))
    attempt.mkdir(mode=0o700)
    rollback = copy.deepcopy(original)
    previous = {}
    for project, service in mapping.items():
        old = running[project]
        tag = f'image-{project}:rollback-{version}-{attempt.name}'
        if image_exists(tag):
            raise ValueError('Ya existe una etiqueta de reversión')
        docker('tag', old['Image'], tag)
        rollback['services'][service]['image'] = tag
        rollback['services'][service].pop('build', None)
        previous[project] = {'image_id': old['Image'], 'image': tag, 'service': service}
    write_json(attempt / 'compose.before.json', original)
    write_json(attempt / 'compose.rollback.json', rollback)
    write_json(attempt / 'previous-images.json', previous)
    addresses = _service_addresses(candidate, mapping)
    planned = update_config(original, mapping, version, addresses)
    # Validar en el directorio original para conservar rutas relativas y nombre del proyecto Compose.
    preview = ROOT / f'.compose-feriados-{version}.json'
    write_json(preview, planned)
    try:
        compose('config', '--quiet', path=preview)
    finally:
        preview.unlink(missing_ok=True)
    rollback_sh = attempt / 'rollback.sh'
    rollback_sh.write_text('#!/usr/bin/env bash\nset -euo pipefail\n'
                           + f'exec python3 {shlex.quote(str(release / "release.py"))} rollback '
                           + shlex.quote(version) + ' ' + shlex.quote(attempt.name) + '\n')
    rollback_sh.chmod(0o700)
    # Sin mutaciones propias todavía: si cambió Compose, detenerse sin revertir trabajo ajeno.
    if json.loads(COMPOSE.read_text()) != original:
        raise ValueError('Compose cambió durante la prueba; repetir la publicación')
    try:
        write_json(COMPOSE, planned)
        for project in PROJECTS:
            compose('up', '-d', '--no-deps', '--pull', 'never', mapping[project])
        verify_live(mapping, manifest)
    except BaseException:
        print('Falló el despliegue. Restaurando los cinco servicios.', flush=True)
        try:
            restore(attempt)
        except Exception:
            raise ValueError(f'ERROR: falló la reversión. Detener publicaciones y recuperar con sudo bash {attempt / "rollback.sh"}') from None
        raise
    write_json(attempt / 'result.json', {'status': 'deployed', 'version': version, 'previous': previous})
    write_json(RELEASES / 'current.json', {'version': version, 'attempt': str(attempt),
                                         'images': {p: m['image'] for p, m in manifest['projects'].items()}})
    print(f'Desplegados los cinco proyectos: {version}\nReversión: sudo bash {rollback_sh}\nhttp://server-app/feriados/')


def restore(attempt):
    rollback = json.loads((attempt / 'compose.rollback.json').read_text())
    previous = json.loads((attempt / 'previous-images.json').read_text())
    current = json.loads(COMPOSE.read_text())
    for project, metadata in previous.items():
        service = metadata['service']
        current['services'][service] = rollback['services'][service]
    write_json(COMPOSE, current)
    for project in PROJECTS:
        compose('up', '-d', '--no-deps', '--pull', 'never', previous[project]['service'])
    # Verificar imágenes y disponibilidad anteriores sin exigir los nuevos contratos.
    mapping = {p: m['service'] for p, m in previous.items()}
    for project in PROJECTS:
        metadata = previous[project]
        def healthy(p=project, expected=metadata):
            container = runtime(mapping)[p]
            if container['Image'] != expected['image_id']:
                raise ValueError('Imagen anterior no recuperada')
            if p != 'app-feriados':
                data = json.loads(get(live_base(container, p) + '/actuator/health')[1])
                if data.get('status') != 'UP':
                    raise ValueError('El backend anterior no está disponible')
        wait_check(healthy)
    get('http://127.0.0.1/feriados/home')
    write_json(attempt / 'result.json', {'status': 'rolled_back', 'previous': previous})
    write_json(RELEASES / 'current.json', {'status': 'rolled_back', 'attempt': str(attempt), 'previous': previous})
    print('Reversión comprobada; se recuperaron las cinco imágenes anteriores.', flush=True)


def _interrupt(*_):
    raise KeyboardInterrupt


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=('build', 'deploy', 'rollback'))
    parser.add_argument('version')
    parser.add_argument('attempt', nargs='?')
    args = parser.parse_args()
    if os.geteuid() != 0 or socket.gethostname() != 'server-app':
        parser.error('Ejecutar con sudo exclusivamente en server-app')
    if not re.fullmatch(r'\w[\w.-]{0,63}', args.version, re.ASCII) or args.version == 'latest':
        parser.error('Versión inválida')
    os.umask(0o077)
    signal.signal(signal.SIGTERM, _interrupt)
    (ROOT / 'feriados-releases').mkdir(exist_ok=True)
    RELEASES.mkdir(exist_ok=True)
    with (ROOT / 'feriados-releases/.release.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        release = RELEASES / args.version
        if args.mode == 'build':
            manifest = json.loads((release / 'manifest.json').read_text())
            if manifest['version'] != args.version or set(manifest['projects']) != set(PROJECTS):
                raise ValueError('Manifiesto inválido')
            build(release, manifest)
        elif args.mode == 'deploy':
            deploy(release, json.loads((release / BUILT).read_text()))
        else:
            if not args.attempt or not re.fullmatch(r'deploy-[A-Za-z0-9-]+', args.attempt):
                parser.error('Indicar el intento de despliegue a revertir')
            restore(release / args.attempt)


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        # Los comandos de Compose pueden contener configuración sensible: no mostrar su salida capturada.
        raise SystemExit(f'Publicación fallida: comando {error.cmd[0]} terminó con código {error.returncode}. '
                         'Revisar el estado y el respaldo antes de reintentar.')
    except (OSError, ValueError, KeyError) as error:
        raise SystemExit(f'Publicación fallida: {error}')
