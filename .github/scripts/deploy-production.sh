#!/usr/bin/env bash
set -Eeuo pipefail

: "${DEPLOY_SSH_HOST:?DEPLOY_SSH_HOST is required}"
: "${DEPLOY_SSH_PORT:?DEPLOY_SSH_PORT is required}"
: "${DEPLOY_SSH_USER:?DEPLOY_SSH_USER is required}"
: "${DEPLOY_SSH_KNOWN_HOSTS:?DEPLOY_SSH_KNOWN_HOSTS is required}"
: "${DEPLOY_SSH_PRIVATE_KEY:?DEPLOY_SSH_PRIVATE_KEY is required}"
: "${DEPLOY_FRONTEND_PATH:?DEPLOY_FRONTEND_PATH is required}"
: "${DEPLOY_BACKEND_PATH:?DEPLOY_BACKEND_PATH is required}"
: "${DEPLOY_SHA:?DEPLOY_SHA is required}"
: "${FRONTEND_ARCHIVE:?FRONTEND_ARCHIVE is required}"
: "${BACKEND_ARCHIVE:?BACKEND_ARCHIVE is required}"
: "${FRONTEND_MANIFEST:?FRONTEND_MANIFEST is required}"
: "${BACKEND_MANIFEST:?BACKEND_MANIFEST is required}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo 'DEPLOY_SHA must be a 40-character hexadecimal commit SHA.' >&2
  exit 1
fi

ssh_dir="${RUNNER_TEMP}/repage-deploy-ssh"
install -d -m 700 "$ssh_dir"
umask 077
printf '%s\n' "$DEPLOY_SSH_PRIVATE_KEY" > "$ssh_dir/id_ed25519"
printf '%s\n' "$DEPLOY_SSH_KNOWN_HOSTS" > "$ssh_dir/known_hosts"

log_step() {
  printf '[deploy] %s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$1" >&2
}

run_step() {
  local label="$1"
  shift
  local started
  started="$(date +%s)"
  log_step "START ${label}"
  "$@"
  log_step "DONE ${label} duration=$(( $(date +%s) - started ))s"
}

ssh_args=(
  -i "$ssh_dir/id_ed25519"
  -p "$DEPLOY_SSH_PORT"
  -o BatchMode=yes
  -o ConnectTimeout=15
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=3
  -o UserKnownHostsFile="$ssh_dir/known_hosts"
  -o StrictHostKeyChecking=yes
)
remote=(ssh "${ssh_args[@]}" "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}")
scp_args=(
  -i "$ssh_dir/id_ed25519"
  -P "$DEPLOY_SSH_PORT"
  -o BatchMode=yes
  -o ConnectTimeout=15
  -o ServerAliveInterval=30
  -o ServerAliveCountMax=3
  -o UserKnownHostsFile="$ssh_dir/known_hosts"
  -o StrictHostKeyChecking=yes
)

log_step 'START read last successful SHA'
set +e
last_success_sha="$("${remote[@]}" bash -s -- "$DEPLOY_BACKEND_PATH" <<'REMOTE_STATE'
set -Eeuo pipefail

backend_path="$1"
state_file="${backend_path}/tmp/repage-last-successful-sha"
if test -f "$state_file"; then
  cat "$state_file"
fi
REMOTE_STATE
)"
state_read_exit=$?
set -e
if [ "$state_read_exit" -ne 0 ]; then
  log_step 'Last successful SHA unavailable; using full deploy fallback'
  last_success_sha=''
else
  log_step 'DONE read last successful SHA'
fi

if [[ "$last_success_sha" =~ ^[0-9a-fA-F]{40}$ ]] && \
  ! git cat-file -e "${last_success_sha}^{commit}" 2>/dev/null; then
  log_step 'Fetching missing last successful SHA'
  if ! git fetch --no-tags origin "$last_success_sha"; then
    log_step 'Last successful SHA could not be fetched; using full deploy fallback'
    last_success_sha=''
  fi
fi

component_selection="$(bash .github/scripts/detect-deploy-components.sh "$last_success_sha" "$DEPLOY_SHA")"
read -r deploy_frontend deploy_backend <<< "$component_selection"
if [ "$deploy_frontend" = '1' ] && [ "$deploy_backend" = '1' ]; then
  log_step 'Selected full deploy'
elif [ "$deploy_frontend" = '1' ]; then
  log_step 'Selected frontend-only deploy'
elif [ "$deploy_backend" = '1' ]; then
  log_step 'Selected backend-only deploy'
else
  log_step 'Selected no-op deploy'
fi

if [ "$deploy_frontend" = '0' ] && [ "$deploy_backend" = '0' ]; then
  log_step 'START record successful SHA for no-op deploy'
  "${remote[@]}" bash -s -- "$DEPLOY_SHA" "$DEPLOY_BACKEND_PATH" <<'REMOTE_NOOP'
set -Eeuo pipefail

sha="$1"
backend_path="$2"
state_file="${backend_path}/tmp/repage-last-successful-sha"
deploy_in_progress="${backend_path}/tmp/repage-deploy-in-progress"
if [[ ! "$sha" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo 'Invalid deploy SHA.' >&2
  exit 1
fi
mkdir -p "${backend_path}/tmp"
if test ! -f "$deploy_in_progress"; then
  state_tmp="${state_file}.tmp.$$"
  printf '%s\n' "$sha" > "$state_tmp"
  chmod 600 "$state_tmp"
  mv -f "$state_tmp" "$state_file"
  for candidate in "${backend_path}"/tmp/repage-deploy-*; do
    test -d "$candidate" || continue
    name="${candidate##*/}"
    suffix="${name#repage-deploy-}"
    if [[ "$suffix" =~ ^[0-9a-fA-F]{40}$ ]]; then
      rm -rf -- "$candidate"
    fi
  done
fi
REMOTE_NOOP
  log_step 'DONE record successful SHA for no-op deploy'
  exit 0
fi

stage="${DEPLOY_BACKEND_PATH}/tmp/repage-deploy-${DEPLOY_SHA}"
run_step 'create remote stage' "${remote[@]}" "mkdir -p '$stage' && chmod 700 '$stage'"

if [ "$deploy_frontend" = '1' ]; then
  run_step 'upload frontend archive' scp "${scp_args[@]}" "$FRONTEND_ARCHIVE" \
    "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/frontend.tar.gz"
  run_step 'upload frontend manifest' scp "${scp_args[@]}" "$FRONTEND_MANIFEST" \
    "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/frontend.manifest"
fi
if [ "$deploy_backend" = '1' ]; then
  run_step 'upload backend archive' scp "${scp_args[@]}" "$BACKEND_ARCHIVE" \
    "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/backend.tar.gz"
  run_step 'upload backend manifest' scp "${scp_args[@]}" "$BACKEND_MANIFEST" \
    "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/backend.manifest"
fi

"${remote[@]}" bash -s -- "$DEPLOY_SHA" "$DEPLOY_FRONTEND_PATH" "$DEPLOY_BACKEND_PATH" "$deploy_frontend" "$deploy_backend" <<'REMOTE'
set -Eeuo pipefail

log_step() {
  printf '[deploy] %s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$1"
}

run_step() {
  local label="$1"
  shift
  local started
  started="$(date +%s)"
  log_step "START ${label}"
  "$@"
  log_step "DONE ${label} duration=$(( $(date +%s) - started ))s"
}

sha="$1"
frontend_path="$2"
backend_path="$3"
deploy_frontend="$4"
deploy_backend="$5"
stage="${backend_path}/tmp/repage-deploy-${sha}"
frontend_archive="${stage}/frontend.tar.gz"
backend_archive="${stage}/backend.tar.gz"
frontend_manifest="${stage}/frontend.manifest"
backend_manifest="${stage}/backend.manifest"
frontend_stage="${stage}/frontend"
backend_stage="${stage}/backend"
frontend_rollback="${backend_path}/tmp/repage-rollback-frontend.tar.gz"
backend_rollback="${backend_path}/tmp/repage-rollback-backend.tar.gz"
frontend_rollback_manifest="${backend_path}/tmp/repage-rollback-frontend.manifest"
backend_rollback_manifest="${backend_path}/tmp/repage-rollback-backend.manifest"
frontend_current_manifest="${backend_path}/tmp/repage-manifest-frontend.txt"
backend_current_manifest="${backend_path}/tmp/repage-manifest-backend.txt"
deploy_in_progress="${backend_path}/tmp/repage-deploy-in-progress"
last_success_state="${backend_path}/tmp/repage-last-successful-sha"

mkdir -p "$backend_path/tmp"
case "$deploy_frontend:$deploy_backend" in
  1:0|0:1|1:1) ;;
  *) echo 'Invalid deploy component selection.' >&2; exit 1 ;;
esac

prepare_frontend_stage() {
  test -f "$frontend_archive"
  test -f "$frontend_manifest"
  mkdir -p "$frontend_stage"
  tar -xzf "$frontend_archive" -C "$frontend_stage"
  test -f "$frontend_stage/index.html"
  test -f "$frontend_stage/404.html"
  test -f "$frontend_stage/portfolio/axium/index.html"
  test -f "$frontend_stage/.htaccess"
}

prepare_backend_stage() {
  test -f "$backend_archive"
  test -f "$backend_manifest"
  mkdir -p "$backend_stage"
  tar -xzf "$backend_archive" -C "$backend_stage"
  test -f "$backend_stage/passenger_wsgi.py"
  test -f "$backend_stage/scripts/production_manage.py"
}

if [ "$deploy_frontend" = '1' ]; then
  run_step 'extract and validate frontend' prepare_frontend_stage
fi
if [ "$deploy_backend" = '1' ]; then
  run_step 'extract and validate backend' prepare_backend_stage
fi

validate_manifest() {
  local manifest="$1"
  while IFS= read -r entry; do
    case "$entry" in
      ''|/*|../*|*/../*)
        echo "Invalid managed manifest entry."
        return 1
        ;;
    esac
  done < "$manifest"
}

remove_stale_managed_files() {
  local target="$1"
  local previous_manifest="$2"
  local next_manifest="$3"
  if test ! -f "$previous_manifest"; then
    return 0
  fi
  while IFS= read -r entry; do
    if ! grep -Fqx -- "$entry" "$next_manifest"; then
      rm -f -- "$target/$entry"
    fi
  done < "$previous_manifest"
}

if [ "$deploy_frontend" = '1' ]; then
  run_step 'validate frontend manifest' validate_manifest "$frontend_manifest"
fi
if [ "$deploy_backend" = '1' ]; then
  run_step 'validate backend manifest' validate_manifest "$backend_manifest"
fi

if [ "$deploy_frontend" = '1' ] && test ! -f "$deploy_in_progress" && test -d "$frontend_path" \
  && (test -f "$frontend_current_manifest" || ! test -f "$frontend_rollback" || ! test -f "$frontend_rollback_manifest"); then
  log_step 'START prepare frontend rollback'
  rollback_started="$(date +%s)"
  tar -czf "${stage}/previous-frontend.tar.gz" \
    --exclude='*.log' \
    -C "$frontend_path" .
  chmod 600 "${stage}/previous-frontend.tar.gz"
  mv -f "${stage}/previous-frontend.tar.gz" "$frontend_rollback"
  if test -f "$frontend_current_manifest"; then
    cp "$frontend_current_manifest" "${stage}/previous-frontend.manifest"
    chmod 600 "${stage}/previous-frontend.manifest"
    mv -f "${stage}/previous-frontend.manifest" "$frontend_rollback_manifest"
  else
    : > "$frontend_rollback_manifest"
    chmod 600 "$frontend_rollback_manifest"
  fi
  log_step "DONE prepare frontend rollback duration=$(( $(date +%s) - rollback_started ))s"
fi

if [ "$deploy_backend" = '1' ] && test ! -f "$deploy_in_progress" && test -d "$backend_path" \
  && (test -f "$backend_current_manifest" || ! test -f "$backend_rollback" || ! test -f "$backend_rollback_manifest"); then
  log_step 'START prepare backend rollback'
  rollback_started="$(date +%s)"
  tar -czf "${stage}/previous-backend.tar.gz" \
    --exclude='.env' \
    --exclude='.env.*' \
    --exclude='.venv' \
    --exclude='tmp' \
    --exclude='*.log' \
    --exclude='__pycache__' \
    -C "$backend_path" .
  chmod 600 "${stage}/previous-backend.tar.gz"
  mv -f "${stage}/previous-backend.tar.gz" "$backend_rollback"
  if test -f "$backend_current_manifest"; then
    cp "$backend_current_manifest" "${stage}/previous-backend.manifest"
    chmod 600 "${stage}/previous-backend.manifest"
    mv -f "${stage}/previous-backend.manifest" "$backend_rollback_manifest"
  else
    : > "$backend_rollback_manifest"
    chmod 600 "$backend_rollback_manifest"
  fi
  log_step "DONE prepare backend rollback duration=$(( $(date +%s) - rollback_started ))s"
fi

# Keep rollback artifacts stable across retries after production mutation starts.
if test ! -f "$deploy_in_progress"; then
  : > "$deploy_in_progress"
  chmod 600 "$deploy_in_progress"
fi

if [ "$deploy_frontend" = '1' ]; then
  mkdir -p "$frontend_path"
fi

log_step 'START deploy mutation'
mutation_started="$(date +%s)"

# Remove only files managed by the previous successful release.
if [ "$deploy_frontend" = '1' ]; then
  run_step 'remove stale frontend files' remove_stale_managed_files "$frontend_path" "$frontend_current_manifest" "$frontend_manifest"
fi
if [ "$deploy_backend" = '1' ]; then
  run_step 'remove stale backend files' remove_stale_managed_files "$backend_path" "$backend_current_manifest" "$backend_manifest"
fi

# Publish non-HTML assets first, then replace prerendered HTML files.
publish_frontend() {
  log_step 'START publish frontend non-HTML'
  tar -cf - --exclude='*.html' -C "$frontend_stage" . | tar -xf - -C "$frontend_path"
  log_step "DONE publish frontend non-HTML duration=$(( $(date +%s) - mutation_started ))s"

  html_files="${stage}/frontend-html-files"
  find "$frontend_stage" -type f -name '*.html' -print0 > "$html_files"
  while IFS= read -r -d '' html_file; do
    relative_path="${html_file#"${frontend_stage}/"}"
    mkdir -p "${frontend_path}/$(dirname "$relative_path")"
    cp "$html_file" "${frontend_path}/${relative_path}"
  done < "$html_files"
  log_step "DONE publish frontend HTML duration=$(( $(date +%s) - mutation_started ))s"
}

if [ "$deploy_frontend" = '1' ]; then
  publish_frontend
fi

# Keep the cPanel/Passenger environment external to the deployed package.
update_backend() {
  log_step 'START update backend'
  tar -xzf "$backend_archive" -C "$backend_path"
  log_step "DONE update backend duration=$(( $(date +%s) - mutation_started ))s"

  run_step 'install backend requirements' \
    /home/re190924/virtualenv/repage_backend/3.12/bin/python \
    -m pip install -r "$backend_path/requirements.txt"

  selector_stdout="${stage}/cloudlinux-selector.stdout"
  selector_stderr="${stage}/cloudlinux-selector.stderr"
  log_step 'START CloudLinux management'
  cloudlinux_started="$(date +%s)"
  cd "$backend_path"
  set +e
  /usr/sbin/cloudlinux-selector run-script \
    --json \
    --interpreter python \
    --app-root repage_backend \
    --script-name scripts/production_manage.py \
    >"$selector_stdout" 2>"$selector_stderr"
  selector_exit=$?
  set -e
  if [ "$selector_exit" -ne 0 ]; then
    echo "CloudLinux management command failed to start (external exit code ${selector_exit})."
    exit 1
  fi

  selector_report="$('/home/re190924/virtualenv/repage_backend/3.12/bin/python' \
    "$backend_path/scripts/parse_cloudlinux_result.py" "$selector_stdout")"
  printf '%s\n' "$selector_report"
  log_step "DONE CloudLinux management duration=$(( $(date +%s) - cloudlinux_started ))s"

  log_step 'START Passenger restart'
  touch "$backend_path/tmp/restart.txt"
  log_step 'DONE Passenger restart'
}

if [ "$deploy_backend" = '1' ]; then
  update_backend
fi
log_step "DONE deploy mutation duration=$(( $(date +%s) - mutation_started ))s"

promote_manifests() {
  log_step 'START promote manifests'
  if [ "$deploy_frontend" = '1' ]; then
    mv -f "$frontend_manifest" "$frontend_current_manifest"
  fi
  if [ "$deploy_backend" = '1' ]; then
    mv -f "$backend_manifest" "$backend_current_manifest"
  fi
  log_step 'DONE promote manifests'
}

write_last_successful_sha() {
  if [[ ! "$sha" =~ ^[0-9a-fA-F]{40}$ ]]; then
    echo 'Invalid deploy SHA.' >&2
    return 1
  fi
  state_tmp="${last_success_state}.tmp.$$"
  printf '%s\n' "$sha" > "$state_tmp"
  chmod 600 "$state_tmp"
  mv -f "$state_tmp" "$last_success_state"
}

cleanup_deploy_stages() {
  local candidate name suffix
  for candidate in "$backend_path"/tmp/repage-deploy-*; do
    test -d "$candidate" || continue
    name="${candidate##*/}"
    suffix="${name#repage-deploy-}"
    if [[ "$suffix" =~ ^[0-9a-fA-F]{40}$ ]]; then
      log_step "remove completed deploy stage ${name}"
      rm -rf -- "$candidate"
    fi
  done
}

promote_manifests
log_step 'START record last successful SHA'
run_step 'record last successful SHA' write_last_successful_sha
run_step 'clean completed deploy stages' cleanup_deploy_stages
rm -f -- "$deploy_in_progress"
log_step 'DONE deploy successfully completed'
REMOTE
