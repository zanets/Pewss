#!/bin/bash

cp contrib/init/debian/pewss /etc/init.d/pewss
cp contrib/init/debian/pewss.default /etc/default/pewss

update-rc.d pewss defaults 
