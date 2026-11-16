"""Pruebas sin Docker ni conexiones a intranet."""
import copy
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch, MagicMock

HERE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('intranet_runtime', HERE / 'release.py')
runtime = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runtime)


def container(name):
    return {'Id': name + '-old-id', 'Image': 'sha-old-' + name,
            'Config': {'Image': 'old:tag', 'Env': ['DB_PASSWORD=privada', 'HOST=mysql-intranet'],
                       'Entrypoint': ['java', '-jar', 'old.jar'], 'User': 'old-user', 'Cmd': None},
            'HostConfig': {'PortBindings': {'8081/tcp': [{'HostPort': '8087'}]}, 'RestartPolicy': {'Name': 'always'}},
            'Mounts': [{'Source': '/rrhh', 'Destination': '/rrhh'}],
            'NetworkSettings': {'Networks': {'laflorida': {'Aliases': [name]}}}}


class IntranetTests(unittest.TestCase):
    def test_new_image_defaults_keep_intranet_environment_ports_and_volumes(self):
        original = container('solicitudes')
        before = copy.deepcopy(original)
        image = {'Config': {'Entrypoint': ['java', '-jar', '/app/app.jar'], 'Cmd': [],
                            'WorkingDir': '/app', 'User': 'nginx', 'Labels': {'version': 'new'}}}
        module = MagicMock()
        module.SAFE_ARGS = ['--spring.jpa.hibernate.ddl-auto=validate', '--app.inicializacion.habilitada=false']
        with patch.object(runtime, 'inspect', return_value=image), \
             patch.object(runtime, 'environment', return_value={'DB_PASSWORD': 'privada', 'HOST': 'mysql-intranet'}):
            config = runtime.config_for_image(original, 'new:v1', 'newsolicitudes', module)
        self.assertEqual(config['Env'], original['Config']['Env'])
        self.assertEqual(config['HostConfig'], original['HostConfig'])
        self.assertEqual(config['Entrypoint'], ['java', '-jar', '/app/app.jar'])
        self.assertEqual(config['User'], 'nginx')
        self.assertEqual(config['Cmd'], module.SAFE_ARGS)
        self.assertEqual(original, before)
        self.assertEqual(config['NetworkingConfig']['EndpointsConfig']['laflorida']['Aliases'], ['solicitudes'])

    def test_unpack_supports_python310_and_rejects_symlinks(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            archive = root / 'smcapis.tar.gz'
            with tarfile.open(archive, 'w:gz') as tar:
                info = tarfile.TarInfo('mvnw')
                info.size = 2
                tar.addfile(info, io.BytesIO(b'ok'))
            extracted = runtime.unpack_compatible(root, 'smcapis', runtime.digest(archive))
            self.assertEqual((extracted / 'mvnw').read_text(), 'ok')
            self.assertEqual((extracted / 'mvnw').stat().st_mode & 0o777, 0o755)
            bad = root / 'other.tar.gz'
            with tarfile.open(bad, 'w:gz') as tar:
                info = tarfile.TarInfo('link')
                info.type = tarfile.SYMTYPE
                info.linkname = '/etc/passwd'
                tar.addfile(info)
            with self.assertRaises(ValueError):
                runtime.unpack_compatible(root, 'other', runtime.digest(bad))

    def test_partial_failure_rolls_back_only_touched_services(self):
        with tempfile.TemporaryDirectory() as temp:
            running = {p: container(metadata[1]) for p, metadata in runtime.SERVICES.items()}
            manifest = {'version': 'intranet-test', 'projects': {p: {'image': p + ':new'} for p in running}}
            by_name = {c['Config'].get('name', runtime.SERVICES[p][1]): c for p, c in running.items()}
            with patch.object(runtime, 'HERE', Path(temp)), patch.object(runtime, 'exists', return_value=False), \
                 patch.object(runtime, 'inspect', side_effect=lambda name: by_name[name]), \
                 patch.object(runtime, 'config_for_image', return_value={}), patch.object(runtime, 'run'), \
                 patch.object(runtime, 'engine', side_effect=[None, None, ValueError('falló create')]), \
                 patch.object(runtime, 'rollback') as rollback:
                with self.assertRaisesRegex(ValueError, 'falló create'):
                    runtime.activate(MagicMock(), manifest, running)
                self.assertEqual(rollback.call_args.args[2], list(runtime.SERVICES)[:3])

    def test_unchanged_services_are_not_renamed_stopped_or_created(self):
        with tempfile.TemporaryDirectory() as temp:
            running = {p: container(data[1]) for p, data in runtime.SERVICES.items()}
            for value in running.values():
                value.update(State={'Running': True}, RestartCount=0)
            by_name = {runtime.SERVICES[p][1]: value for p, value in running.items()}
            manifest = {'version': 'intranet-test', 'projects': {
                p: {'image': p + ':new', 'changed': p == 'smcapis'} for p in running}}
            with patch.object(runtime, 'HERE', Path(temp)), patch.object(runtime, 'exists', return_value=False), \
                 patch.object(runtime, 'inspect', side_effect=lambda name: by_name[name]), \
                 patch.object(runtime, 'config_for_image', return_value={}), \
                 patch.object(runtime, 'run') as run, patch.object(runtime, 'engine') as engine, \
                 patch.object(runtime, 'wait_live'), patch.object(runtime, 'verify_image_ids'), \
                 patch.object(runtime, 'proxy_check'):
                runtime.activate(MagicMock(), manifest, running)
            self.assertEqual(engine.call_count, 1)
            operations = [call.args for call in run.call_args_list]
            self.assertEqual(operations, [
                ('docker', 'rename', 'smcapis-container', 'smcapis-container-before-intranet-test'),
                ('docker', 'stop', 'smcapis-container-before-intranet-test'),
                ('docker', 'start', 'smcapis-container')])

    def test_dotenv_is_literal_and_never_executes_shell(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            directory = root / 'new-solicitudes'
            directory.mkdir()
            (directory / '.env').write_text('DB_PASSWORD=$(touch /tmp/no-ejecutar)\nHOST=192.168.10.43\n')
            with patch.object(runtime, 'BASE', root):
                result = runtime.environment('new-solicitudes')
            self.assertEqual(result['DB_PASSWORD'], '$(touch /tmp/no-ejecutar)')
            self.assertEqual(result['HOST'], '192.168.10.43')

    def test_proxy_check_uses_intranet_host_and_restores_http_helper(self):
        module = MagicMock()
        original_get = module.get
        seen = []
        response = MagicMock()
        response.__enter__.return_value = response
        response.headers.get_content_type.return_value = 'application/json'
        response.read.return_value = b'{"content":[],"totalElements":0,"totalPages":0}'
        def capture(request, **kwargs):
            seen.append(request.get_header('Host'))
            return response
        with patch.object(runtime.urllib.request, 'urlopen', side_effect=capture):
            runtime.proxy_check(module, 'intranet-test')
        self.assertEqual(seen, ['intranet.laflorida.cl', 'intranet.laflorida.cl'])
        self.assertIs(module.get, original_get)


if __name__ == '__main__':
    unittest.main()
