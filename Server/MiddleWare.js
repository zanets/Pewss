import UserManager from './UserManager.js'
import { log } from './Utils.js'

const getUser = (req) => {
  return UserManager.getUser(req.user.Name)
}

const PewssAPI = (req, res, next) => {
  req['pewss'] = { user: null }
  next()
}

const isLogin = (req, res, next) => {
  if (req.isAuthenticated() && getUser(req)) {
    req.pewss.user = getUser(req)
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

const writeLog = (req, res, next) => {
  let orig = {
    name: (req.user) ? req.user.Name : '*',
    ip: (req.ip) ? req.ip : '*'
  }

  let msg = `${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} `

  const writeLogAfter = () => {
    let sc = res.statusCode
    let msgType = 'info'

    for (let mcs in mStatusCode) {
      if (mStatusCode[mcs].includes(sc)) {
        msgType = mcs
      }
    }

    orig['sc'] = sc
    log(msg, msgType, orig)

    res.removeListener('finish', writeLogAfter)
  }
  res.on('finish', writeLogAfter)

  next()
}

module.exports = {
  PewssAPI, isLogin, writeLog
}
