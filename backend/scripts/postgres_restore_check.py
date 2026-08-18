import hashlib
import hmac
import os
import re
import secrets
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Mapping, Sequence

try:
    from .postgres_backup import (
        BACKUP_DIR,
        DAILY_ARCHIVE_PATTERN,
        BackupError,
        load_postgres_config,
    )
except ImportError:
    from postgres_backup import (  # type: ignore[no-redef]
        BACKUP_DIR,
        DAILY_ARCHIVE_PATTERN,
        BackupError,
        load_postgres_config,
    )


PG_RESTORE = Path('/home/re190924/tools/postgresql-18/bin/pg_restore')
PSQL = Path('/home/re190924/tools/postgresql-18/bin/psql')
CHECKSUM_PATTERN = re.compile(r'(?P<digest>[0-9a-fA-F]{64})  (?P<filename>[^\r\n]+)\n?')
TEMPORARY_DATABASE_PATTERN = re.compile(r'repage_restore_test_[a-z0-9_]+')
TEMPORARY_DATABASE_PREFIX = 'repage_restore_test_'
STRUCTURAL_QUERY = "SELECT to_regclass('public.django_migrations') IS NOT NULL;"
SAFE_CHILD_ENVIRONMENT = ('PATH', 'HOME', 'LANG', 'LC_ALL', 'LD_LIBRARY_PATH')
Runner = Callable[..., subprocess.CompletedProcess[str]]


@dataclass(frozen=True)
class BackupPair:
    archive: Path
    sidecar: Path


def _is_regular_file(path: Path) -> bool:
    return path.is_file() and not path.is_symlink()


def select_latest_daily_backup(backup_dir: Path = BACKUP_DIR) -> BackupPair:
    try:
        pairs = [
            BackupPair(path, Path(f'{path}.sha256'))
            for path in backup_dir.iterdir()
            if _is_regular_file(path)
            and DAILY_ARCHIVE_PATTERN.fullmatch(path.name)
            and _is_regular_file(Path(f'{path}.sha256'))
        ]
    except OSError as exc:
        raise BackupError('Could not inspect PostgreSQL daily backups.') from exc

    if not pairs:
        raise BackupError('No complete PostgreSQL daily backup is available.')
    return max(pairs, key=lambda pair: pair.archive.name)


def _read_checksum(sidecar: Path, archive_name: str) -> str:
    try:
        content = sidecar.read_text(encoding='ascii')
    except (OSError, UnicodeDecodeError) as exc:
        raise BackupError('PostgreSQL backup checksum metadata is invalid.') from exc

    match = CHECKSUM_PATTERN.fullmatch(content)
    if match is None or match.group('filename') != archive_name:
        raise BackupError('PostgreSQL backup checksum metadata is invalid.')
    return match.group('digest').lower()


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    try:
        with path.open('rb') as archive:
            for chunk in iter(lambda: archive.read(1024 * 1024), b''):
                digest.update(chunk)
    except OSError as exc:
        raise BackupError('Could not calculate PostgreSQL backup checksum.') from exc
    return digest.hexdigest()


def verify_backup_checksum(pair: BackupPair) -> None:
    expected = _read_checksum(pair.sidecar, pair.archive.name)
    actual = _sha256(pair.archive)
    if not hmac.compare_digest(expected, actual):
        raise BackupError('PostgreSQL backup checksum verification failed.')


def generate_temporary_database() -> str:
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
    nonce = secrets.token_hex(8)
    return f'{TEMPORARY_DATABASE_PREFIX}{timestamp}_{nonce}'


def _validate_temporary_database(target: str, real_database: str) -> None:
    if (
        len(target) > 63
        or TEMPORARY_DATABASE_PATTERN.fullmatch(target) is None
        or target == real_database
    ):
        raise BackupError('PostgreSQL restore target is invalid.')


def _child_environment(environ: Mapping[str, str], password: str) -> dict[str, str]:
    child = {
        name: environ[name]
        for name in SAFE_CHILD_ENVIRONMENT
        if environ.get(name)
    }
    child.update({'PGPASSWORD': password, 'PGSSLMODE': 'require'})
    return child


def _run_command(
    arguments: Sequence[str],
    *,
    environment: Mapping[str, str],
    runner: Runner,
) -> subprocess.CompletedProcess[str]:
    try:
        return runner(
            list(arguments),
            env=dict(environment),
            capture_output=True,
            text=True,
            check=False,
            shell=False,
        )
    except OSError as exc:
        raise BackupError('PostgreSQL restore command could not be executed.') from exc


def _psql_arguments(config, target_database: str, command: str) -> list[str]:
    return [
        str(PSQL),
        '--host',
        config.host,
        '--port',
        config.port,
        '--username',
        config.user,
        '--dbname',
        target_database,
        '--set=ON_ERROR_STOP=1',
        '--command',
        command,
    ]


def _create_database(config, target_database: str, *, environment, runner: Runner) -> None:
    _validate_temporary_database(target_database, config.database)
    result = _run_command(
        _psql_arguments(config, config.database, f'CREATE DATABASE {target_database};'),
        environment=environment,
        runner=runner,
    )
    if result.returncode != 0:
        raise BackupError('Temporary PostgreSQL database creation failed.')


def _restore_archive(
    config,
    target_database: str,
    archive: Path,
    *,
    environment,
    runner: Runner,
) -> None:
    _validate_temporary_database(target_database, config.database)
    result = _run_command(
        [
            str(PG_RESTORE),
            '--no-owner',
            '--no-privileges',
            '--exit-on-error',
            '--host',
            config.host,
            '--port',
            config.port,
            '--username',
            config.user,
            '--dbname',
            target_database,
            str(archive),
        ],
        environment=environment,
        runner=runner,
    )
    if result.returncode != 0:
        raise BackupError('PostgreSQL backup restore failed.')


def _validate_structure(
    config,
    target_database: str,
    *,
    environment,
    runner: Runner,
) -> None:
    _validate_temporary_database(target_database, config.database)
    validation_arguments = _psql_arguments(config, target_database, STRUCTURAL_QUERY)
    command_index = validation_arguments.index('--command')
    validation_arguments[command_index:command_index] = ['--tuples-only', '--no-align']
    result = _run_command(
        validation_arguments,
        environment=environment,
        runner=runner,
    )
    if result.returncode != 0 or result.stdout.strip().lower() != 't':
        raise BackupError('PostgreSQL restore structure validation failed.')


def _drop_database(config, target_database: str, *, environment, runner: Runner) -> None:
    _validate_temporary_database(target_database, config.database)
    result = _run_command(
        _psql_arguments(config, config.database, f'DROP DATABASE {target_database};'),
        environment=environment,
        runner=runner,
    )
    if result.returncode != 0:
        raise BackupError('Temporary PostgreSQL database cleanup failed.')


def run_restore_check(
    *,
    backup_dir: Path = BACKUP_DIR,
    environ: Mapping[str, str] | None = None,
    runner: Runner = subprocess.run,
) -> None:
    config = load_postgres_config(environ)
    source_environment = dict(os.environ if environ is None else environ)
    child_environment = _child_environment(source_environment, config.password)
    pair = select_latest_daily_backup(backup_dir)
    verify_backup_checksum(pair)

    target_database = generate_temporary_database()
    _validate_temporary_database(target_database, config.database)
    created = False
    failure: BackupError | None = None
    try:
        _create_database(
            config,
            target_database,
            environment=child_environment,
            runner=runner,
        )
        created = True
        _validate_temporary_database(target_database, config.database)
        _restore_archive(
            config,
            target_database,
            pair.archive,
            environment=child_environment,
            runner=runner,
        )
        _validate_temporary_database(target_database, config.database)
        _validate_structure(
            config,
            target_database,
            environment=child_environment,
            runner=runner,
        )
    except BackupError as exc:
        failure = exc
    except Exception:
        failure = BackupError('PostgreSQL restore check failed.')
    finally:
        if created:
            try:
                _drop_database(
                    config,
                    target_database,
                    environment=child_environment,
                    runner=runner,
                )
            except BackupError:
                failure = BackupError('PostgreSQL restore check cleanup failed.')

    if failure is not None:
        raise failure


def main() -> int:
    try:
        run_restore_check()
    except Exception:
        print('PostgreSQL restore check failed.')
        return 1
    print('PostgreSQL restore check completed.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
