import hashlib
import os
import re
import subprocess
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Mapping, Sequence


PG_DUMP = Path('/home/re190924/tools/postgresql-18/bin/pg_dump')
PG_RESTORE = Path('/home/re190924/tools/postgresql-18/bin/pg_restore')
BACKUP_DIR = Path('/home/re190924/backups/repage/postgresql')
DAILY_PREFIX = 'repage-daily'
PRE_MIGRATION_PREFIX = 'repage-pre-migration'
TIMESTAMP_PATTERN = re.compile(r'\d{8}T\d{6}Z')
DAILY_ARCHIVE_PATTERN = re.compile(r'repage-daily-\d{8}T\d{6}Z\.dump')
REQUIRED_ENVIRONMENT = (
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
)
DIRECT_ENVIRONMENT = ('POSTGRES_DIRECT_HOST', 'POSTGRES_DIRECT_PORT')
SAFE_CHILD_ENVIRONMENT = ('PATH', 'HOME', 'LANG', 'LC_ALL', 'LD_LIBRARY_PATH')
Runner = Callable[..., subprocess.CompletedProcess[str]]


class BackupError(RuntimeError):
    """Raised when a backup cannot be produced as a validated artifact."""


@dataclass(frozen=True)
class PostgresConfig:
    database: str
    user: str
    password: str
    host: str
    port: str


def load_postgres_config(environ: Mapping[str, str] | None = None) -> PostgresConfig:
    source = os.environ if environ is None else environ
    values = {}
    for name in REQUIRED_ENVIRONMENT:
        value = source.get(name, '').strip()
        if not value:
            raise BackupError(f'{name} is required.')
        values[name] = value
    direct_values = {
        name: source.get(name, '').strip()
        for name in DIRECT_ENVIRONMENT
    }
    if source.get('DJANGO_ENVIRONMENT', '').strip().lower() == 'production' and not all(direct_values.values()):
        missing_name = next(name for name in DIRECT_ENVIRONMENT if not direct_values[name])
        raise BackupError(f'{missing_name} is required.')
    return PostgresConfig(
        database=values['POSTGRES_DB'],
        user=values['POSTGRES_USER'],
        password=values['POSTGRES_PASSWORD'],
        host=direct_values['POSTGRES_DIRECT_HOST'] or values['POSTGRES_HOST'],
        port=direct_values['POSTGRES_DIRECT_PORT'] or values['POSTGRES_PORT'],
    )


def utc_timestamp(now: datetime | None = None) -> str:
    value = now or datetime.now(timezone.utc)
    return value.astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')


def _validate_timestamp(timestamp: str) -> str:
    if TIMESTAMP_PATTERN.fullmatch(timestamp) is None:
        raise BackupError('timestamp is invalid.')
    return timestamp


def _child_environment(config: PostgresConfig, environ: Mapping[str, str] | None) -> dict[str, str]:
    source = os.environ if environ is None else environ
    child = {
        name: source[name]
        for name in SAFE_CHILD_ENVIRONMENT
        if source.get(name)
    }
    child.update({
        'PGPASSWORD': config.password,
        'PGSSLMODE': 'require',
    })
    return child


def _command_result(
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
        raise BackupError('PostgreSQL backup command could not be executed.') from exc


def _create_partial(backup_dir: Path, filename: str) -> Path:
    try:
        descriptor, path = tempfile.mkstemp(
            prefix=f'.{filename}.',
            suffix='.partial',
            dir=backup_dir,
        )
        os.close(descriptor)
        partial = Path(path)
        os.chmod(partial, 0o600)
        return partial
    except OSError as exc:
        raise BackupError('Could not create PostgreSQL backup partial file.') from exc


def _unlink(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    try:
        with path.open('rb') as archive:
            for chunk in iter(lambda: archive.read(1024 * 1024), b''):
                digest.update(chunk)
    except OSError as exc:
        raise BackupError('Could not calculate PostgreSQL backup checksum.') from exc
    return digest.hexdigest()


def _write_checksum(sidecar: Path, digest: str, filename: str) -> None:
    temporary_sidecar: Path | None = None
    try:
        descriptor, path = tempfile.mkstemp(
            prefix=f'.{sidecar.name}.',
            suffix='.partial',
            dir=sidecar.parent,
        )
        temporary_sidecar = Path(path)
        os.chmod(temporary_sidecar, 0o600)
        with os.fdopen(descriptor, 'w', encoding='ascii', newline='\n') as checksum:
            checksum.write(f'{digest}  {filename}\n')
            checksum.flush()
            os.fsync(checksum.fileno())
        os.replace(temporary_sidecar, sidecar)
        temporary_sidecar = None
        os.chmod(sidecar, 0o600)
    except OSError as exc:
        raise BackupError('Could not write PostgreSQL backup checksum.') from exc
    finally:
        if temporary_sidecar is not None:
            _unlink(temporary_sidecar)


def rotate_daily_backups(backup_dir: Path = BACKUP_DIR, *, keep: int = 7) -> None:
    if keep < 1:
        raise BackupError('daily backup retention must be positive.')
    try:
        daily_archives = sorted(
            path
            for path in backup_dir.iterdir()
            if path.is_file()
            and DAILY_ARCHIVE_PATTERN.fullmatch(path.name)
            and Path(f'{path}.sha256').is_file()
        )
    except OSError as exc:
        raise BackupError('Could not inspect daily PostgreSQL backups.') from exc

    for archive in daily_archives[:-keep]:
        sidecar = Path(f'{archive}.sha256')
        try:
            archive.unlink()
            sidecar.unlink()
        except OSError as exc:
            raise BackupError('Could not rotate daily PostgreSQL backups.') from exc


def create_backup(
    prefix: str,
    *,
    backup_dir: Path = BACKUP_DIR,
    pg_dump: Path = PG_DUMP,
    pg_restore: Path = PG_RESTORE,
    timestamp: str | None = None,
    environ: Mapping[str, str] | None = None,
    runner: Runner = subprocess.run,
    rotate: bool = False,
) -> Path:
    if prefix not in {DAILY_PREFIX, PRE_MIGRATION_PREFIX}:
        raise BackupError('backup prefix is invalid.')
    config = load_postgres_config(environ)
    stamp = _validate_timestamp(timestamp or utc_timestamp())
    filename = f'{prefix}-{stamp}.dump'
    final_path = backup_dir / filename
    sidecar_path = Path(f'{final_path}.sha256')
    partial_path: Path | None = None
    promoted = False

    try:
        backup_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
        os.chmod(backup_dir, 0o700)
        if final_path.exists() or sidecar_path.exists():
            raise BackupError('PostgreSQL backup target already exists.')

        partial_path = _create_partial(backup_dir, filename)
        child_environment = _child_environment(config, environ)
        dump_arguments = [
            str(pg_dump),
            '--format=custom',
            '--no-owner',
            '--no-privileges',
            '--host',
            config.host,
            '--port',
            config.port,
            '--username',
            config.user,
            '--file',
            str(partial_path),
            config.database,
        ]
        dump_result = _command_result(
            dump_arguments,
            environment=child_environment,
            runner=runner,
        )
        if dump_result.returncode != 0:
            raise BackupError('pg_dump failed.')
        if not partial_path.exists() or partial_path.stat().st_size == 0:
            raise BackupError('pg_dump produced an empty archive.')

        restore_result = _command_result(
            [str(pg_restore), '--list', str(partial_path)],
            environment=child_environment,
            runner=runner,
        )
        if restore_result.returncode != 0:
            raise BackupError('PostgreSQL backup archive validation failed.')

        digest = _sha256(partial_path)
        os.replace(partial_path, final_path)
        partial_path = None
        promoted = True
        _write_checksum(sidecar_path, digest, filename)
    except BackupError:
        if partial_path is not None:
            _unlink(partial_path)
        if promoted:
            _unlink(final_path)
            _unlink(sidecar_path)
        raise
    except (OSError, ValueError) as exc:
        if partial_path is not None:
            _unlink(partial_path)
        if promoted:
            _unlink(final_path)
            _unlink(sidecar_path)
        raise BackupError('PostgreSQL backup failed.') from exc

    if rotate:
        rotate_daily_backups(backup_dir)
    return final_path
