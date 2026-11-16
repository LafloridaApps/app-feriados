"""Integración aislada y promoción de main local. Nunca fetch/push ni reset --hard."""
import json
from pathlib import Path
import subprocess


def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], text=True, stderr=subprocess.PIPE).rstrip("\n")


def clean(root):
    return not git(root, 'status', '--porcelain=v1', '--untracked-files=all')


def commit_pending(root, message, version):
    if clean(root):
        return
    if not message:
        raise ValueError(f'{root}: hay cambios sin commit. Confírmalos antes o usa --commit-message "mensaje".')
    branch = git(root, 'branch', '--show-current')
    if not branch:
        raise ValueError(f'{root}: HEAD separado; selecciona una rama de trabajo')
    if branch == 'main':
        git(root, 'switch', '-c', f'codex/preparar-{version}')
    # No usar --force: se respetan los .gitignore. No permitir credenciales en el commit.
    paths = git(root, 'status', '--porcelain=v1', '--untracked-files=all', '-z').split('\x00')
    for line in paths:
        path = line[3:] if len(line) > 3 else line
        parts = Path(path).parts
        if any(p.startswith('.env') or p in ('.aws', '.ssh', 'credentials') for p in parts) or Path(path).suffix in ('.pem', '.key', '.p12', '.pfx', '.jks'):
            raise ValueError(f'No se confirma un archivo sensible: {path}')
    git(root, 'add', '--all')
    git(root, 'commit', '-m', message)


def prepare(root, checkout, version, message=None):
    root = Path(git(root, 'rev-parse', '--show-toplevel'))
    commit_pending(root, message, version)
    source = git(root, 'rev-parse', 'HEAD')
    previous = git(root, 'rev-parse', 'main')
    git(root, 'worktree', 'add', '--detach', str(checkout), previous)
    try:
        git(checkout, 'merge', '--no-edit', '-m', f'Merge para publicar {version}', source)
        candidate = git(checkout, 'rev-parse', 'HEAD')
    except subprocess.CalledProcessError:
        git(root, 'worktree', 'remove', '--force', str(checkout))
        raise ValueError(f'Conflicto al fusionar {root.name} con main. Resuelve la fusión en tu rama; main no cambió.') from None
    git(root, 'update-ref', f'refs/deployments/intranet/{version}', candidate)
    return {'repository': str(root), 'source_revision': source, 'previous_main': previous,
            'revision': candidate, 'tree': git(checkout, 'rev-parse', 'HEAD^{tree}')}


def remove(root, checkout):
    git(root, 'worktree', 'remove', '--force', str(checkout))


def active_revision(root, active):
    revision = active.get('revision')
    if not revision and active.get('version'):
        try:
            revision = git(root, 'rev-parse', '--verify', active['version'] + '^{commit}')
        except subprocess.CalledProcessError:
            pass
    if not revision:
        raise ValueError(f'{root}: imagen activa sin commit reconocible; registrar su procedencia antes de publicar')
    try:
        return git(root, 'rev-parse', '--verify', revision + '^{commit}')
    except subprocess.CalledProcessError:
        raise ValueError(f'{root}: falta el commit activo {revision}; sincroniza el repositorio antes de publicar') from None


def select(root, prepared, active):
    deployed = active_revision(root, active)
    candidate = prepared['revision']
    result = subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', candidate, deployed],
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if result.returncode not in (0, 1):
        raise ValueError('No se pudo comparar el commit candidato con el activo')
    if result.returncode == 0:
        # La imagen ya incluye todos los commits; main debe apuntar al commit realmente activo.
        prepared['revision'] = deployed
        prepared['tree'] = git(root, 'rev-parse', deployed + '^{tree}')
        return False
    result = subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', deployed, candidate],
                            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if result.returncode:
        raise ValueError(f'{root}: la propuesta no contiene el commit activo. Integra primero esa historia para evitar una regresión.')
    return True


def main_checkout(root):
    for block in git(root, 'worktree', 'list', '--porcelain').split('\n\n'):
        lines = block.splitlines()
        if 'branch refs/heads/main' in lines:
            return Path(lines[0].removeprefix('worktree '))
    return None


def move_main(root, expected, target, allow_rewind=False):
    if git(root, 'rev-parse', 'main') != expected:
        raise ValueError(f'{root}: main cambió durante la publicación; no se sobrescribe')
    if target == expected:
        return
    checkout = main_checkout(root)
    if checkout:
        if not clean(checkout):
            raise ValueError(f'{checkout}: main tiene cambios pendientes; no se modifica')
        # Mantener índice y archivos coherentes sin descartar cambios ajenos.
        if allow_rewind:
            git(checkout, 'read-tree', '-u', '-m', expected, target)
            git(root, 'update-ref', 'refs/heads/main', target, expected)
        else:
            git(checkout, 'merge', '--ff-only', target)
    else:
        git(root, 'update-ref', 'refs/heads/main', target, expected)


def promote(records):
    # Validar todos antes de mover el primero.
    for record in records.values():
        root = record['repository']
        if git(root, 'rev-parse', 'main') != record['previous_main']:
            raise ValueError(f'{root}: main cambió desde la preparación')
        checkout = main_checkout(root)
        if checkout and not clean(checkout):
            raise ValueError(f'{root}: main contiene cambios pendientes')
    moved = []
    try:
        for record in records.values():
            move_main(record['repository'], record['previous_main'], record['revision'])
            moved.append(record)
    except BaseException:
        for record in reversed(moved):
            move_main(record['repository'], record['revision'], record['previous_main'], allow_rewind=True)
        raise


def receipt_path(root, version):
    common = Path(git(root, 'rev-parse', '--git-common-dir'))
    if not common.is_absolute():
        common = Path(root) / common
    return common.resolve() / 'intranet-publicaciones' / (version + '.json')


def save_receipt(root, version, value):
    path = receipt_path(root, version)
    path.parent.mkdir(mode=0o700, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + '\n')
    path.chmod(0o600)
    return path
