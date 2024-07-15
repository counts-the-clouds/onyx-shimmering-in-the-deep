#!/usr/bin/bash

bin/compile-style.sh
bin/generate-client-files.js
bin/test.sh

npm run start