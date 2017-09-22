#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"
_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"


NGC_BIN="${_ROOT}/node_modules/.bin/ngc"

SRC_ROOT="${_ROOT}/src"
BUILD_ROOT="${_ROOT}/build"
DEPLOY_ROOT="${_ROOT}/release"

MODULE_NAME="$(basename "${_ROOT}")"


function build() {
  cd "${_ROOT}"
  if [[ -d "build" ]]; then
    rm -rf "build"
  fi  
  echo "copy ${_ROOT}/src"
  scp -r "./src" "./build"
  echo "compile ${_ROOT}/build"
  "${NGC_BIN}" -p tsconfig-ngc.json  
}

function list_ts () {
  cd "${1}"
  find . -type file | grep .ts$ | grep -v .d.ts$ 
}

function clean_build() {
  printf 'clean up "%s"\n' "${BUILD_ROOT}"
  cd "${BUILD_ROOT}"
  for ts_file in `list_ts "${BUILD_ROOT}"`; do
    #printf '%s\n' "${ts_file}"
    rm "${ts_file}"
  done
}


function deploy () {
  if [[ ! -d "${BUILD_ROOT}" ]]; then
    printf '%s\n' "No build to deploy."
    exit 1
  fi

  rm -rf "${DEPLOY_ROOT}"
  mv "${BUILD_ROOT}" "${DEPLOY_ROOT}"
}


function copy_release () {
  if [[ ! -d "${DEPLOY_ROOT}" ]]; then
    printf '%s\n' "No release to copy."
    exit 1
  fi

  if [[ ! -d "${1}/node_modules/${MODULE_NAME}"  ]]; then
    printf '%s\n' "No valid target."
    exit 2
  fi

  rm -rf "${1}/node_modules/${MODULE_NAME}/release"
  scp -r "${DEPLOY_ROOT}" "${1}/node_modules/${MODULE_NAME}/release"
}


case ${1} in
  "build" )
    build && clean_build && deploy
    ;;

  "clean" )
  clean_build
    ;;

  "deploy" )
  deploy
    ;;

  "list" )
  list_ts "${BUILD_ROOT}"
    ;;

  "copy" )
  copy_release "${2}"
    ;;
esac
