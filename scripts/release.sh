#!/bin/sh

RELEASE=$1

npm version $RELEASE
git commit --amend -m "release $RELEASE"
git tag "v$RELEASE" -m "v$RELEASE"
git push
git push --tags