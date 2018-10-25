#!/bin/bash

MONGOPATH="$(pwd)/Mongodb"
MONGOPORT=27017

stop_db() {
	mongod --shutdown --dbpath "$MONGOPATH"
}

start_db() {
	mongod --fork --dbpath "$MONGOPATH" --port $MONGOPORT --syslog
	redis-server --daemonize yes
}

trap stop_db INT

start_db
node Build/Server/Entry.js
