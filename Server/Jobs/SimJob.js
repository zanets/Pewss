import Job from './Job.js'
import { SimController } from '../Sim'

module.exports = class SimJob extends Job {
  constructor (data) {
    super(data)
    this.env = data.env || null
    this.gen = data.generator.JPath || null
    this.sche = data.scheduler.JPath || null
    this.sim = data.simulator.JPath || null
    this.plat = data.platform.JPath || null
    this.argu = data.argums || null
  }

  static onProcess (job, done) {
    const d = job.data
    const sim = SimController.simulate(d.env, d.gen, d.sche, d.sim, d.plat, d.argu)
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
}
