#!/usr/bin/env bash

REPO=$1
DIR=$2
BRANCH=$3

mkdir -p $DIR
git clone $REPO $DIR
cd $DIR
git checkout $BRANCH
