import Job from './Job.js'
import UserManager from '../UserManager.js'

module.exports = class ModUserJob extends Job {
  constructor (uname, operator) {
    super({})
    this.uname = uname || null
    this.operator = operator || null
  }

  static async onProcess (job, done) {
    const d = job.data
    try {
      await UserManager.modUser(d.uname, d.operator)
      done(null)
    } catch (err) { done(err.msg) }
  }

  getData () {
    return {
      uname: this.uname,
      operator: this.operator
    }
  }
}
