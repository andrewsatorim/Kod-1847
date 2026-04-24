#!/bin/bash
# Quick deployment (minimal output)
cd "$(dirname "$0")/.."
./scripts/deploy-miniapp.sh "$@"
