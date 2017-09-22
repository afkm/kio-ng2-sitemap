#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"

MODULE_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"
MODULE_NAME="$(basename "${MODULE_ROOT}")"
TEST_APP_ROOT="${MODULE_ROOT}/test-app"
TEST_APP_MODULE="${TEST_APP_ROOT}/node_modules/${MODULE_NAME}"

if [[ ! -d "${TEST_APP_ROOT}" ]]; then
  printf 'please create a test app at "%s"\n' "${TEST_APP_ROOT}"
  exit 1
fi


rsync -avzh "${MODULE_ROOT}/release/." "${TEST_APP_MODULE}/release/."
#rm -rf "${TEST_APP_MODULE}/release"
#scp -r "${MODULE_ROOT}/release" "${TEST_APP_MODULE}/."