#!/bin/bash

mongod --fork --dbpath $(pwd)/Mongodb --port 27017 --syslog
redis-server --daemonize yes
node Build/Server/Entry.js
