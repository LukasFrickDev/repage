import subprocess
from pathlib import Path


HELPER = Path(__file__).parents[2] / '.github' / 'scripts' / 'detect-deploy-components.sh'
PLAN_HELPER = Path(__file__).parents[2] / '.github' / 'scripts' / 'resolve-deploy-plan.sh'


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


def run_plan(cwd: Path, state_status: str, state_sha: str, marker: int, target: str, force_frontend: int = 0) -> tuple[int, int, int, int]:
    result = subprocess.run(
        ['bash', str(PLAN_HELPER), state_status, state_sha, str(marker), target, str(force_frontend)],
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

    (tmp_path / 'docs').mkdir()
    (tmp_path / 'docs' / 'example.md').write_text('documentation', encoding='utf-8')
    docs_only = commit(tmp_path, 'docs')
    assert run_helper(tmp_path, both, docs_only) == (0, 0)


def test_component_detection_treats_cross_component_rename_as_both(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'frontend' / 'moved.txt').write_text('move', encoding='utf-8')
    base = commit(tmp_path, 'frontend source')

    (tmp_path / 'backend' / 'moved.txt').write_text('move', encoding='utf-8')
    (tmp_path / 'frontend' / 'moved.txt').unlink()
    renamed = commit(tmp_path, 'cross component rename')

    assert run_helper(tmp_path, base, renamed) == (1, 1)


def test_invalid_or_missing_previous_sha_falls_back_to_full_deploy(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'README.md').write_text('test', encoding='utf-8')
    current = commit(tmp_path, 'current')

    assert run_helper(tmp_path, '', current) == (1, 1)
    assert run_helper(tmp_path, 'not-a-sha', current) == (1, 1)


def test_deploy_plan_recovers_fully_when_marker_protects_partial_state(tmp_path):
    target = 'a' * 40

    assert run_plan(tmp_path, 'valid', 'b' * 40, 1, target) == (1, 1, 0, 1)
    assert run_plan(tmp_path, 'absent', '', 1, target) == (1, 1, 0, 1)
    assert run_plan(tmp_path, 'invalid', '', 1, target) == (1, 1, 0, 1)
    assert run_plan(tmp_path, 'valid', target, 1, target) == (0, 0, 1, 0)


def test_deploy_plan_without_marker_keeps_selective_and_noop_semantics(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'frontend' / 'app.txt').write_text('v1', encoding='utf-8')
    (tmp_path / 'backend' / 'app.txt').write_text('v1', encoding='utf-8')
    base = commit(tmp_path, 'base')

    (tmp_path / 'frontend' / 'app.txt').write_text('v2', encoding='utf-8')
    frontend_target = commit(tmp_path, 'frontend')
    assert run_plan(tmp_path, 'valid', base, 0, frontend_target) == (1, 0, 0, 0)

    (tmp_path / 'docs').mkdir()
    (tmp_path / 'docs' / 'note.md').write_text('docs', encoding='utf-8')
    docs_target = commit(tmp_path, 'docs')
    assert run_plan(tmp_path, 'valid', frontend_target, 0, docs_target) == (0, 0, 0, 0)


def test_force_frontend_preserves_selective_backend_and_marker_safety(tmp_path):
    git(tmp_path, "init")
    git(tmp_path, "config", "user.email", "tests.invalid")
    git(tmp_path, "config", "user.name", "Tests")
    (tmp_path / "frontend").mkdir()
    (tmp_path / "backend").mkdir()
    (tmp_path / "frontend" / "app.txt").write_text("v1", encoding="utf-8")
    (tmp_path / "backend" / "app.txt").write_text("v1", encoding="utf-8")
    base = commit(tmp_path, "base")

    assert run_plan(tmp_path, "valid", base, 0, base, 0) == (0, 0, 0, 0)
    assert run_plan(tmp_path, "valid", base, 0, base, 1) == (1, 0, 0, 0)

    (tmp_path / "backend" / "app.txt").write_text("v2", encoding="utf-8")
    backend_target = commit(tmp_path, "backend")
    assert run_plan(tmp_path, "valid", base, 0, backend_target, 1) == (1, 1, 0, 0)

    assert run_plan(tmp_path, "valid", "b" * 40, 1, backend_target, 1) == (1, 1, 0, 1)
    assert run_plan(tmp_path, "valid", backend_target, 1, backend_target, 1) == (0, 0, 1, 0)


def test_deploy_ignores_only_proven_non_published_paths(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'frontend' / 'app.ts').write_text('v1', encoding='utf-8')
    (tmp_path / 'backend' / 'app.py').write_text('v1', encoding='utf-8')
    base = commit(tmp_path, 'base')

    (tmp_path / 'backend' / 'tests').mkdir()
    (tmp_path / 'backend' / 'tests' / 'test_app.py').write_text('test', encoding='utf-8')
    backend_tests = commit(tmp_path, 'backend tests')
    assert run_helper(tmp_path, base, backend_tests) == (0, 0)

    (tmp_path / 'backend' / 'requirements-dev.txt').write_text('-r requirements.txt\n', encoding='utf-8')
    dev_requirements = commit(tmp_path, 'development requirements')
    assert run_helper(tmp_path, backend_tests, dev_requirements) == (0, 0)

    (tmp_path / 'frontend' / 'e2e').mkdir()
    (tmp_path / 'frontend' / 'e2e' / 'home.spec.ts').write_text('test', encoding='utf-8')
    frontend_e2e = commit(tmp_path, 'frontend e2e')
    assert run_helper(tmp_path, dev_requirements, frontend_e2e) == (0, 0)

    (tmp_path / 'backend' / 'app.py').write_text('v2', encoding='utf-8')
    (tmp_path / 'backend' / 'tests' / 'test_app.py').write_text('test v2', encoding='utf-8')
    backend_runtime = commit(tmp_path, 'backend runtime and tests')
    assert run_helper(tmp_path, frontend_e2e, backend_runtime) == (0, 1)

    (tmp_path / 'frontend' / 'app.ts').write_text('v2', encoding='utf-8')
    (tmp_path / 'frontend' / 'e2e' / 'home.spec.ts').write_text('test v2', encoding='utf-8')
    frontend_runtime = commit(tmp_path, 'frontend runtime and e2e')
    assert run_helper(tmp_path, backend_runtime, frontend_runtime) == (1, 0)
