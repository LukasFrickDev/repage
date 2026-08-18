#!/usr/bin/env bash
set -Eeuo pipefail

app_root='/home/re190924/repage_backend'
python='/home/re190924/virtualenv/repage_backend/3.12/bin/python'
parser="${app_root}/scripts/parse_cloudlinux_result.py"
selector='/usr/sbin/cloudlinux-selector'

if test "$#" -ne 1; then
  echo 'Production cron job is required.' >&2
  exit 2
fi

case "$1" in
  process_email_retries)
    script_name='scripts/cron_process_email_retries.py'
    ;;
  cleanup_idempotency)
    script_name='scripts/cron_cleanup_idempotency.py'
    ;;
  *)
    echo 'Unsupported production cron job.' >&2
    exit 2
    ;;
esac

job_name="$1"
temporary_dir="$(mktemp -d /tmp/repage-cron.XXXXXX)"
trap 'rm -rf -- "$temporary_dir"' EXIT

set +e
"$selector" run-script \
  --json \
  --interpreter python \
  --app-root repage_backend \
  --script-name "$script_name" \
  >"${temporary_dir}/selector.json" \
  2>"${temporary_dir}/selector.err"
selector_exit=$?
set -e

if test "$selector_exit" -ne 0; then
  echo "Production cron job failed: ${job_name}." >&2
  exit 1
fi

if ! parser_report="$("$python" "$parser" "${temporary_dir}/selector.json" 2>"${temporary_dir}/parser.err")"; then
  echo "Production cron job failed: ${job_name}." >&2
  exit 1
fi

printf 'Production cron job succeeded: %s. %s\n' "$job_name" "$parser_report"
