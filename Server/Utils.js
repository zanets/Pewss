import process from 'process'
import Logger from './Logger.js'

const BaseDir = process.cwd()
const ServerDir = `${BaseDir}/Server`
const ClientDir = `${BaseDir}/Client`
const HomeDir = `${ServerDir}/Home`
const SimDir = `${ServerDir}/Sim`

const log = (msg, lv, orig) => {
  let lmsg = ''
  if (orig !== undefined) {
    if ('req' in orig) {
      lmsg += `${('user' in orig.req && orig.req.user !== null) ? orig.req.user.Name : '*'} - ` +
              `${orig.req.ip} - `
    }

    lmsg += `${('name' in orig) ? orig.name : '*'} - ` +
            `${('ip' in orig) ? orig.ip : '*'} - ` +
            `${('c' in orig) ? orig.c : '*'} - ` +
            `${('err' in orig) ? orig.err : '*'} - ` +
            `${msg}`
  }

  if (typeof Logger[lv] === 'function') { Logger[lv](lmsg) }
}

const pErrHandler = (err) => {
  log(err, 'error')
}

const eErrHandler = (err) => {
  log(err, 'error')
  process.exit(-1)
}

const thErrHandler = (err) => {
  throw err
}

module.exports = {
  BaseDir,
  HomeDir,
  ClientDir,
  SimDir,
  pErrHandler,
  eErrHandler,
  thErrHandler,
  log
}
