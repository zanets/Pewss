#!/bin/bash

cp contrib/init/debian/pewss /etc/init.d/pewss
echo -e "APP_DIR=$(pwd)\nNODE=$(which node)\n" > /etc/default/pewss

systemctl daemon-reload

update-rc.d pewss defaults 
