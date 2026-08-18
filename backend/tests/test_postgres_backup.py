import hashlib
import os
import stat
from pathlib import Path
from types import SimpleNamespace

import pytest

from scripts import postgres_backup


def postgres_environment() -> dict[str, str]:
    return {
        'POSTGRES_DB': 'repage_test',
        'POSTGRES_USER': 'repage_app',
        'POSTGRES_PASSWORD': 'synthetic-password',
        'POSTGRES_HOST': 'postgres.example.test',
        'POSTGRES_PORT': '5432',
        'PATH': os.environ.get('PATH', ''),
    }


class FakeRunner:
    def __init__(self, *, dump_data: bytes = b'custom archive', dump_returncode: int = 0, restore_returncode: int = 0):
        self.dump_data = dump_data
        self.dump_returncode = dump_returncode
        self.restore_returncode = restore_returncode
        self.calls: list[tuple[list[str], dict[str, object]]] = []

    def __call__(self, arguments, **kwargs):
        self.calls.append((arguments, kwargs))
        if '--list' in arguments:
            return SimpleNamespace(returncode=self.restore_returncode, stdout='archive listing', stderr='secret restore stderr')
        partial = Path(arguments[arguments.index('--file') + 1])
        partial.write_bytes(self.dump_data)
        return SimpleNamespace(returncode=self.dump_returncode, stdout='dump output', stderr='secret dump stderr')


def test_missing_required_configuration_does_not_expose_password():
    environment = postgres_environment()
    environment.pop('POSTGRES_HOST')

    with pytest.raises(postgres_backup.BackupError) as error:
        postgres_backup.load_postgres_config(environment)

    assert 'POSTGRES_HOST' in str(error.value)
    assert environment['POSTGRES_PASSWORD'] not in str(error.value)


def test_backup_api_accepts_only_declared_backup_prefixes(tmp_path: Path):
    with pytest.raises(postgres_backup.BackupError, match='prefix is invalid'):
        postgres_backup.create_backup(
            'arbitrary',
            backup_dir=tmp_path,
            timestamp='20260817T235959Z',
            environ=postgres_environment(),
            runner=FakeRunner(),
        )


def test_pg_dump_uses_pg18_secure_arguments_and_child_environment(tmp_path: Path):
    runner = FakeRunner()
    final_path = postgres_backup.create_backup(
        postgres_backup.DAILY_PREFIX,
        backup_dir=tmp_path,
        pg_dump=postgres_backup.PG_DUMP,
        pg_restore=postgres_backup.PG_RESTORE,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=runner,
    )

    dump_arguments, dump_options = runner.calls[0]
    assert dump_arguments[0] == str(postgres_backup.PG_DUMP)
    assert '--format=custom' in dump_arguments
    assert '--no-owner' in dump_arguments
    assert '--no-privileges' in dump_arguments
    assert '--username' in dump_arguments
    assert '--file' in dump_arguments
    assert postgres_environment()['POSTGRES_PASSWORD'] not in dump_arguments
    assert dump_options['shell'] is False
    child_environment = dump_options['env']
    assert child_environment['PGPASSWORD'] == 'synthetic-password'
    assert child_environment['PGSSLMODE'] == 'require'
    assert 'POSTGRES_PASSWORD' not in child_environment
    assert final_path.name == 'repage-daily-20260817T235959Z.dump'


def test_archive_is_not_promoted_before_pg_restore_validation(tmp_path: Path):
    runner = FakeRunner()
    final_path = tmp_path / 'repage-daily-20260817T235959Z.dump'
    original_runner = runner

    def validating_runner(arguments, **kwargs):
        if '--list' in arguments:
            assert not final_path.exists()
            assert Path(arguments[-1]).exists()
        return original_runner(arguments, **kwargs)

    postgres_backup.create_backup(
        postgres_backup.DAILY_PREFIX,
        backup_dir=tmp_path,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=validating_runner,
    )


@pytest.mark.parametrize(
    'runner',
    [
        FakeRunner(dump_data=b'', dump_returncode=0),
        FakeRunner(dump_returncode=1),
        FakeRunner(restore_returncode=1),
    ],
)
def test_failures_remove_partial_and_preserve_previous_backup(
    tmp_path: Path,
    runner: FakeRunner,
    monkeypatch,
    capsys,
):
    previous = tmp_path / 'repage-daily-20260816T235959Z.dump'
    previous.write_bytes(b'previous valid archive')
    previous_sidecar = Path(f'{previous}.sha256')
    previous_sidecar.write_text('previous  repage-daily-20260816T235959Z.dump\n', encoding='ascii')
    rotation_called = False

    def rotation_probe(*args, **kwargs):
        nonlocal rotation_called
        rotation_called = True

    monkeypatch.setattr(postgres_backup, 'rotate_daily_backups', rotation_probe)
    with pytest.raises(postgres_backup.BackupError):
        postgres_backup.create_backup(
            postgres_backup.DAILY_PREFIX,
            backup_dir=tmp_path,
            timestamp='20260817T235959Z',
            environ=postgres_environment(),
            runner=runner,
            rotate=True,
        )

    assert previous.read_bytes() == b'previous valid archive'
    assert previous_sidecar.exists()
    assert not list(tmp_path.glob('*.partial'))
    assert not (tmp_path / 'repage-daily-20260817T235959Z.dump').exists()
    assert rotation_called is False
    captured = capsys.readouterr()
    assert 'secret dump stderr' not in captured.out + captured.err
    assert 'secret restore stderr' not in captured.out + captured.err


def test_checksum_failure_removes_promoted_archive(tmp_path: Path, monkeypatch):
    def fail_checksum(*args, **kwargs):
        raise postgres_backup.BackupError('checksum failed')

    monkeypatch.setattr(
        postgres_backup,
        '_write_checksum',
        fail_checksum,
    )

    with pytest.raises(postgres_backup.BackupError):
        postgres_backup.create_backup(
            postgres_backup.DAILY_PREFIX,
            backup_dir=tmp_path,
            timestamp='20260817T235959Z',
            environ=postgres_environment(),
            runner=FakeRunner(),
        )

    assert not list(tmp_path.glob('*.dump'))
    assert not list(tmp_path.glob('*.sha256'))


def test_validation_uses_pg_restore_list_without_restore_options(tmp_path: Path):
    runner = FakeRunner()

    postgres_backup.create_backup(
        postgres_backup.DAILY_PREFIX,
        backup_dir=tmp_path,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=runner,
    )

    restore_arguments, restore_options = runner.calls[1]
    assert restore_arguments[0] == str(postgres_backup.PG_RESTORE)
    assert restore_arguments[1] == '--list'
    assert '--dbname' not in restore_arguments
    assert '--create' not in restore_arguments
    assert restore_options['shell'] is False


def test_checksum_and_permissions_are_for_final_archive(tmp_path: Path):
    runner = FakeRunner(dump_data=b'validated custom archive')

    final_path = postgres_backup.create_backup(
        postgres_backup.PRE_MIGRATION_PREFIX,
        backup_dir=tmp_path,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=runner,
    )
    sidecar = Path(f'{final_path}.sha256')
    expected = hashlib.sha256(b'validated custom archive').hexdigest()

    assert sidecar.read_text(encoding='ascii') == f'{expected}  {final_path.name}\n'
    assert stat.S_IMODE(final_path.stat().st_mode) == 0o600
    assert stat.S_IMODE(sidecar.stat().st_mode) == 0o600
    assert stat.S_IMODE(tmp_path.stat().st_mode) == 0o700


def test_daily_rotation_keeps_seven_recent_daily_and_unknown_files(tmp_path: Path):
    for day in range(10, 17):
        archive = tmp_path / f'repage-daily-202608{day:02d}T235959Z.dump'
        archive.write_bytes(f'daily-{day}'.encode())
        Path(f'{archive}.sha256').write_text('digest  archive\n', encoding='ascii')
    pre_migration = tmp_path / 'repage-pre-migration-20260801T000000Z.dump'
    pre_migration.write_bytes(b'pre-migration')
    unknown = tmp_path / 'unrelated.txt'
    unknown.write_text('keep', encoding='utf-8')

    postgres_backup.create_backup(
        postgres_backup.DAILY_PREFIX,
        backup_dir=tmp_path,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=FakeRunner(),
        rotate=True,
    )

    daily = sorted(path.name for path in tmp_path.glob('repage-daily-*.dump'))
    assert len(daily) == 7
    assert daily == [f'repage-daily-202608{day:02d}T235959Z.dump' for day in range(11, 18)]
    assert not (tmp_path / 'repage-daily-20260810T235959Z.dump.sha256').exists()
    assert pre_migration.exists()
    assert unknown.exists()


def test_daily_rotation_counts_only_complete_pairs(tmp_path: Path):
    complete_archives = []
    for day in range(10, 17):
        archive = tmp_path / f'repage-daily-202608{day:02d}T235959Z.dump'
        archive.write_bytes(f'daily-{day}'.encode())
        Path(f'{archive}.sha256').write_text('digest  archive\n', encoding='ascii')
        complete_archives.append(archive)

    orphan_archive = tmp_path / 'repage-daily-20260817T235959Z.dump'
    orphan_archive.write_bytes(b'orphan archive')
    orphan_sidecar = tmp_path / 'repage-daily-20260818T235959Z.dump.sha256'
    orphan_sidecar.write_text('orphan  sidecar\n', encoding='ascii')

    postgres_backup.rotate_daily_backups(tmp_path, keep=7)

    assert all(archive.exists() for archive in complete_archives)
    assert orphan_archive.exists()
    assert orphan_sidecar.exists()


def test_pre_migration_does_not_rotate_or_remove_other_pre_migrations(tmp_path: Path, monkeypatch):
    previous = tmp_path / 'repage-pre-migration-20260816T235959Z.dump'
    previous.write_bytes(b'previous pre-migration')
    rotation_called = False

    def rotation_probe(*args, **kwargs):
        nonlocal rotation_called
        rotation_called = True

    monkeypatch.setattr(postgres_backup, 'rotate_daily_backups', rotation_probe)
    created = postgres_backup.create_backup(
        postgres_backup.PRE_MIGRATION_PREFIX,
        backup_dir=tmp_path,
        timestamp='20260817T235959Z',
        environ=postgres_environment(),
        runner=FakeRunner(),
    )

    assert created.name == 'repage-pre-migration-20260817T235959Z.dump'
    assert previous.exists()
    assert rotation_called is False
