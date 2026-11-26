#!/usr/bin/env bash
# Run the browser tests in the official Playwright container against a deployed stack.
#   E2E_BASE_URL   site to test (default http://localhost, i.e. run it on the server itself)
#   E2E_ENV_FILE   file with E2E_<ROLE>_USER / E2E_<ROLE>_PASSWORD (default ~/.config/skud-e2e/credentials.env)
#   extra arguments go to `playwright test`, e.g. ./run.sh tests/public.spec.ts
set -euo pipefail
cd "$(dirname "$0")"
ENV_FILE="${E2E_ENV_FILE:-$HOME/.config/skud-e2e/credentials.env}"
env_args=()
[ -f "$ENV_FILE" ] && env_args=(--env-file "$ENV_FILE")
exec docker run --rm --network host --ipc host --init -u "$(id -u):$(id -g)" -e HOME=/tmp \
  -e E2E_BASE_URL="${E2E_BASE_URL:-http://localhost}" -e E2E_RUN="${E2E_RUN:-$(date +%m%d%H%M)}" "${env_args[@]}" \
  -v "$PWD":/e2e -w /e2e mcr.microsoft.com/playwright:v1.49.1-noble \
  sh -c 'npm install --no-audit --no-fund --silent >/dev/null && npx playwright test "$@"' -- "$@"
