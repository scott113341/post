#!/bin/bash

rm -rf build || exit 0
mkdir build

npm run build

COMMIT=$(git log -1 | cat | head -n 1)
rm -rf .git
git init
git config user.name "Travis CI"
git config user.email "travis@travis-ci.org"
git add .
git add -f build/
git commit -m "Deploy ${COMMIT} to GitHub Pages"
git push --force "https://${GH_TOKEN}@${GH_REF}" master:gh-pages
