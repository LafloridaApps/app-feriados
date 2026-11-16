"""Integraciones Git reales en repositorios temporales; sin remotos ni servidor."""
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

HERE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('git_release_tested', HERE / 'git_release.py')
gitflow = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gitflow)


class GitReleaseTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.root = self.base / 'repo'
        self.root.mkdir()
        self.git('init', '--initial-branch=main')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('config', 'user.name', 'Test')
        self.commit('base')
        self.initial = self.git('rev-parse', 'HEAD')
        self.git('switch', '-c', 'feature')

    def tearDown(self):
        self.temp.cleanup()

    def git(self, *args):
        return gitflow.git(self.root, *args)

    def commit(self, text):
        (self.root / 'code.txt').write_text(text)
        self.git('add', 'code.txt')
        self.git('commit', '-m', text)

    def test_integration_does_not_move_main_until_verified_promotion(self):
        self.commit('new')
        source = self.git('rev-parse', 'HEAD')
        record = gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test')
        self.assertEqual(self.git('rev-parse', 'main'), self.initial)
        self.assertEqual(record['revision'], source)
        self.assertTrue(gitflow.select(self.root, record, {'revision': self.initial}))
        gitflow.promote({'project': record})
        self.assertEqual(self.git('rev-parse', 'main'), source)
        self.assertEqual(self.git('branch', '--show-current'), 'feature')
        gitflow.remove(self.root, self.base / 'candidate')

    def test_commit_already_deployed_is_skipped_and_main_can_be_aligned(self):
        self.commit('already deployed')
        deployed = self.git('rev-parse', 'HEAD')
        record = gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test')
        self.assertFalse(gitflow.select(self.root, record, {'revision': deployed}))
        self.assertEqual(self.git('rev-parse', 'main'), self.initial)
        gitflow.promote({'project': record})
        self.assertEqual(self.git('rev-parse', 'main'), deployed)
        gitflow.remove(self.root, self.base / 'candidate')

    def test_dirty_workspace_requires_explicit_commit_message(self):
        (self.root / 'code.txt').write_text('pending')
        with self.assertRaisesRegex(ValueError, 'sin commit'):
            gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test')
        self.assertEqual(self.git('rev-parse', 'main'), self.initial)
        record = gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test', 'commit pending')
        self.assertTrue(gitflow.clean(self.root))
        self.assertNotEqual(record['source_revision'], self.initial)
        gitflow.remove(self.root, self.base / 'candidate')

    def test_conflict_does_not_change_main_or_source_worktree(self):
        self.commit('feature changes')
        feature = self.git('rev-parse', 'HEAD')
        self.git('switch', 'main')
        self.commit('main changes')
        main = self.git('rev-parse', 'HEAD')
        self.git('switch', 'feature')
        with self.assertRaisesRegex(ValueError, 'Conflicto'):
            gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test')
        self.assertEqual(self.git('rev-parse', 'main'), main)
        self.assertEqual(self.git('rev-parse', 'HEAD'), feature)
        self.assertTrue(gitflow.clean(self.root))

    def test_concurrent_main_move_is_not_overwritten(self):
        self.commit('new')
        record = gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test')
        self.git('update-ref', 'refs/heads/main', record['revision'], self.initial)
        with self.assertRaisesRegex(ValueError, 'cambió'):
            gitflow.promote({'project': record})
        gitflow.remove(self.root, self.base / 'candidate')

    def test_rollback_updates_main_checkout_and_retains_new_commit(self):
        self.commit('new')
        target = self.git('rev-parse', 'HEAD')
        self.git('switch', 'main')
        gitflow.move_main(self.root, self.initial, target)
        self.assertEqual((self.root / 'code.txt').read_text(), 'new')
        gitflow.move_main(self.root, target, self.initial, allow_rewind=True)
        self.assertEqual((self.root / 'code.txt').read_text(), 'base')
        self.assertTrue(gitflow.clean(self.root))
        self.assertEqual(self.git('rev-parse', 'feature'), target)

    def test_optional_commit_on_main_preserves_main_until_publication(self):
        self.git('switch', 'main')
        (self.root / 'code.txt').write_text('pending on main')
        record = gitflow.prepare(self.root, self.base / 'candidate', 'intranet-test', 'commit pending')
        self.assertEqual(self.git('rev-parse', 'main'), self.initial)
        self.assertEqual(self.git('branch', '--show-current'), 'codex/preparar-intranet-test')
        self.assertNotEqual(record['revision'], self.initial)
        gitflow.remove(self.root, self.base / 'candidate')

    def test_sensitive_file_is_not_staged_or_committed(self):
        (self.root / '.env').write_text('PASSWORD=private')
        with self.assertRaisesRegex(ValueError, 'sensible'):
            gitflow.commit_pending(self.root, 'commit', 'intranet-test')
        self.assertEqual(self.git('rev-parse', 'HEAD'), self.initial)
        self.assertEqual(self.git('diff', '--cached', '--name-only'), '')

    def test_missing_revision_stops_instead_of_republishing_blindly(self):
        with self.assertRaisesRegex(ValueError, 'sin commit'):
            gitflow.active_revision(self.root, {})
        self.git('tag', 'intranet-old')
        self.assertEqual(gitflow.active_revision(self.root, {'version': 'intranet-old'}), self.initial)


if __name__ == '__main__':
    unittest.main()
