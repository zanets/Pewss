#!/bin/bash

./node_modules/webpack/bin/webpack.js --progress --config webpack.prod.js
./node_modules/babel-cli/bin/babel.js -D -d Build/Server Server

curl -o Build/Server/Secrets/TLS/cert.pem --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/cert.pem
curl -o Build/Server/Secrets/TLS/key.pem.pem --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/key.pem
curl -o Build/Server/Secrets/Config.json --create-dirs https://gist.githubusercontent.com/darg20127/03709547d03161d68a6a9ba19872af86/raw/Config.json

