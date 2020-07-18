#!/usr/bin/env bash
set -ex

WORK=/home/node/work
PROJECT=${WORK}/project

[[ -d $PROJECT ]] || {
  echo "package must be mounted in Docker at $PROJECT"
  exit 1
}

[[ -e $PROJECT/package.json ]] || {
  echo "package must be mounted in Docker at $PROJECT"
  exit 1
}

pushd $WORK
cp $WORK/project/docgen.json .
cp $WORK/project/typedoc.json .
README=$(jq -r .readme < typedoc.json)
cp $WORK/project/$README .

./prep_docgen.js
bash ./clone_repos.sh
npx typedoc
rm -rf project/src/includes
