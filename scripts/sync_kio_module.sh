#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"
MODULE_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"
NODE_MODULES="${MODULE_ROOT}/node_modules"

function sync_module () {
  local MODULE_NAME="${1}"
  case ${MODULE_NAME} in
    kio-ng2* )
      ;;

    * )
      MODULE_NAME="kio-ng2-${1}"
      ;;
  esac
  printf 'sync module: \x1b[1;35m%s\x1b[0m\n' "${MODULE_NAME}"

  local MODULE_PATH="$(cd "${MODULE_ROOT}/.."; cd "${MODULE_NAME}"; pwd)"
  printf 'at %s\n' "${MODULE_PATH}"

  local NODE_MODULE_PATH="${NODE_MODULES}/${MODULE_NAME}"

  printf 'rsync %s to %s\n' "${MODULE_PATH}/release/." "${NODE_MODULE_PATH}/release/."
  rsync -azh --delete "${MODULE_PATH}/release/." "${NODE_MODULE_PATH}/release/."

  "${SCRIPT_PATH}/merge_packages.js" "${MODULE_PATH}" "${NODE_MODULE_PATH}" > /dev/null

}

selected_modules=()

function select_module () {
  local module_name="${1}"
  if [[ ${#selected_modules} -eq 0 ]]; then
    selected_modules=("${module_name}")
  else
    selected_modules=("${selected_modules[@]}" "${module_name}")
  fi
}

function ask_modules () {
  local question="${1}"
  local modules=$(cd "${MODULE_ROOT}/.."; ls | grep ^kio-ng2)
  for mod in ${modules[@]}; do
    printf '%s "%s"? [y/n] ' "${question}" "${mod}"
    read yn
    case ${yn} in
      y|Y )
        select_module "${mod}"
        ;;

      n|N )
        ;;

      * )
        break
        ;;
    esac
  done
}

modules=${@:1}

if [[ ${#} -lt 1 ]]; then
  echo "no modules..."
  ask_modules "Sync module"
  for m in ${selected_modules[@]}; do
    sync_module "${m}"
  done
  exit 0
fi

for m in ${@:1}; do
  sync_module "$(basename "${m}")"
done