import {default as Confs} from './Secrets/Configs.js'

const fs = require('fs')
const Base = `${__dirname}/Secrets`

module.exports = {
  TLS: {
    key: fs.readFileSync(`${Base}/TLS/key.pem`),
    cert: fs.readFileSync(`${Base}/TLS/cert.pem`),
    passphrase: Confs.TLS.phrase
  },
  Session: Confs.Session
}
