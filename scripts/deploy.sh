#!/bin/bash

# Deploy a build to the remote git repo

branch=$1
commit=$2

if [[ -z "${commit}" ]]; then
  echo "Usage: $0 [branch] [commit]" >&2
  exit 1
fi

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

git checkout -b deploy
git fetch origin
git reset origin/${branch}

# Make sure build directory is not ignored
( sed -i.bak '/^build$/d' .gitignore || true ) && rm -f .gitignore.bak

git add -A
git commit -m "Deploy build from ${commit} [skip ci]" || echo "No changes to commit"

git push origin HEAD:${branch}
