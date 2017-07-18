import { ChildProcess } from 'child_process'
module.exports = class Job {
  constructor (data) {
    this.ttl = data.ttl || 60000
  }

  static onOutData (data, res) {
    res.type = 'stdout'
    res.msg += data
  }

  static onErrData (data, res) {
    res.type = 'stderr'
    res.msg += data
  }

  static setKiller (target, ttl) {
    if (target instanceof ChildProcess) {
      const killer = setTimeout(() => {
        target.kill('SIGHUP')
      }, ttl)
      return killer
    }
    return null
  }

  static clearKiller (killer) {
    clearTimeout(killer)
  }

  getTTL () {
    return this.ttl
  }
}
