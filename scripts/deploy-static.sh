#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/nodeadmin/DragonAI-Website}"
PUBLIC_DIR="${PUBLIC_DIR:-/var/www/DragonAI-Website/public}"

cd "$REPO_DIR"
git pull --ff-only

sudo mkdir -p "$PUBLIC_DIR"

sudo rsync -a --delete \
  --include='/Assets/***' \
  --include='/*.html' \
  --include='/index.css' \
  --exclude='*' \
  "$REPO_DIR/" \
  "$PUBLIC_DIR/"

sudo chown -R caddy:caddy "$PUBLIC_DIR"

echo "Deployed DragonAI website to $PUBLIC_DIR"
