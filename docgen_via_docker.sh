#!/usr/bin/env bash
set -ex
docker run -v `pwd`:/home/node/work/project uirouter/docgen:stable
