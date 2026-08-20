#!/usr/bin/env bash
set -Eeuo pipefail

mode="${1:-apply}"
case "$mode" in
  plan|apply|finalize) ;;
  *) echo 'Invalid deploy mode.' >&2; exit 1 ;;
esac

: "${DEPLOY_SSH_HOST:?DEPLOY_SSH_HOST is required}"
: "${DEPLOY_SSH_PORT:?DEPLOY_SSH_PORT is required}"
: "${DEPLOY_SSH_USER:?DEPLOY_SSH_USER is required}"
: "${DEPLOY_SSH_KNOWN_HOSTS:?DEPLOY_SSH_KNOWN_HOSTS is required}"
: "${DEPLOY_SSH_PRIVATE_KEY:?DEPLOY_SSH_PRIVATE_KEY is required}"
: "${DEPLOY_FRONTEND_PATH:?DEPLOY_FRONTEND_PATH is required}"
: "${DEPLOY_BACKEND_PATH:?DEPLOY_BACKEND_PATH is required}"
: "${DEPLOY_SHA:?DEPLOY_SHA is required}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo 'DEPLOY_SHA must be a 40-character hexadecimal commit SHA.' >&2
  exit 1
fi

force_frontend="${FORCE_FRONTEND:-0}"
case "$force_frontend" in
  0|1) ;;
  *) echo "Invalid FORCE_FRONTEND flag." >&2; exit 1 ;;
esac

if [ "$mode" = "apply" ]; then
  : "${DEPLOY_PLAN_FRONTEND:?DEPLOY_PLAN_FRONTEND is required}"
  : "${DEPLOY_PLAN_BACKEND:?DEPLOY_PLAN_BACKEND is required}"
  case "$DEPLOY_PLAN_FRONTEND:$DEPLOY_PLAN_BACKEND" in
    0:0|0:1|1:0|1:1) ;;
    *) echo 'Invalid planned deploy components.' >&2; exit 1 ;;
  esac
  if [ "$DEPLOY_PLAN_FRONTEND" = '1' ]; then
    : "${FRONTEND_ARCHIVE:?FRONTEND_ARCHIVE is required}"
    : "${FRONTEND_MANIFEST:?FRONTEND_MANIFEST is required}"
  fi
  if [ "$DEPLOY_PLAN_BACKEND" = '1' ]; then
    : "${BACKEND_ARCHIVE:?BACKEND_ARCHIVE is required}"
    : "${BACKEND_MANIFEST:?BACKEND_MANIFEST is required}"
  fi
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

read_remote_state() {
  local state_started state_snapshot key value
  state_started="$(date +%s)"
  log_step 'START read deploy state'
  if ! state_snapshot="$("${remote[@]}" bash -s -- "$DEPLOY_BACKEND_PATH" <<'REMOTE_STATE'
set -Eeuo pipefail
backend_path="$1"
state_file="${backend_path}/tmp/repage-last-successful-sha"
state_status=absent
state_sha=''
if test -f "$state_file"; then
  state_value="$(cat "$state_file")"
  if [[ "$state_value" =~ ^[0-9a-fA-F]{40}$ ]]; then
    state_status=valid
    state_sha="$state_value"
  else
    state_status=invalid
  fi
fi
marker_present=0
if test -f "${backend_path}/tmp/repage-deploy-in-progress"; then
  marker_present=1
fi
printf 'state_status=%s\n' "$state_status"
if [ "$state_status" = 'valid' ]; then
  printf 'state_sha=%s\n' "$state_sha"
fi
printf 'marker_present=%s\n' "$marker_present"
REMOTE_STATE
  )"; then
    log_step 'FAIL read deploy state: SSH transport unavailable'
    return 1
  fi
  state_status=''
  state_sha=''
  marker_present=''
  while IFS='=' read -r key value; do
    case "$key" in
      state_status) state_status="$value" ;;
      state_sha) state_sha="$value" ;;
      marker_present) marker_present="$value" ;;
      *) log_step 'FAIL read deploy state: invalid remote response'; return 1 ;;
    esac
  done <<< "$state_snapshot"
  case "$state_status" in
    absent|invalid) state_sha='' ;;
    valid) [[ "$state_sha" =~ ^[0-9a-fA-F]{40}$ ]] || {
      log_step 'FAIL read deploy state: invalid SHA response'
      return 1
    } ;;
    *) log_step 'FAIL read deploy state: invalid status response'; return 1 ;;
  esac
  case "$marker_present" in
    0|1) ;;
    *) log_step 'FAIL read deploy state: invalid marker response'; return 1 ;;
  esac
  log_step "DONE read deploy state duration=$(( $(date +%s) - state_started ))s"
}

resolve_plan() {
  local comparable_sha plan_output
  if [ "$state_status" = 'valid' ]; then
    comparable_sha="$state_sha"
    if ! git cat-file -e "${comparable_sha}^{commit}" 2>/dev/null; then
      log_step 'Fetching missing last successful SHA'
      if ! git fetch --no-tags origin "$comparable_sha" || \
        ! git cat-file -e "${comparable_sha}^{commit}" 2>/dev/null; then
        log_step 'Last successful SHA unavailable locally; using full deploy fallback'
        state_sha=''
      fi
    fi
  fi

  plan_output="$(bash .github/scripts/resolve-deploy-plan.sh "$state_status" "$state_sha" "$marker_present" "$DEPLOY_SHA" "$force_frontend")"
  read -r deploy_frontend deploy_backend finalize_only recovery_full <<< "$plan_output"
  log_step "Resolved deploy plan frontend=${deploy_frontend} backend=${deploy_backend} finalize_only=${finalize_only} recovery_full=${recovery_full}"
}

if [ "$mode" = 'plan' ]; then
  read_remote_state
  resolve_plan
  printf 'deploy_frontend=%s\n' "$deploy_frontend"
  printf 'deploy_backend=%s\n' "$deploy_backend"
  printf 'finalize_only=%s\n' "$finalize_only"
  printf 'recovery_full=%s\n' "$recovery_full"
  exit 0
fi

if [ "$mode" = 'finalize' ]; then
  : "${DEPLOY_PLAN_FRONTEND:?DEPLOY_PLAN_FRONTEND is required}"
  : "${DEPLOY_PLAN_BACKEND:?DEPLOY_PLAN_BACKEND is required}"
  case "$DEPLOY_PLAN_FRONTEND:$DEPLOY_PLAN_BACKEND" in
    0:0|0:1|1:0|1:1) ;;
    *) echo 'Invalid planned deploy components.' >&2; exit 1 ;;
  esac
  log_step 'START finalize post-smoke deployment'
  "${remote[@]}" bash -s -- "$DEPLOY_SHA" "$DEPLOY_BACKEND_PATH" \
    "$DEPLOY_PLAN_FRONTEND" "$DEPLOY_PLAN_BACKEND" < .github/scripts/finalize-deploy.sh
  log_step 'DONE finalize post-smoke deployment'
  exit 0
fi

read_remote_state
resolve_plan
if [ "$deploy_frontend" != "$DEPLOY_PLAN_FRONTEND" ] || \
  [ "$deploy_backend" != "$DEPLOY_PLAN_BACKEND" ] || \
  [ "$finalize_only" != "${DEPLOY_PLAN_FINALIZE_ONLY:-0}" ] || \
  [ "$recovery_full" != "${DEPLOY_PLAN_RECOVERY_FULL:-0}" ]; then
  echo 'Deployment plan changed after planning; aborting before mutation.' >&2
  exit 1
fi
if [ "$finalize_only" = '1' ] || \
  { [ "$deploy_frontend" = '0' ] && [ "$deploy_backend" = '0' ]; }; then
  log_step 'No application apply required; waiting for post-deploy smoke/finalize'
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
  non_html_started="$(date +%s)"
  tar -cf - --exclude='*.html' -C "$frontend_stage" . | tar -xf - -C "$frontend_path"
  log_step "DONE publish frontend non-HTML duration=$(( $(date +%s) - non_html_started ))s"

  html_files="${stage}/frontend-html-files"
  html_started="$(date +%s)"
  find "$frontend_stage" -type f -name '*.html' -print0 > "$html_files"
  while IFS= read -r -d '' html_file; do
    relative_path="${html_file#"${frontend_stage}/"}"
    mkdir -p "${frontend_path}/$(dirname "$relative_path")"
    cp "$html_file" "${frontend_path}/${relative_path}"
  done < "$html_files"
  log_step "DONE publish frontend HTML duration=$(( $(date +%s) - html_started ))s"
}

if [ "$deploy_frontend" = '1' ]; then
  publish_frontend
fi

# Keep the cPanel/Passenger environment external to the deployed package.
update_backend() {
  log_step 'START update backend'
  backend_started="$(date +%s)"
  tar -xzf "$backend_archive" -C "$backend_path"
  log_step "DONE update backend duration=$(( $(date +%s) - backend_started ))s"

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
  passenger_started="$(date +%s)"
  touch "$backend_path/tmp/restart.txt"
  log_step "DONE Passenger restart duration=$(( $(date +%s) - passenger_started ))s"
}

if [ "$deploy_backend" = '1' ]; then
  update_backend
fi
log_step "DONE deploy mutation duration=$(( $(date +%s) - mutation_started ))s"

promote_manifests() {
  log_step 'START promote manifests'
  manifests_started="$(date +%s)"
  if [ "$deploy_frontend" = '1' ]; then
    mv -f "$frontend_manifest" "$frontend_current_manifest"
  fi
  if [ "$deploy_backend" = '1' ]; then
    mv -f "$backend_manifest" "$backend_current_manifest"
  fi
  log_step "DONE promote manifests duration=$(( $(date +%s) - manifests_started ))s"
}

promote_manifests
log_step 'DONE apply completed; awaiting post-deploy smoke and finalize'
REMOTE
