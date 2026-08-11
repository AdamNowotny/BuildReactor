#!/usr/bin/env bash

set -euo pipefail

PACKAGE_PATH=${1:?package path is required}
PUBLISH=${2:-false}

: "${CHROME_PUBLISHER_ID:?CHROME_PUBLISHER_ID is required}"
: "${CHROME_EXTENSION_ID:?CHROME_EXTENSION_ID is required}"
: "${CHROME_CLIENT_ID:?CHROME_CLIENT_ID is required}"
: "${CHROME_CLIENT_SECRET:?CHROME_CLIENT_SECRET is required}"
: "${CHROME_REFRESH_TOKEN:?CHROME_REFRESH_TOKEN is required}"

API_NAME="publishers/${CHROME_PUBLISHER_ID}/items/${CHROME_EXTENSION_ID}"
API_BASE="https://chromewebstore.googleapis.com/v2/${API_NAME}"
UPLOAD_URL="https://chromewebstore.googleapis.com/upload/v2/${API_NAME}:upload"
TOKEN_RESPONSE=$(curl -fsS -X POST 'https://oauth2.googleapis.com/token' \
    --data-urlencode "client_id=${CHROME_CLIENT_ID}" \
    --data-urlencode "client_secret=${CHROME_CLIENT_SECRET}" \
    --data-urlencode 'grant_type=refresh_token' \
    --data-urlencode "refresh_token=${CHROME_REFRESH_TOKEN}")
ACCESS_TOKEN=$(jq -er '.access_token' <<<"${TOKEN_RESPONSE}")

response_file=$(mktemp)
trap 'rm -f "${response_file}"' EXIT

request_status=$(curl -sS -o "${response_file}" -w '%{http_code}' -X POST \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H 'Content-Type: application/zip' \
    --data-binary "@${PACKAGE_PATH}" \
    "${UPLOAD_URL}")

if [[ ${request_status} -lt 200 || ${request_status} -ge 300 ]]; then
    printf 'Chrome Web Store upload failed (%s):\n' "${request_status}" >&2
    jq . "${response_file}" 2>/dev/null || cat "${response_file}" >&2
    exit 1
fi

upload_state=$(jq -r '.uploadState // empty' "${response_file}")
for _ in {1..12}; do
    [[ ${upload_state} != 'IN_PROGRESS' ]] && break
    sleep 5
    curl -fsS -H "Authorization: Bearer ${ACCESS_TOKEN}" "${API_BASE}:fetchStatus" >"${response_file}"
    upload_state=$(jq -r '.lastAsyncUploadState // empty' "${response_file}")
done

if [[ ${upload_state} != 'SUCCEEDED' && ${upload_state} != 'SUCCESS' && -n ${upload_state} ]]; then
    printf 'Chrome Web Store upload ended with state %s:\n' "${upload_state}" >&2
    jq . "${response_file}" >&2
    exit 1
fi

if [[ ${PUBLISH} == 'true' ]]; then
    curl -fsS -X POST \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H 'Content-Type: application/json' \
        -d '{}' \
        "${API_BASE}:publish"
    printf 'Chrome Web Store package submitted for publication.\n'
else
    printf 'Chrome Web Store package uploaded without publishing.\n'
fi
