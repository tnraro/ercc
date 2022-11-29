#!/bin/bash

if [ -z $1 ]; then
  echo version needed
  exit 1
fi
echo hotfix $1

echo $ bun run script/gen.js
bun run script/gen.js

echo $ git add .
git add .
echo $ git commit -S -m "feat: $1"
git commit -S -m "feat: $1"