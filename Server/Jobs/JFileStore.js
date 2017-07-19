import Job from './Job.js'
import { UserManager } from '../User'

module.exports = class JFileStore extends Job {
  constructor (uid, data) {
    super(data)
    this.uid = uid || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
    this.fContent = data.fContent || null
  }

  static async onProcess (job, done) {
    const d = job.data
    try {
      const User = UserManager.getUser(d.uid)
      await User.setFileContent(d.fCate, d.fName, d.fContent)
      done(null, 'Save complete')
    } catch (err) {
      done(err.msg)
    }
  }

  getData () {
    return {
      uid: this.uid,
      fCate: this.fCate,
      fName: this.fName,
      fContent: this.fContent,
      ttl: this.ttl
    }
  }
}
