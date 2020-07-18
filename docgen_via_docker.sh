#!/usr/bin/env bash
set -ex
docker run -it -v `pwd`:/home/node/work/project uirouter/docgen:stable
