"""Pruebas del empaquetado y de la transacción sin Docker, red ni bases de datos."""
import copy
import importlib.util
import io
import json
import shlex
import subprocess
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch, MagicMock

HERE = Path(__file__).resolve().parents[1]


def module(name):
    spec = importlib.util.spec_from_file_location(name, HERE / f'{name}.py')
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


release = module('release')
publisher = module('publicar')


def fixture():
    result = {'services': {p: {'image': f'image-{p}:old', 'environment': {'SECRET': 'preservar'},
                               'ports': [f'{release.PORTS[p]}:{release.PORTS[p]}'],
                               'volumes': ['/datos:/datos'], 'networks': ['qa']} for p in release.PROJECTS}}
    result['services']['mysql'] = {'image': 'mysql:8', 'volumes': ['mysql:/var/lib/mysql']}
    result['services']['app-feriados']['volumes'] += ['/build:/usr/share/nginx/html:ro']
    return result


class ReleaseTests(unittest.TestCase):
    def test_connection_error_reports_errno(self):
        def refused():
            raise release.urllib.error.URLError(ConnectionRefusedError(111, 'refused'))
        with self.assertRaisesRegex(ValueError, 'ConnectionRefusedError, errno=111'):
            release.wait_check(refused, seconds=0)

    def test_failed_candidates_save_private_diagnostics_before_cleanup(self):
        with tempfile.TemporaryDirectory() as tmp:
            candidate = release.Candidates.__new__(release.Candidates)
            candidate.names = ['qa-app-feriados-test']
            state = {'Status': 'exited', 'Running': False, 'ExitCode': 1, 'OOMKilled': False}
            with patch.object(release, 'inspect', return_value={'State': state}), \
                 patch.object(release.subprocess, 'run'):
                candidate.save_diagnostics(Path(tmp))
            directory = next(Path(tmp).iterdir())
            self.assertEqual(directory.stat().st_mode & 0o777, 0o700)
            self.assertEqual((directory / 'qa-app-feriados-test.log').stat().st_mode & 0o777, 0o600)
            self.assertEqual(json.loads((directory / 'states.json').read_text())['qa-app-feriados-test'], state)

    def test_public_image_manifest_is_readable_by_nginx_under_private_umask(self):
        import os
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            old = os.umask(0o077)
            try:
                release.write_public_manifest(root, {'version': 'qa-test'})
                release.write_json(root / 'compose.backup.json', {'secret': 'privado'})
            finally:
                os.umask(old)
            self.assertEqual((root / 'release.json').stat().st_mode & 0o777, 0o644)
            self.assertEqual((root / 'compose.backup.json').stat().st_mode & 0o777, 0o600)

    def test_mapping_rejects_ambiguous_service_instead_of_replacing_another(self):
        config = fixture()
        self.assertEqual(release.service_mapping(config)['newsolicitudes'], 'newsolicitudes')
        config['services']['other'] = {'image': 'image-newsolicitudes:other'}
        with self.assertRaises(ValueError):
            release.service_mapping(config)

    def test_changes_only_selected_services_preserving_database_and_backend_volumes(self):
        original = fixture()
        addresses = {p: f'http://{p}:{release.PORTS[p]}' for p in release.PROJECTS[:-1]}
        updated = release.update_config(original, release.service_mapping(original), 'qa-test', addresses)
        self.assertEqual(updated['services']['mysql'], original['services']['mysql'])
        for project in release.PROJECTS[:-1]:
            spec = updated['services'][project]
            self.assertEqual(spec['environment'], original['services'][project]['environment'])
            self.assertEqual(spec['volumes'], ['/datos:/datos'])
            self.assertEqual(spec['networks'], ['qa'])
            self.assertIn('--spring.jpa.hibernate.ddl-auto=validate', spec['command'])
            self.assertIn('--app.inicializacion.habilitada=false', spec['command'])
            self.assertEqual(spec['image'], f'image-{project}:qa-test')
        self.assertEqual(updated['services']['app-feriados']['volumes'], ['/datos:/datos'])
        self.assertEqual(original, fixture())

    def test_rejects_false_page_totals(self):
        release.check_page({'content': [], 'page': {'totalElements': 0, 'totalPages': 0}})
        for value in ({'content': [1], 'totalElements': 0, 'totalPages': 0},
                      {'content': [], 'totalElements': 2, 'totalPages': 0},
                      {'content': [], 'totalElements': True, 'totalPages': 1}):
            with self.assertRaises(ValueError):
                release.check_page(value)

    def test_safe_archive_rejects_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            archive = root / 'smcapis.tar.gz'
            with tarfile.open(archive, 'w:gz') as tar:
                info = tarfile.TarInfo('../escape')
                info.size = 1
                tar.addfile(info, io.BytesIO(b'x'))
            digest = release.hashlib.sha256(archive.read_bytes()).hexdigest()
            with self.assertRaises(ValueError):
                release.unpack(root, 'smcapis', digest)
            self.assertFalse((root.parent / 'escape').exists())

    def test_candidates_use_readonly_mounts_and_never_put_secret_values_in_arguments(self):
        for host in (True, False):
            with self.subTest(host_network=host):
                running = {p: {'HostConfig': {'NetworkMode': 'host' if host else 'qa_default'},
                               'NetworkSettings': {'Networks': {'qa_default': {}}},
                               'Config': {'Env': ['PASSWORD=valor-privado']},
                               'Mounts': [{'Type': 'bind', 'Source': '/datos', 'Destination': '/datos'}]}
                           for p in release.PROJECTS}
                with patch.object(release, 'free_port', side_effect=range(45001, 45020)), \
                     patch.object(release, 'docker') as docker, \
                     patch.object(release, 'check_backend'), patch.object(release, 'check_frontend'):
                    candidates = release.Candidates(running, 'qa-test')
                    candidates.start()
                    self.assertEqual(docker.call_count, 5)
                    for operation in docker.call_args_list[:4]:
                        self.assertNotIn('valor-privado', ' '.join(operation.args))
                        self.assertEqual(operation.kwargs['env']['PASSWORD'], 'valor-privado')
                        self.assertIn('type=bind,src=/datos,dst=/datos,readonly', operation.args)
                        self.assertIn('--app.inicializacion.habilitada=false', operation.args)
                    funcionarios = docker.call_args_list[2].args
                    self.assertIn('--api.funcionario-smc-url=' + candidates.addresses['smcapis'], funcionarios)
                    self.assertIn('--api.departamento-url=' + candidates.addresses['api-departamentos'], funcionarios)

    def test_candidate_failure_does_not_modify_compose(self):
        self.exercise_deploy(candidate_failure=True)

    def test_partial_replacement_restores_all_five(self):
        self.exercise_deploy(candidate_failure=False)

    def exercise_deploy(self, candidate_failure):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            compose_file = root / 'compose.json'
            original = fixture()
            compose_file.write_text(json.dumps(original))
            manifest = {'version': 'qa-test', 'build_complete': True,
                        'projects': {p: {'image_id': 'sha-new-' + p} for p in release.PROJECTS}}
            running = {p: {'Image': 'sha-old-' + p} for p in release.PROJECTS}
            candidates = MagicMock()
            candidates.host = True
            if candidate_failure:
                candidates.start.side_effect = ValueError('No disponible')
            def compose(*args, **kwargs):
                if args[0] == 'up':
                    raise ValueError('Fallo en el reemplazo')
            with patch.object(release, 'ROOT', root), patch.object(release, 'RELEASES', root), \
                 patch.object(release, 'COMPOSE', compose_file), \
                 patch.object(release, 'inspect', side_effect=lambda reference, **_: {'Id': 'sha-new-' + reference.split(':')[0][6:]}), \
                 patch.object(release, 'runtime', return_value=running), \
                 patch.object(release, 'Candidates', return_value=candidates), \
                 patch.object(release, 'image_exists', return_value=False), \
                 patch.object(release, 'docker'), patch.object(release, 'compose', side_effect=compose), \
                 patch.object(release, 'restore') as restore:
                with self.assertRaises(ValueError):
                    release.deploy(root, manifest)
                candidates.cleanup.assert_called_once()
                if candidate_failure:
                    restore.assert_not_called()
                    self.assertEqual(json.loads(compose_file.read_text()), original)
                else:
                    restore.assert_called_once()
                    backup = json.loads((restore.call_args.args[0] / 'previous-images.json').read_text())
                    self.assertEqual(set(backup), set(release.PROJECTS))

    def test_restore_changes_only_affected_services_and_checks_previous_images(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            original = fixture()
            current = copy.deepcopy(original)
            current['services']['mysql']['image'] = 'mysql:updated-independently'
            compose_file = root / 'compose.json'
            compose_file.write_text(json.dumps(current))
            (root / 'compose.rollback.json').write_text(json.dumps(original))
            previous = {p: {'image_id': 'sha-old-' + p, 'service': p} for p in release.PROJECTS}
            (root / 'previous-images.json').write_text(json.dumps(previous))
            containers = {p: {'Image': 'sha-old-' + p, 'HostConfig': {'NetworkMode': 'host'}} for p in release.PROJECTS}
            with patch.object(release, 'COMPOSE', compose_file), patch.object(release, 'RELEASES', root), \
                 patch.object(release, 'compose') as compose, \
                 patch.object(release, 'runtime', return_value=containers), \
                 patch.object(release, 'get', return_value=('application/json', b'{"status":"UP"}')):
                release.restore(root)
                self.assertEqual(compose.call_count, 5)
                restored = json.loads(compose_file.read_text())
                self.assertEqual(restored['services']['mysql']['image'], 'mysql:updated-independently')
                for project in release.PROJECTS:
                    self.assertEqual(restored['services'][project], original['services'][project])


class PackageTests(unittest.TestCase):
    def test_upload_is_promoted_before_build_and_existing_version_is_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            staging = root / 'upload with spaces'
            staging.mkdir()
            for name in ['manifest.json', 'release.py', *(f'{p}.tar.gz' for p in release.PROJECTS)]:
                (staging / name).write_text('test')
            (staging / 'release.sh').write_text('printf "%s\\n" "$1" >> "$(dirname "$0")/actions"\n')
            remote = '/opt/qa-replica/feriados-stack-releases/qa-test'
            command = publisher.remote_action(str(staging), remote, 'qa-test', True)
            parts = shlex.split(command)
            self.assertEqual(parts[:3], ['sudo', 'bash', '-c'])
            body = parts[3].replace('/opt/qa-replica/feriados-stack-releases', str(root / 'protected'))
            subprocess.run(['bash', '-c', body], check=True, capture_output=True)
            deployed = root / 'protected/qa-test'
            self.assertEqual((deployed / 'actions').read_text(), 'build\ndeploy\n')
            self.assertEqual((deployed / 'manifest.json').stat().st_mode & 0o777, 0o600)
            duplicate = subprocess.run(['bash', '-c', body], capture_output=True)
            self.assertNotEqual(duplicate.returncode, 0)
            self.assertEqual((deployed / 'actions').read_text(), 'build\ndeploy\n')

    def test_reproducible_archive_and_exclusion_of_secrets(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ('pom.xml', 'mvnw', 'src/main/resources/application.properties', '.mvn/wrapper/maven-wrapper.properties', 'src/.env', 'src/private.key'):
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('spring.datasource.password=${PASSWORD}\n' if name.endswith('application.properties') else 'test')
            files = publisher.source_files(root, False)
            self.assertNotIn(root / 'src/.env', files)
            self.assertNotIn(root / 'src/private.key', files)
            first = publisher.archive(root, files, root / 'one.tar.gz')
            self.assertEqual(first, publisher.archive(root, files, root / 'two.tar.gz'))
            config = root / 'src/main/resources/application.properties'
            config.write_text('spring.datasource.password=no-empaquetar\n')
            with self.assertRaises(ValueError):
                publisher.source_files(root, False)


if __name__ == '__main__':
    unittest.main()
