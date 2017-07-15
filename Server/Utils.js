import process from 'process'
import Logger from './Logger.js'
// file type
const FT = {
  class: 'class',
  java: 'java',
  unknown: null
}
// file category
const FC = {
  scheduler: 'scheduler',
  generator: 'generator',
  platform: 'platform',
  simulator: 'simulator'
}

const BaseDir = process.cwd()
const ServerDir = `${BaseDir}/Server`
const ClientDir = `${BaseDir}/Client`
const HomeDir = `${ServerDir}/Home`
const SimDir = `${ServerDir}/Sim`

const pErrHandler = (err) => {
  Logger.error(err)
}

const eErrHandler = (err) => {
  Logger.error(err)
  process.exit(-1)
}

const thErrHandler = (err) => {
  throw err
}

const log = (msg, lv, orig) => {
  let lmsg = ''
  if (orig !== undefined) {
    if ('req' in orig) {
      lmsg += `${('user' in orig.req) ? orig.req.user.name : '*'} - ` +
              `${orig.req.ip} - `
    }
    lmsg += `${('name' in orig) ? orig.name : '*'} - ` +
            `${('ip' in orig) ? orig.ip : '*'} - ` +
            `${('c' in orig) ? orig.c : '*'} - ` +
            msg
  }

  if (typeof Logger[lv] === 'function') { Logger[lv](lmsg) }
}

module.exports = {
  FT,
  FC,
  BaseDir,
  HomeDir,
  ClientDir,
  SimDir,
  pErrHandler,
  eErrHandler,
  thErrHandler,
  log
}
