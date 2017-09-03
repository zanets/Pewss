#!/usr/bin/env bash

export NODE_ENV=production
./node_modules/webpack/bin/webpack.js --progress --config webpack.prod.js
./node_modules/babel-cli/bin/babel.js -D -d Build/Server Server
