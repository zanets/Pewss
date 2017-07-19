import Job from './Job.js'
import { SimController } from '../Sim'
import fs from 'fs'
module.exports = class JSimulation extends Job {
  constructor (data) {
    super(data)
    this.env = data.env || null
    this.gen = data.gen.JPath || null
    this.sche = data.sche.JPath || null
    this.sim = data.sim.JPath || null
    this.plat = data.plat.JPath || null
    this.argu = data.argu || null
  }

  static onProcess (job, done) {
    const d = job.data
    const sim = SimController.simulate(d.env, d.gen, d.sche, d.sim, d.plat, d.argu)

    let result = { type: null, msg: '' }
    const killer = Job.setKiller(sim, job.data.ttl, result)
    const logStream = fs.createWriteStream('./logFile.log', {flags: 'a'})
    sim.stdout.pipe(logStream)
    sim.stderr.pipe(logStream)

    sim.on('exit', (code) => {
      Job.clearKiller(killer)
      if (code === 0) {
        done(null, result)
      } else {
        done(`Exit with ${code}. Msg:\n${result.msg}`)
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
