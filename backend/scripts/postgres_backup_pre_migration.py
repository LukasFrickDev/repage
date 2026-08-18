import sys

from postgres_backup import BackupError, PRE_MIGRATION_PREFIX, create_backup


def main() -> int:
    try:
        create_backup(PRE_MIGRATION_PREFIX)
    except BackupError:
        print('PostgreSQL pre-migration backup failed.', file=sys.stderr)
        return 1
    print('PostgreSQL pre-migration backup completed.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
