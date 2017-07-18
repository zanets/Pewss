import Job from './Job.js'
import SimController from '../SimController.js'

module.exports = class CompJob extends Job {
  constructor (data) {
    super(data)
    this.env = data.env || null
    this.fOwner = data.fOwner || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
  }

  static onProcess (job, done) {
    const d = job.data
    const sim = SimController.compile(d.env, d.fOwner, d.fCate, d.fName)
    const killer = Job.setKiller(sim, job.data.ttl)
    let result = { type: null, msg: '' }
    sim.stdout.on('data', data => Job.onOutData(data, result))
    sim.stderr.on('data', data => Job.onErrData(data, result))
    sim.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0 || 1) {
        done(null, result)
      } else {
        done(result)
      }
    })
  }

  getData () {
    return {
      env: this.env,
      fOwner: this.fOwner,
      fCate: this.fCate,
      fName: this.fName,
      ttl: this.ttl
    }
  }
}
