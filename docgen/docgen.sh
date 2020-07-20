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
[[ -e typedoc.json ]] && rm typedoc.json
ln -s $WORK/project/typedoc.json .
README=$(jq -r .readme < typedoc.json)
cp $WORK/project/$README .

./prep_docgen.js
bash ./clone_repos.sh
cd project
../node_modules/.bin/typedoc --tsconfig tsconfig.docgen.json
rm -rf src/includes
