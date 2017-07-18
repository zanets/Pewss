import { ChildProcess } from 'child_process'
import SimController from './SimController.js'
class Job {
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
}

class SimJob extends Job {
  constructor (data) {
    super()
    this.env = data.env || null
    this.gen = data.generator.JPath || null
    this.sche = data.scheduler.JPath || null
    this.sim = data.simulator.JPath || null
    this.plat = data.platform.JPath || null
    this.argu = data.argums || null
    this.ttl = data.ttl || 60000
  }
  static onProcess (job, done) {
    const sim = SimController.simulate(
      job.data.env, job.data.gen, job.data.sche,
      job.data.sim, job.data.plat, job.data.argu
    )
    const killer = Job.setKiller(sim, job.data.ttl)
    let result = { status: null, msg: '' }
    sim.stdout.on('data', data => Job.onOutData(data, result))
    sim.stderr.on('data', data => Job.onErrData(data, result))
    sim.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0) {
        done(null, result)
      } else {
        done(`Exit with ${code}`)
      }
    })
  }
  getData () {
    return {
      env: this.env,
      gen: this.gen,
      sche: this.sche,
      sim: this.sim,
      plat: this.plat,
      argu: this.argu,
      ttl: this.ttl
    }
  }
  getTTL () {
    return this.ttl
  }
}

class CompJob extends Job {
  constructor (data) {
    super()
    this.env = data.env || null
    this.fOwner = data.fOwner || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
  }
  static onProcess (job, done) {
    const sim = SimController.compile(
      job.data.env, job.data.gen, job.data.sche,
      job.data.sim, job.data.plat, job.data.argu
    )
    this.setKiller(sim)
    sim.stdout.on('data', this.onOutData)
    sim.stderr.on('data', this.onErrData)
    sim.on('exit', (code) => {
      this.clearKiller()
      if (code === 0) {
        done(null, this.result)
      } else {
        done(`Exit with ${code}`)
      }
    })
  }
}

module.exports = {
  Job,
  SimJob,
  CompJob
}
