#!/usr/bin/env bash
set -Eeuo pipefail

state_status="${1:-}"
state_sha="${2:-}"
marker_present="${3:-}"
deploy_sha="${4:-}"
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if [ "$marker_present" = '1' ]; then
  if [ "$state_status" = 'valid' ] && [ "$state_sha" = "$deploy_sha" ]; then
    printf '0 0 1 0\n'
  else
    printf '1 1 0 1\n'
  fi
  exit 0
fi

if [ "$state_status" != 'valid' ]; then
  printf '1 1 0 0\n'
  exit 0
fi

read -r deploy_frontend deploy_backend <<< "$(bash "$script_dir/detect-deploy-components.sh" "$state_sha" "$deploy_sha")"
printf '%s %s 0 0\n' "$deploy_frontend" "$deploy_backend"
