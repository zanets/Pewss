#!/bin/bash

tmux split-window 'export NODE_ENV=development && ./node_modules/webpack/bin/webpack.js -d --progress --colors --watch --config webpack.dev.js'
tmux split-window 'export NODE_ENV=development && ./node_modules/nodemon/bin/nodemon.js --ignore Server/Home Server/Entry.js --exec ./node_modules/babel-cli/bin/babel-node.js'
