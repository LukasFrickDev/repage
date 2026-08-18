import subprocess
from pathlib import Path


HELPER = Path(__file__).parents[2] / '.github' / 'scripts' / 'detect-deploy-components.sh'


def git(cwd: Path, *args: str) -> str:
    result = subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True, check=True)
    return result.stdout.strip()


def commit(cwd: Path, message: str) -> str:
    git(cwd, 'add', '.')
    git(cwd, 'commit', '-m', message)
    return git(cwd, 'rev-parse', 'HEAD')


def run_helper(cwd: Path, previous: str, current: str) -> tuple[int, int]:
    result = subprocess.run(
        ['bash', str(HELPER), previous, current],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=True,
    )
    return tuple(map(int, result.stdout.split()))


def test_component_detection_covers_application_change_matrix(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'frontend' / 'app.txt').write_text('v1', encoding='utf-8')
    (tmp_path / 'backend' / 'app.txt').write_text('v1', encoding='utf-8')
    base = commit(tmp_path, 'base')

    assert run_helper(tmp_path, base, base) == (0, 0)

    (tmp_path / 'frontend' / 'app.txt').write_text('v2', encoding='utf-8')
    frontend_only = commit(tmp_path, 'frontend')
    assert run_helper(tmp_path, base, frontend_only) == (1, 0)

    (tmp_path / 'backend' / 'app.txt').write_text('v2', encoding='utf-8')
    both = commit(tmp_path, 'backend after frontend')
    assert run_helper(tmp_path, base, both) == (1, 1)
    assert run_helper(tmp_path, frontend_only, both) == (0, 1)


def test_invalid_or_missing_previous_sha_falls_back_to_full_deploy(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'README.md').write_text('test', encoding='utf-8')
    current = commit(tmp_path, 'current')

    assert run_helper(tmp_path, '', current) == (1, 1)
    assert run_helper(tmp_path, 'not-a-sha', current) == (1, 1)
