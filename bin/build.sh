#!/usr/bin/bash

# Prebuild Clean
rm -rf ./dist/*

# Electron Builder
npm run dist

# Postbuild Clean
rm -rf ./dist/win-unpacked
rm ./dist/*.yml
rm ./dist/*.yaml

# Rename App
mv ./dist/Onyx*exe ./dist/onyx.exe
