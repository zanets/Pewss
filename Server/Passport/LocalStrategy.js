import { Strategy } from 'passport-local'
import { UserManager } from '../User'
import Encrypt from '../Encrypt.js'
module.exports = (passport) => {
  passport.serializeUser((user, cb) => {
    cb(null, user.getId())
  })

  passport.deserializeUser((id, cb) => {
    let user = UserManager.getUser(id)
    cb(null, user)
  })

  passport.use(new Strategy({
    usernameField: 'name',
    passwordField: 'passwd',
    session: true
  }, (username, password, done) => {
    let user = UserManager.getUser(null, username)
    if (user === undefined) {
      global.log(`Unknown user ${username} try to log-in`, 'warn')
      return done(null, false)
    }

    const isValid = Encrypt.compare(
      password, user.getPasswd()
    )

    if (isValid) {
      global.log(`User ${username} log-in`, 'info')
      return done(null, user)
    } else {
      global.log(`User ${username} try to log-in with wrong passwd`, 'warn')
      return done(null, false)
    }
  }))
}
