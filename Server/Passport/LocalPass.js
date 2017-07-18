import { Strategy as LocalStrategy } from 'passport-local'
import Encrypt from '../Encrypt.js'

module.exports = (passport, users) => {
  passport.serializeUser((user, done) => {
    done(null, user.getName())
  })

  passport.deserializeUser((name, done) => {
    const user = users[name]
    done(null, (user === undefined) ? false : user)
  })

  passport.use('json', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'passwd',
    session: true
  }, (name, passwd, done) => {
    let user = users[name]
    if (user === undefined) {
      done(null, false)
      return
    }

    Encrypt.compare(passwd, user.getPasswd()).then(res => {
      if (res === false) {
        done(null, false)
      } else {
        done(null, user)
      }
    })
  }))
}
