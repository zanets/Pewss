import { ChildProcess } from 'child_process'

module.exports = class Job {
  constructor (data) {
    this.ttl = data.ttl || 600000
  }

  static setKiller (target, ttl, result) {
    if (target instanceof ChildProcess) {
      const killer = setTimeout(() => {
        target.kill('SIGHUP')
        result.type = 'stderr'
        result.msg = 'Exceed Maximum of execution time.'
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
