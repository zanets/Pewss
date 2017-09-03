import process from 'process'
import Logger from './Logger.js'

module.exports = () => {
  console.log(process.env.NODE_ENV)
  global.BaseDir = process.env.NODE_ENV === "development"
    ? `${process.cwd()}`
    : `${process.cwd()}/Build`

  global.ServerDir = `${global.BaseDir}/Server`

  global.ClientDir = `${global.BaseDir}/Client`

  global.HomeDir = `${global.ServerDir}/Home`

  global.SimDir = `${global.ServerDir}/Sim`

  global.log = (msg, lv, orig) => {
    console.log(msg)

    orig = orig || {}

    msg = `${('name' in orig) ? orig.name : '*'} - ` +
      `${('ip' in orig) ? orig.ip : '*'} - ` +
      `${('sc' in orig) ? orig.sc : '*'} - ` +
      `${('err' in orig) ? orig.err : '*'} - ` +
      `${msg}`

    if (typeof Logger[lv] === 'function') {
      Logger[lv](msg)
    } else {
      console.log(`Wrong log level ${lv}`)
    }
  }

  global.pErrHandler = (err) => {
    global.log(err, 'error')
  }

  global.eErrHandler = (err) => {
    global.log(err, 'error')
    process.exit(-1)
  }
  global.thErrHandler = (err) => {
    throw err
  }
}
