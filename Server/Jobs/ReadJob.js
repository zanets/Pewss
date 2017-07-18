import Job from './Job.js'
import { UserManager } from '../User'
import { fTypes } from '../File'

module.exports = class ReadJob extends Job {
  constructor (uname, data) {
    super(data)
    this.uname = uname || null
    this.fOwner = data.fOwner || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
    this.fContent = data.fContent || null
  }

  static async onProcess (job, done) {
    const d = job.data
    try {
      const User = UserManager.getUser(d.uname)
      const content = await User.getFileContent(d.fCate, d.fName)
      const isPub = UserManager.isPub(d.fOwner, fTypes.Class, d.fCate, d.fName)

      if (content) {
        done(null, { data: content, isPub })
      } else {
        throw new Error('File not found')
      }
    } catch (err) { done(err.msg) }
  }

  getData () {
    return {
      uname: this.uname,
      fOwner: this.fOwner,
      fCate: this.fCate,
      fName: this.fName,
      fContent: this.fContent,
      ttl: this.ttl
    }
  }
}
