#!/usr/bin/env bash
set -Eeuo pipefail

sha="$1"
backend_path="$2"
planned_frontend="$3"
planned_backend="$4"
state_file="${backend_path}/tmp/repage-last-successful-sha"
marker_file="${backend_path}/tmp/repage-deploy-in-progress"

log_step() {
  printf '[deploy] %s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$1"
}

if [[ ! "$sha" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo 'Invalid deploy SHA.' >&2
  exit 1
fi
case "$planned_frontend:$planned_backend" in
  0:0|0:1|1:0|1:1) ;;
  *) echo 'Invalid planned deploy components.' >&2; exit 1 ;;
esac

mkdir -p "${backend_path}/tmp"
finalize_started="$(date +%s)"
log_step 'START finalize deployment state'
current_state=''
if test -f "$state_file"; then
  current_state="$(cat "$state_file")"
fi
marker_present=0
if test -f "$marker_file"; then
  marker_present=1
fi

if [ "$current_state" != "$sha" ]; then
  if [ "$planned_frontend" = '0' ] && [ "$planned_backend" = '0' ]; then
    echo 'Cannot finalize no-op while last successful SHA differs.' >&2
    exit 1
  fi
  if [ "$marker_present" != '1' ]; then
    echo 'Cannot finalize application deploy without in-progress marker.' >&2
    exit 1
  fi

  state_tmp="${state_file}.tmp.$$"
  printf '%s\n' "$sha" > "$state_tmp"
  chmod 600 "$state_tmp"
  mv -f "$state_tmp" "$state_file"
  log_step "DONE record last successful SHA duration=$(( $(date +%s) - finalize_started ))s"
else
  log_step 'Last successful SHA already matches deploy SHA'
fi

if test -f "$marker_file"; then
  marker_started="$(date +%s)"
  rm -f -- "$marker_file"
  log_step "DONE remove deploy marker duration=$(( $(date +%s) - marker_started ))s"
fi

cleanup_failed=0
for candidate in "${backend_path}"/tmp/repage-deploy-*; do
  test -d "$candidate" || continue
  name="${candidate##*/}"
  suffix="${name#repage-deploy-}"
  if [[ "$suffix" =~ ^[0-9a-fA-F]{40}$ ]]; then
    cleanup_started="$(date +%s)"
    log_step "START cleanup deploy stage ${name}"
    if rm -rf -- "$candidate"; then
      log_step "DONE cleanup deploy stage ${name} duration=$(( $(date +%s) - cleanup_started ))s"
    else
      printf '[deploy] WARNING cleanup failed for recognized deploy stage\n' >&2
      cleanup_failed=1
    fi
  fi
done

if [ "$cleanup_failed" = '1' ]; then
  printf '[deploy] WARNING deployment state finalized; stage housekeeping remains\n' >&2
fi
log_step "DONE finalize deployment state duration=$(( $(date +%s) - finalize_started ))s"
