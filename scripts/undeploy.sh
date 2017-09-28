#!/bin/bash

service pewss stop && \
update-rc.d -f pewss remove && \
( rm /etc/init.d/pewss; rm /etc/default/pewss ) 

systemctl daemon-reload

