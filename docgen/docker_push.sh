#!/usr/bin/env bash

docker build -t docgen . --no-cache
docker tag docgen:latest uirouter/docgen:stable
docker push uirouter/docgen:stable

