#!/usr/bin/env bash
set -Eeuo pipefail

app_root='/home/re190924/repage_backend'
python='/home/re190924/virtualenv/repage_backend/3.12/bin/python'
parser="${app_root}/scripts/parse_cloudlinux_result.py"
selector='/usr/sbin/cloudlinux-selector'

if test "$#" -ne 1; then
  echo 'Production backup job is required.' >&2
  exit 2
fi

case "$1" in
  daily)
    script_name='scripts/postgres_backup_daily.py'
    ;;
  pre_migration)
    script_name='scripts/postgres_backup_pre_migration.py'
    ;;
  restore_check)
    script_name='scripts/postgres_restore_check.py'
    ;;
  *)
    echo 'Unsupported production backup job.' >&2
    exit 2
    ;;
esac

job_name="$1"
temporary_dir="$(mktemp -d /tmp/repage-backup.XXXXXX)"
cleanup() {
  rm -rf -- "$temporary_dir"
}
trap cleanup EXIT

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
  echo "Production backup job failed: ${job_name}." >&2
  exit 1
fi

set +e
parser_report="$("$python" "$parser" "${temporary_dir}/selector.json" 2>"${temporary_dir}/parser.err")"
parser_exit=$?
set -e

if test "$parser_exit" -ne 0; then
  echo "Production backup job failed: ${job_name}." >&2
  exit 1
fi

printf 'Production backup job succeeded: %s. %s\n' "$job_name" "$parser_report"
