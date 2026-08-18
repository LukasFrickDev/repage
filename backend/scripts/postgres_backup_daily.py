import sys

from postgres_backup import BackupError, DAILY_PREFIX, create_backup


def main() -> int:
    try:
        create_backup(DAILY_PREFIX, rotate=True)
    except BackupError:
        print('PostgreSQL daily backup failed.', file=sys.stderr)
        return 1
    print('PostgreSQL daily backup completed.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
