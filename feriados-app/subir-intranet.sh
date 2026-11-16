#!/usr/bin/env bash
set -euo pipefail
HERE=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
export FERIADOS_SOURCE="$HERE"
exec python3 "$HERE/deploy/intranet/publicar.py" "$@"
