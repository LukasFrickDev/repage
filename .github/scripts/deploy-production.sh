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

ssh_dir="${RUNNER_TEMP}/repage-deploy-ssh"
install -d -m 700 "$ssh_dir"
umask 077
printf '%s\n' "$DEPLOY_SSH_PRIVATE_KEY" > "$ssh_dir/id_ed25519"
printf '%s\n' "$DEPLOY_SSH_KNOWN_HOSTS" > "$ssh_dir/known_hosts"

ssh_args=(
  -i "$ssh_dir/id_ed25519"
  -p "$DEPLOY_SSH_PORT"
  -o UserKnownHostsFile="$ssh_dir/known_hosts"
  -o StrictHostKeyChecking=yes
)
remote=(ssh "${ssh_args[@]}" "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}")
scp_args=(
  -i "$ssh_dir/id_ed25519"
  -P "$DEPLOY_SSH_PORT"
  -o UserKnownHostsFile="$ssh_dir/known_hosts"
  -o StrictHostKeyChecking=yes
)

stage="${DEPLOY_BACKEND_PATH}/tmp/repage-deploy-${DEPLOY_SHA}"
"${remote[@]}" "mkdir -p '$stage' && chmod 700 '$stage'"

scp "${scp_args[@]}" "$FRONTEND_ARCHIVE" \
  "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/frontend.tar.gz"
scp "${scp_args[@]}" "$BACKEND_ARCHIVE" \
  "${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}:${stage}/backend.tar.gz"

"${remote[@]}" bash -s -- "$DEPLOY_SHA" "$DEPLOY_FRONTEND_PATH" "$DEPLOY_BACKEND_PATH" <<'REMOTE'
set -Eeuo pipefail

sha="$1"
frontend_path="$2"
backend_path="$3"
stage="${backend_path}/tmp/repage-deploy-${sha}"
frontend_archive="${stage}/frontend.tar.gz"
backend_archive="${stage}/backend.tar.gz"
frontend_stage="${stage}/frontend"
backend_stage="${stage}/backend"
frontend_rollback="${backend_path}/tmp/repage-rollback-frontend.tar.gz"
backend_rollback="${backend_path}/tmp/repage-rollback-backend.tar.gz"

test -f "$frontend_archive"
test -f "$backend_archive"
mkdir -p "$frontend_stage" "$backend_stage"
tar -xzf "$frontend_archive" -C "$frontend_stage"
tar -xzf "$backend_archive" -C "$backend_stage"
test -f "$frontend_stage/index.html"
test -f "$frontend_stage/404.html"
test -f "$frontend_stage/portfolio/axium/index.html"
test -f "$frontend_stage/.htaccess"
test -f "$backend_stage/passenger_wsgi.py"
test -f "$backend_stage/scripts/production_manage.py"

if test -d "$frontend_path"; then
  tar -czf "${stage}/previous-frontend.tar.gz" \
    --exclude='*.log' \
    -C "$frontend_path" .
  chmod 600 "${stage}/previous-frontend.tar.gz"
  mv -f "${stage}/previous-frontend.tar.gz" "$frontend_rollback"
fi

if test -d "$backend_path"; then
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
fi

# Publish non-HTML assets first, then replace prerendered HTML files.
tar -cf - --exclude='*.html' -C "$frontend_stage" . | tar -xf - -C "$frontend_path"
while IFS= read -r -d '' html_file; do
  relative_path="${html_file#"${frontend_stage}/"}"
  mkdir -p "${frontend_path}/$(dirname "$relative_path")"
  cp "$html_file" "${frontend_path}/${relative_path}"
done < <(find "$frontend_stage" -type f -name '*.html' -print0)

# Keep the cPanel/Passenger environment external to the deployed package.
tar -xzf "$backend_archive" -C "$backend_path"
/home/re190924/virtualenv/repage_backend/3.12/bin/python \
  -m pip install -r "$backend_path/requirements.txt"

cd "$backend_path"
/usr/sbin/cloudlinux-selector run-script \
  --json \
  --interpreter python \
  --app-root repage_backend \
  --script-name scripts/production_manage.py

touch "$backend_path/tmp/restart.txt"
rm -rf -- "$stage"
REMOTE
