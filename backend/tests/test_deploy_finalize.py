import os
import subprocess
from pathlib import Path
from shutil import which


FINALIZER = Path(__file__).parents[2] / '.github' / 'scripts' / 'finalize-deploy.sh'
SHA = 'a' * 40


def run_finalize(backend_path: Path, previous_sha: str = '', frontend: int = 1, backend: int = 1, env=None):
    state_file = backend_path / 'tmp' / 'repage-last-successful-sha'
    marker_file = backend_path / 'tmp' / 'repage-deploy-in-progress'
    if previous_sha:
        state_file.write_text(previous_sha + '\n', encoding='utf-8')
    marker_file.touch()
    return subprocess.run(
        ['bash', str(FINALIZER), SHA, str(backend_path), str(frontend), str(backend)],
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )


def test_finalize_writes_state_removes_marker_and_cleans_only_known_stages(tmp_path):
    backend_path = tmp_path / 'backend'
    tmp_dir = backend_path / 'tmp'
    tmp_dir.mkdir(parents=True)
    (tmp_dir / f'repage-deploy-{SHA}').mkdir()
    (tmp_dir / 'repage-deploy-not-a-sha').mkdir()
    rollback = tmp_dir / 'repage-rollback-backend.tar.gz'
    rollback.write_text('rollback', encoding='utf-8')

    result = run_finalize(backend_path, previous_sha='b' * 40)

    assert result.returncode == 0, result.stderr
    assert (tmp_dir / 'repage-last-successful-sha').read_text(encoding='utf-8') == f'{SHA}\n'
    assert not (tmp_dir / 'repage-deploy-in-progress').exists()
    assert not (tmp_dir / f'repage-deploy-{SHA}').exists()
    assert (tmp_dir / 'repage-deploy-not-a-sha').exists()
    assert rollback.exists()


def test_cleanup_failure_does_not_invalidate_finalized_state(tmp_path):
    backend_path = tmp_path / 'backend'
    tmp_dir = backend_path / 'tmp'
    tmp_dir.mkdir(parents=True)
    stage = tmp_dir / f'repage-deploy-{SHA}'
    stage.mkdir()

    fake_bin = tmp_path / 'bin'
    fake_bin.mkdir()
    real_rm = which('rm')
    assert real_rm
    fake_rm = fake_bin / 'rm'
    fake_rm.write_text(
        '#!/bin/sh\n'
        f'for arg do case "$arg" in "{stage}") exit 1;; esac; done\n'
        f'exec "{real_rm}" "$@"\n',
        encoding='utf-8',
    )
    fake_rm.chmod(0o700)
    environment = {**os.environ, 'PATH': f'{fake_bin}:{os.environ["PATH"]}'}

    result = run_finalize(backend_path, env=environment)

    assert result.returncode == 0
    assert (tmp_dir / 'repage-last-successful-sha').read_text(encoding='utf-8') == f'{SHA}\n'
    assert not (tmp_dir / 'repage-deploy-in-progress').exists()
    assert stage.exists()
    assert 'WARNING' in result.stderr


def test_matching_state_with_marker_is_finalizable(tmp_path):
    backend_path = tmp_path / 'backend'
    (backend_path / 'tmp').mkdir(parents=True)

    result = run_finalize(backend_path, previous_sha=SHA, frontend=0, backend=0)

    assert result.returncode == 0
    assert not (backend_path / 'tmp' / 'repage-deploy-in-progress').exists()


def test_ambiguous_marker_and_different_state_fail_closed(tmp_path):
    backend_path = tmp_path / 'backend'
    (backend_path / 'tmp').mkdir(parents=True)
    previous_sha = 'b' * 40

    result = run_finalize(backend_path, previous_sha=previous_sha, frontend=0, backend=0)

    assert result.returncode != 0
    assert (backend_path / 'tmp' / 'repage-deploy-in-progress').exists()
    assert (backend_path / 'tmp' / 'repage-last-successful-sha').read_text(encoding='utf-8') == f'{previous_sha}\n'


def test_noop_with_different_state_fails_even_without_marker(tmp_path):
    backend_path = tmp_path / 'backend'
    tmp_dir = backend_path / 'tmp'
    tmp_dir.mkdir(parents=True)
    previous_sha = 'b' * 40
    (tmp_dir / 'repage-last-successful-sha').write_text(previous_sha + '\n', encoding='utf-8')

    result = subprocess.run(
        ['bash', str(FINALIZER), SHA, str(backend_path), '0', '0'],
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode != 0
    assert (tmp_dir / 'repage-last-successful-sha').read_text(encoding='utf-8') == f'{previous_sha}\n'
    assert not (tmp_dir / 'repage-deploy-in-progress').exists()
