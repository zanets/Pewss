import log4js from 'log4js'

log4js.configure({
  appenders: [
    {
      'type': 'dateFile',
      'filename': 'Logs/server.log',
      'pattern': '-yyyy-MM-dd',
      'alwaysIncludePattern': false
    }
  ]
})
log4js.loadAppender('dateFile')

module.exports = log4js.getLogger('dateFile')
