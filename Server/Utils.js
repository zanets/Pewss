import process from 'process'
import Logger from './Logger.js'

module.exports = () => {
  /* environment */
  global.path = {}
  global.path.base = `${process.cwd()}`
  global.path.server = `${global.path.base}/${process.env.NODE_ENV === 'production' ? 'Build/Server' : 'Server'}`
  global.path.client = `${global.path.base}/Build/Client`
  global.path.home = `${global.path.server}/Home`
  global.path.sim = `${global.path.server}/Sim`
  global.path.node_modules = `${process.cwd()}/node_modules`

  /* help functions */
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

  global.node_env = process.env.NODE_ENV

  /* error handler */
  global.error = {}
  global.error.log = (err) => {
    global.log(err, 'error')
  }
  global.error.exit = (err) => {
    global.log(err, 'error')
    process.exit(-1)
  }
  global.error.throw = (err) => {
    throw err
  }
}
