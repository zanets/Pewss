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
  }, async (username, password, done) => {
    let user = UserManager.getUser(null, username)
    if (user === undefined) {
      log(`Unknown user ${username} try to log-in`, 'warn')
      return done(null, false)
    }

    const isValid = await Encrypt.compare(
      password, user.getPasswd()
    )

    if (isValid) {
      log(`User ${username} log-in`, 'info')
      return done(null, user)
    } else {
      log(`User ${username} try to log-in with wrong passwd`, 'warn')
      return done(null, false)
    }
  }))
}
