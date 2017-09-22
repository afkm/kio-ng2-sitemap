#!/usr/bin/env bash
SCRIPT_PATH="$(dirname "${0}")"

MODULE_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"
MODULE_NAME="$(basename "${MODULE_ROOT}")"

TARGET_ARG="${1:-.}"

function getTargetRoot () {
  local TARGET_ROOT="$(cd "${TARGET_ARG}"; pwd)"
  printf '%s\n' "${TARGET_ROOT/node_modules*/}"
}

TARGET_ROOT="$(getTargetRoot)"

echo "TARGET_ROOT: ${TARGET_ROOT}"

TARGET_NODE_MODULES="${TARGET_ROOT}/node_modules"
TARGET_MODULE="${TARGET_NODE_MODULES}/${MODULE_NAME}"

function syncDir () {
  local dir_name="${1}"

  if [[ -d "${MODULE_ROOT}/${dir_name}" ]]; then
    rsync -azh --delete "${MODULE_ROOT}/${dirname}/." "${TARGET_MODULE}/${dirname}/."
  fi
}

syncDir "src"
syncDir "release"

"${SCRIPT_PATH}/merge_packages.js" "${MODULE_ROOT}" "${TARGET_MODULE}" > /dev/null