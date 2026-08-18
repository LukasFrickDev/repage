from cron_jobs import run_job


if __name__ == '__main__':
    run_job('cleanup_idempotency')
