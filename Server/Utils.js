import process from 'process'
import Logger from './Logger.js'

const BaseDir = process.cwd()
const ServerDir = `${BaseDir}/Server`
const ClientDir = `${BaseDir}/Client`
const HomeDir = `${ServerDir}/Home`
const SimDir = `${ServerDir}/Sim`

const log = (msg, lv, orig) => {
  orig = orig || {}

  msg = `${('name' in orig) ? orig.name : '*'} - ` +
    `${('ip' in orig) ? orig.ip : '*'} - ` +
    `${('sc' in orig) ? orig.sc : '*'} - ` +
    `${('err' in orig) ? orig.err : '*'} - ` +
    `${msg}`

  if (typeof Logger[lv] === 'function') { Logger[lv](msg) }
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

const JobState = {
  Q: 'in-queue',
  R: 'running',
  E: 'error',
  F: 'finish'
}

module.exports = {
  BaseDir,
  HomeDir,
  ClientDir,
  SimDir,
  pErrHandler,
  eErrHandler,
  thErrHandler,
  log,
  JobState
}
