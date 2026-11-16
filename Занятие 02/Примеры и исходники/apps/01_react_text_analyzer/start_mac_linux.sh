#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Install Node.js first"; exit 1; }
npm install
npm run dev
