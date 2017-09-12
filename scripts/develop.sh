#!/bin/bash

[[ -e Server/Secrets/TLS/cert.pem ]] || curl -o Server/Secrets/TLS/cert.pem --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/cert.pem
[[ -e Server/Secrets/TLS/key.pem ]] || curl -o Server/Secrets/TLS/key.pem --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/key.pem
[[ -e Server/Secrets/Config.json ]] || curl -o Server/Secrets/Config.json --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/Config.json

tmux split-window 'export NODE_ENV=development && ./node_modules/webpack/bin/webpack.js -d --progress --colors --watch --config webpack.dev.js'
tmux split-window 'export NODE_ENV=development && ./node_modules/nodemon/bin/nodemon.js --ignore Server/Home Server/Entry.js --exec ./node_modules/babel-cli/bin/babel-node.js'
