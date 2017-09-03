#! /bin/sh
### BEGIN INIT INFO
# Provides:             pewss-server
# Required-Start:       $local_fs $network redis-server mongodb
# Required-Stop:        $local_fs $network redis-server mongodb
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    Pewss Server
# Description:          Pewss Server
### END INIT INFO

. /lib/lsb/init-functions

NAME="pewss-server"
PIDFILE="/var/run/${NAME}.pid"
LOGPATH="/var/log/${NAME}"
APPPATH="/Pewss"
NMODULES="${APPPATH}/node_modules"

start () {
  if [[ -e $PIDFILE ]]; then
    echo "Service is running already. PID=$(cat ${PIDFILE})"
    exit 1
  fi
  if [[ ! -d $LOGPATH ]]; then
    mkdir -p $LOGPATH 
  fi 
  
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart|force-reload)
    stop
    start
    ;;
  *)
    echo "Usage: /etc/init.d/$NAME {start|stop|restart|force-reload|status}" >&2
    exit 1
    ;;
esac

exit 0
