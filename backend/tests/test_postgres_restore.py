import hashlib
import inspect
import os
import re
import subprocess
from pathlib import Path

import pytest

from scripts import postgres_restore_check


def postgres_environment() -> dict[str, str]:
    return {
        'POSTGRES_DB': 'repage_test',
        'POSTGRES_USER': 'repage_app',
        'POSTGRES_PASSWORD': 'synthetic-password',
        'POSTGRES_HOST': 'postgres.example.test',
        'POSTGRES_PORT': '5432',
        'PATH': os.environ.get('PATH', ''),
    }


def create_daily_backup(
    backup_dir: Path,
    timestamp: str,
    content: bytes = b'archive',
) -> Path:
    archive = backup_dir / f'repage-daily-{timestamp}.dump'
    archive.write_bytes(content)
    digest = hashlib.sha256(content).hexdigest()
    Path(f'{archive}.sha256').write_text(
        f'{digest}  {archive.name}\n',
        encoding='ascii',
    )
    return archive


class FakeRunner:
    def __init__(
        self,
        *,
        create_returncode=0,
        restore_returncode=0,
        validate_output='t\n',
        drop_returncode=0,
    ):
        self.create_returncode = create_returncode
        self.restore_returncode = restore_returncode
        self.validate_output = validate_output
        self.drop_returncode = drop_returncode
        self.calls: list[tuple[list[str], dict[str, object]]] = []

    def __call__(self, arguments, **kwargs):
        self.calls.append((arguments, kwargs))
        command = arguments[arguments.index('--command') + 1] if '--command' in arguments else ''
        if command.startswith('CREATE DATABASE '):
            return subprocess.CompletedProcess(
                arguments,
                self.create_returncode,
                '',
                'synthetic create stderr',
            )
        if command.startswith('DROP DATABASE '):
            return subprocess.CompletedProcess(
                arguments,
                self.drop_returncode,
                '',
                'synthetic drop stderr',
            )
        if arguments[0] == str(postgres_restore_check.PG_RESTORE):
            return subprocess.CompletedProcess(
                arguments,
                self.restore_returncode,
                '',
                'synthetic restore stderr',
            )
        return subprocess.CompletedProcess(
            arguments,
            0,
            self.validate_output,
            'synthetic validation stderr',
        )


def test_selects_latest_complete_daily_and_ignores_other_files(tmp_path: Path):
    older = create_daily_backup(tmp_path, '20260817T010101Z')
    latest = create_daily_backup(tmp_path, '20260817T020202Z')
    (tmp_path / 'repage-daily-20260817T030303Z.dump').write_bytes(b'no sidecar')
    (tmp_path / 'repage-pre-migration-20260817T040404Z.dump').write_bytes(b'pre')
    (tmp_path / 'unknown.dump').write_bytes(b'unknown')

    selected = postgres_restore_check.select_latest_daily_backup(tmp_path)

    assert selected.archive == latest
    assert selected.archive != older


def test_missing_complete_daily_backup_fails_without_database_work(tmp_path: Path):
    (tmp_path / 'repage-daily-20260817T020202Z.dump').write_bytes(b'no sidecar')
    runner = FakeRunner()

    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )

    assert runner.calls == []


@pytest.mark.parametrize(
    'sidecar_content',
    [
        '0' * 64 + '  other.dump\n',
        'not-a-checksum\n',
    ],
)
def test_invalid_checksum_metadata_fails_before_create(
    tmp_path: Path,
    sidecar_content: str,
):
    archive = tmp_path / 'repage-daily-20260817T020202Z.dump'
    archive.write_bytes(b'archive')
    Path(f'{archive}.sha256').write_text(sidecar_content, encoding='ascii')
    runner = FakeRunner()

    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )

    assert runner.calls == []


def test_checksum_mismatch_fails_before_create(tmp_path: Path):
    archive = create_daily_backup(tmp_path, '20260817T020202Z', b'archive')
    Path(f'{archive}.sha256').write_text(
        ('0' * 64) + f'  {archive.name}\n',
        encoding='ascii',
    )
    runner = FakeRunner()

    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )

    assert runner.calls == []


def test_generated_target_is_safe_and_not_accepted_as_api_input():
    target = postgres_restore_check.generate_temporary_database()

    assert re.fullmatch(r'repage_restore_test_[a-z0-9_]+', target)
    assert len(target) <= 63
    assert 'target' not in inspect.signature(
        postgres_restore_check.run_restore_check,
    ).parameters
    assert target != 'repage_test'


def test_real_database_target_is_rejected():
    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check._validate_temporary_database('repage_test', 'repage_test')
    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check._validate_temporary_database(
            'repage_restore_test_x;DROP DATABASE repage_test',
            'repage_test',
        )


def test_create_restore_validate_drop_use_safe_arguments_and_environment(tmp_path: Path):
    archive = create_daily_backup(tmp_path, '20260817T020202Z')
    runner = FakeRunner()

    postgres_restore_check.run_restore_check(
        backup_dir=tmp_path,
        environ=postgres_environment(),
        runner=runner,
    )

    assert len(runner.calls) == 4
    create_args, create_options = runner.calls[0]
    restore_args, restore_options = runner.calls[1]
    validate_args, _ = runner.calls[2]
    drop_args, _ = runner.calls[3]
    create_sql = create_args[create_args.index('--command') + 1]
    target = create_sql.removeprefix('CREATE DATABASE ').removesuffix(';')

    assert create_args[0] == str(postgres_restore_check.PSQL)
    assert '--set=ON_ERROR_STOP=1' in create_args
    assert create_args[create_args.index('--dbname') + 1] == 'repage_test'
    assert restore_args[0] == str(postgres_restore_check.PG_RESTORE)
    assert '--no-owner' in restore_args
    assert '--no-privileges' in restore_args
    assert '--exit-on-error' in restore_args
    assert restore_args[restore_args.index('--dbname') + 1] == target
    assert restore_args[-1] == str(archive)
    assert '--create' not in restore_args
    assert validate_args[validate_args.index('--dbname') + 1] == target
    assert postgres_restore_check.STRUCTURAL_QUERY in validate_args
    assert 'Lead' not in ' '.join(validate_args)
    assert drop_args[drop_args.index('--dbname') + 1] == 'repage_test'
    assert drop_args[drop_args.index('--command') + 1] == f'DROP DATABASE {target};'

    for arguments, options in runner.calls:
        assert options['shell'] is False
        assert options['capture_output'] is True
        environment = options['env']
        assert environment['PGPASSWORD'] == 'synthetic-password'
        assert environment['PGSSLMODE'] == 'require'
        assert 'POSTGRES_PASSWORD' not in environment
        assert 'synthetic-password' not in ' '.join(arguments)


def test_create_failure_prevents_restore_and_drop(tmp_path: Path):
    create_daily_backup(tmp_path, '20260817T020202Z')
    runner = FakeRunner(create_returncode=1)

    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )

    assert len(runner.calls) == 1


@pytest.mark.parametrize('failure', ['restore', 'validate'])
def test_cleanup_is_attempted_after_restore_or_validation_failure(
    tmp_path: Path,
    failure: str,
):
    create_daily_backup(tmp_path, '20260817T020202Z')
    runner = FakeRunner(
        restore_returncode=1 if failure == 'restore' else 0,
        validate_output='f\n' if failure == 'validate' else 't\n',
    )

    with pytest.raises(postgres_restore_check.BackupError):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )

    assert any(
        '--command' in arguments
        and arguments[arguments.index('--command') + 1].startswith('DROP DATABASE ')
        for arguments, _ in runner.calls
    )


def test_cleanup_failure_is_operational_failure(tmp_path: Path):
    create_daily_backup(tmp_path, '20260817T020202Z')
    runner = FakeRunner(drop_returncode=1)

    with pytest.raises(postgres_restore_check.BackupError, match='cleanup failed'):
        postgres_restore_check.run_restore_check(
            backup_dir=tmp_path,
            environ=postgres_environment(),
            runner=runner,
        )


def test_entrypoint_output_is_sanitized(monkeypatch, capsys):
    def failed_restore_check():
        raise postgres_restore_check.BackupError('secret PII and raw stderr')

    monkeypatch.setattr(postgres_restore_check, 'run_restore_check', failed_restore_check)

    assert postgres_restore_check.main() == 1
    output = capsys.readouterr()
    assert output.out == 'PostgreSQL restore check failed.\n'
    assert 'secret' not in output.out + output.err


def test_production_backup_wrapper_rejects_arbitrary_job_before_selector():
    wrapper = Path(__file__).parents[1] / 'scripts' / 'run_production_backup.sh'
    result = subprocess.run(
        ['bash', str(wrapper), 'arbitrary'],
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 2
    assert result.stdout == ''
    assert result.stderr == 'Unsupported production backup job.\n'
