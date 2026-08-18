#!/usr/bin/env bash
set -Eeuo pipefail

base_sha="${1:-}"
head_sha="${2:-}"

if [ "$base_sha" = '--full' ] || [ "$head_sha" = '--full' ]; then
  printf '1 1\n'
  exit 0
fi

if [[ ! "$base_sha" =~ ^[0-9a-fA-F]{40}$ ]] || [[ ! "$head_sha" =~ ^[0-9a-fA-F]{40}$ ]]; then
  printf '1 1\n'
  exit 0
fi

if ! git cat-file -e "${base_sha}^{commit}" 2>/dev/null || \
  ! git cat-file -e "${head_sha}^{commit}" 2>/dev/null; then
  printf '1 1\n'
  exit 0
fi

changed_files="$(mktemp)"
trap 'rm -f -- "$changed_files"' EXIT
if ! git diff --no-renames --name-only -z "$base_sha" "$head_sha" -- . > "$changed_files"; then
  printf '1 1\n'
  exit 0
fi

frontend_changed=0
backend_changed=0
while IFS= read -r -d '' path; do
  case "$path" in
    AGENTS.md|frontend/AGENTS.md|backend/AGENTS.md|docs/*)
      ;;
    frontend/e2e/*|frontend/playwright.config.ts|frontend/*)
      frontend_changed=1
      ;;
    backend/tests/*|backend/requirements-dev.txt|backend/docker-compose.yml|backend/env.txt|backend/pytest.ini|backend/*)
      backend_changed=1
      ;;
    .github/workflows/ci.yml|.github/scripts/detect-ci-components.sh)
      frontend_changed=1
      backend_changed=1
      ;;
    .github/workflows/deploy.yml|.github/scripts/deploy-production.sh|.github/scripts/detect-deploy-components.sh|.github/scripts/resolve-deploy-plan.sh|.github/scripts/finalize-deploy.sh)
      backend_changed=1
      ;;
    *)
      frontend_changed=1
      backend_changed=1
      ;;
  esac
done < "$changed_files"

printf '%s %s\n' "$frontend_changed" "$backend_changed"
