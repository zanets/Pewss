import conf from './Config.json'
import fs from 'fs'

module.exports = {
  TLS: {
    key: fs.readFileSync(`${__dirname}/TLS/key.pem`),
    cert: fs.readFileSync(`${__dirname}/TLS/cert.pem`),
    passphrase: conf.TLS.phrase
  },
  Session: conf.Session,
  Passport: conf.Jwt
}
