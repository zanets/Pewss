#!/bin/bash

cp contrib/init/debian/pewss /etc/init.d/pewss
echo "APP_DIR=$(pwd)\nNODE=$(which node)\n" > /etc/default/pewss

update-rc.d pewss defaults 
