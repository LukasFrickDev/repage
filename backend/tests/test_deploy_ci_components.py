import subprocess
from pathlib import Path


HELPER = Path(__file__).parents[2] / '.github' / 'scripts' / 'detect-ci-components.sh'


def git(cwd: Path, *args: str) -> str:
    result = subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True, check=True)
    return result.stdout.strip()


def commit(cwd: Path, message: str) -> str:
    git(cwd, 'add', '.')
    git(cwd, 'commit', '-m', message)
    return git(cwd, 'rev-parse', 'HEAD')


def run_helper(cwd: Path, base: str, head: str) -> tuple[int, int]:
    result = subprocess.run(
        ['bash', str(HELPER), base, head], cwd=cwd, capture_output=True, text=True, check=True
    )
    return tuple(map(int, result.stdout.split()))


def test_ci_detection_is_conservative_for_components_and_infrastructure(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    for directory in ('frontend', 'backend', 'docs', '.github/workflows', '.github/scripts'):
        (tmp_path / directory).mkdir(parents=True, exist_ok=True)
    (tmp_path / 'frontend' / 'app.txt').write_text('v1', encoding='utf-8')
    (tmp_path / 'backend' / 'app.txt').write_text('v1', encoding='utf-8')
    (tmp_path / '.github' / 'workflows' / 'ci.yml').write_text('ci', encoding='utf-8')
    base = commit(tmp_path, 'base')

    (tmp_path / 'frontend' / 'app.txt').write_text('v2', encoding='utf-8')
    frontend = commit(tmp_path, 'frontend')
    assert run_helper(tmp_path, base, frontend) == (1, 0)

    (tmp_path / 'backend' / 'app.txt').write_text('v2', encoding='utf-8')
    backend = commit(tmp_path, 'backend')
    assert run_helper(tmp_path, frontend, backend) == (0, 1)

    (tmp_path / 'docs' / 'note.md').write_text('docs', encoding='utf-8')
    docs = commit(tmp_path, 'docs')
    assert run_helper(tmp_path, backend, docs) == (0, 0)

    (tmp_path / '.github' / 'workflows' / 'ci.yml').write_text('changed', encoding='utf-8')
    ci = commit(tmp_path, 'ci')
    assert run_helper(tmp_path, docs, ci) == (1, 1)

    (tmp_path / 'unknown.txt').write_text('unknown', encoding='utf-8')
    unknown = commit(tmp_path, 'unknown')
    assert run_helper(tmp_path, ci, unknown) == (1, 1)


def test_workflow_dispatch_forces_full_ci(tmp_path):
    result = subprocess.run(
        ['bash', str(HELPER), '--full'], cwd=tmp_path, capture_output=True, text=True, check=True
    )
    assert result.stdout.strip() == '1 1'


def test_instruction_only_changes_are_not_heavy_ci_changes(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'README.md').write_text('base', encoding='utf-8')
    base = commit(tmp_path, 'base')

    (tmp_path / 'frontend' / 'AGENTS.md').write_text('frontend instructions', encoding='utf-8')
    frontend_agents = commit(tmp_path, 'frontend instructions')
    assert run_helper(tmp_path, base, frontend_agents) == (0, 0)

    (tmp_path / 'backend' / 'AGENTS.md').write_text('backend instructions', encoding='utf-8')
    backend_agents = commit(tmp_path, 'backend instructions')
    assert run_helper(tmp_path, frontend_agents, backend_agents) == (0, 0)

    (tmp_path / '.github' / 'scripts').mkdir(parents=True)
    (tmp_path / '.github' / 'scripts' / 'resolve-deploy-plan.sh').write_text('script', encoding='utf-8')
    resolve_plan = commit(tmp_path, 'resolve plan')
    assert run_helper(tmp_path, backend_agents, resolve_plan) == (0, 1)


def test_tests_and_development_configuration_trigger_component_ci(tmp_path):
    git(tmp_path, 'init')
    git(tmp_path, 'config', 'user.email', 'tests@example.invalid')
    git(tmp_path, 'config', 'user.name', 'Tests')
    (tmp_path / 'frontend').mkdir()
    (tmp_path / 'backend').mkdir()
    (tmp_path / 'README.md').write_text('base', encoding='utf-8')
    base = commit(tmp_path, 'base')

    (tmp_path / 'frontend' / 'e2e').mkdir()
    (tmp_path / 'frontend' / 'e2e' / 'home.spec.ts').write_text('test', encoding='utf-8')
    frontend_e2e = commit(tmp_path, 'frontend e2e')
    assert run_helper(tmp_path, base, frontend_e2e) == (1, 0)

    (tmp_path / 'frontend' / 'playwright.config.ts').write_text('config', encoding='utf-8')
    playwright_config = commit(tmp_path, 'playwright config')
    assert run_helper(tmp_path, frontend_e2e, playwright_config) == (1, 0)

    (tmp_path / 'backend' / 'tests').mkdir()
    (tmp_path / 'backend' / 'tests' / 'test_app.py').write_text('test', encoding='utf-8')
    backend_tests = commit(tmp_path, 'backend tests')
    assert run_helper(tmp_path, playwright_config, backend_tests) == (0, 1)

    (tmp_path / 'backend' / 'requirements-dev.txt').write_text('-r requirements.txt\n', encoding='utf-8')
    dev_requirements = commit(tmp_path, 'development requirements')
    assert run_helper(tmp_path, backend_tests, dev_requirements) == (0, 1)

    (tmp_path / 'backend' / 'pytest.ini').write_text('[pytest]\n', encoding='utf-8')
    pytest_config = commit(tmp_path, 'pytest config')
    assert run_helper(tmp_path, dev_requirements, pytest_config) == (0, 1)

    (tmp_path / '.github').mkdir()
    (tmp_path / '.github' / 'workflows').mkdir()
    (tmp_path / '.github' / 'workflows' / 'ci.yml').write_text('ci', encoding='utf-8')
    ci_workflow = commit(tmp_path, 'ci workflow')
    assert run_helper(tmp_path, pytest_config, ci_workflow) == (1, 1)

    (tmp_path / '.github' / 'scripts').mkdir()
    (tmp_path / '.github' / 'scripts' / 'detect-ci-components.sh').write_text('detector', encoding='utf-8')
    ci_detector = commit(tmp_path, 'ci detector')
    assert run_helper(tmp_path, ci_workflow, ci_detector) == (1, 1)
