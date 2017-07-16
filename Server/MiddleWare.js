import UserManager from './UserManager.js'
import { log } from './Utils.js'
const getUser = (req) => {
  return UserManager.getUser(req.user.Name)
}

const PewssAPI = (req, res, next) => {
  req['pewss'] = {
    msg: null,
    user: null
  }
  return next()
}

const isLogin = (req, res, next) => {
  if (req.isAuthenticated() && getUser(req)) {
    req.pewss.user = getUser(req)
    return next()
  } else {
    res.redirect('/login')
  }
}

const writeLog = (req, res, next) => {
  /* Before Response */
  req.pewss.msg = `${req.method} ${req.originalUrl}`
  log(`${req.pewss.msg} - ${req.body ? JSON.stringify(req.body) : '*'}`, 'info', {req: req})

  /* After Response */
  const writeLogAfter = () => {
    let msgType = 'info'
    const c = res.statusCode
    if (c === 500 || c === 404) {
      msgType = 'error'
    } else if (c === 401) {
      msgType = 'warning'
    }
    log(`${req.pewss.msg} - ${req.body}`, msgType, {c, req})
    res.removeListener('finish', writeLogAfter)
  }
  res.on('finish', writeLogAfter)

  return next()
}

module.exports = {
  PewssAPI, isLogin, writeLog
}
