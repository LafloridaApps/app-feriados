#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
if [[ $# -ne 1 || ! "$1" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,127}$ ]]; then
    echo "Uso: bash $0 <version>" >&2
    exit 1
fi
docker build -f "$SCRIPT_DIR/Dockerfile" -t "image-app-feriados:$1" "$APP_DIR"
