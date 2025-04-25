#!/usr/bin/env bash

set -e  # Exit on error

# Variables
DEV_BRANCH="dev"
TMP_DIR=".phonolab_backend_sync_tmp"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "Current branch: $CURRENT_BRANCH"
echo "Pulling latest changes from '$DEV_BRANCH'..."

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Your working directory has uncommitted changes. Please commit or stash them before syncing."
  exit 1
fi

# Fetch and checkout dev
git fetch origin
git checkout "$DEV_BRANCH"
git pull origin "$DEV_BRANCH"

# temporary snapshot (excluding frontend/)
echo "Copying backend and root files from $DEV_BRANCH..."
rm -rf "$TMP_DIR"
mkdir "$TMP_DIR"
rsync -a --exclude 'frontend/' --exclude "$TMP_DIR" ./ "$TMP_DIR"

git checkout "$CURRENT_BRANCH"

echo "⬇Syncing backend files into $CURRENT_BRANCH..."
rsync -a --exclude 'frontend/' --delete "$TMP_DIR"/ ./

# Clean up
rm -rf "$TMP_DIR"

# Stage and commit changes
git add -A
if git diff --cached --quiet; then
  echo "No backend changes to commit."
else
  git commit -m "[sync] Pull backend updates from '$DEV_BRANCH'"
  echo "Backend changes committed to $CURRENT_BRANCH."
fi

echo "🎉 Done! '$CURRENT_BRANCH' is now up-to-date with backend changes from '$DEV_BRANCH'."
