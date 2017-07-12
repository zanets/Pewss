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
const Logger = log4js.getLogger('dateFile')
module.exports = Logger
