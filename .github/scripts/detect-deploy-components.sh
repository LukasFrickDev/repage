#!/usr/bin/env bash
set -Eeuo pipefail

last_success_sha="${1:-}"
deploy_sha="${2:-}"

full_deploy() {
  printf '1 1\n'
}

if [[ ! "$last_success_sha" =~ ^[0-9a-fA-F]{40}$ ]] || [[ ! "$deploy_sha" =~ ^[0-9a-fA-F]{40}$ ]]; then
  full_deploy
  exit 0
fi

if ! git cat-file -e "${last_success_sha}^{commit}" 2>/dev/null || \
  ! git cat-file -e "${deploy_sha}^{commit}" 2>/dev/null; then
  full_deploy
  exit 0
fi

changed_files="$(mktemp)"
trap 'rm -f -- "$changed_files"' EXIT
if ! git diff --name-only -z "$last_success_sha" "$deploy_sha" -- frontend backend > "$changed_files"; then
  full_deploy
  exit 0
fi

frontend_changed=0
backend_changed=0
while IFS= read -r -d '' path; do
  case "$path" in
    frontend/*) frontend_changed=1 ;;
    backend/*) backend_changed=1 ;;
  esac
done < "$changed_files"

printf '%s %s\n' "$frontend_changed" "$backend_changed"
