import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JFileDelete extends Job {
  constructor (uid, data) {
    super(data)
    this.uid = uid || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
  }

  static async onProcess (job, done) {
    const d = job.data

    try {
      const User = UserManager.getUser(d.uid)
      await User.deleteFile('java', d.fCate, d.fName)
      await User.deleteFile('class', d.fCate, d.fName)
      done(null, 'Delete success')
    } catch (err) { done(err.msg) }
  }

  getData () {
    return {
      uid: this.uid,
      fCate: this.fCate,
      fName: this.fName,
      ttl: this.ttl
    }
  }
}
