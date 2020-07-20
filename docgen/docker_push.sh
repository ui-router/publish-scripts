#!/usr/bin/env bash

VERSION=$(jq -r .version < ../package.json);
docker build -t docgen . --no-cache
docker tag docgen:latest uirouter/docgen:$VERSION
docker push uirouter/docgen:$VERSION
docker tag docgen:latest uirouter/docgen:stable
docker push uirouter/docgen:stable

