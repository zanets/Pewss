import { UserManager } from './User'

const getUser = (req) => {
  return UserManager.getUser(req.user.Id)
}

const isLogin = (req, res, next) => {
  if (req.isAuthenticated() && getUser(req)) {
    next()
  } else {
    res.redirect('/login')
  }
}

const mStatusCode = {
  error: [500, 404],
  warning: [401],
  info: [200]
}

const filteSensitive = (oring) => {
  let filted = Object.assign({}, oring)

  if ( 'passwd' in filted ) {
    delete filted['passwd']
  }

  if ( '$setPasswd' in filted ) {
    delete filted['$setPasswd']
  }

  return filted
}

const writeLog = (req, res, next) => {
  let orig = {
    name: (req.user) ? req.user.Name : '*',
    ip: (req.ip) ? req.ip : '*'
  }

  let body = filteSensitive(req.body)

  let msg = `${req.method} ${req.originalUrl} ${JSON.stringify(body)} `

  const writeLogAfter = () => {
    let sc = res.statusCode
    let msgType = 'info'

    for (let mcs in mStatusCode) {
      if (mStatusCode[mcs].includes(sc)) {
        msgType = mcs
      }
    }

    orig['sc'] = sc
    global.log(msg, msgType, orig)

    res.removeListener('finish', writeLogAfter)
  }
  res.on('finish', writeLogAfter)

  next()
}

module.exports = {
  isLogin, writeLog
}
