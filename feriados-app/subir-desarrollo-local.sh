#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
export FERIADOS_SOURCE="$HERE"
exec bash "$HERE/deploy/desarrollo-local/publicar.sh" --deploy "$@"
