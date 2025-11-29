#!/bin/bash

# Deploy a build to the remote git repo

remote=$1
branch=$2

if [[ -z "${branch}" ]]; then
  echo "Usage: $0 [remote] [branch]" >&2
  exit 1
fi

commit=$(git rev-parse HEAD)
if [[ -n "$(git status --porcelain)" ]]; then
  commit="${commit}-dirty"
fi

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

# Switch to a branch whose name is unlikely to conflict with any existing local branch
git branch -D __deploy &>/dev/null || true
git checkout -b __deploy

# Fetch remote
git fetch ${remote}
git reset ${remote}/${branch}

# Store source commit in build directory for each theme and plugin
for dir in themes/rara plugins/rara-maps; do
  mkdir -p ${dir}/build
  rm -f ${dir}/build/commit
  echo ${commit} > ${dir}/build/commit
done

# Make sure build directories are not ignored
( sed -i.bak '/^build$/d' .gitignore || true ) && rm -f .gitignore.bak

# Create a commit, referencing the source commit in the 
git add -A
git commit -m "Deploy build from ${commit} [skip ci]" || echo "No changes to commit"

# Push to remote
git push ${remote} HEAD:${branch}
