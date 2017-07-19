import Job from './Job.js'
import { UserManager } from '../User'
import { fTypes } from '../File'

module.exports = class JFileRead extends Job {
  constructor (uid, data) {
    super(data)
    this.uid = uid || null
    this.fOwner = data.fOwner || null
    this.fCate = data.fCate || null
    this.fName = data.fName || null
    this.fContent = data.fContent || null
  }

  static async onProcess (job, done) {
    const d = job.data
    try {
      const User = UserManager.getUser(d.uid)
      const content = await User.getFileContent(d.fCate, d.fName)
      const isPub = User.isPub(fTypes.Class, d.fCate, d.fName)

      if (content) {
        done(null, { data: content, isPub })
      } else {
        throw new Error('File not found')
      }
    } catch (err) { done(err.msg) }
  }

  getData () {
    return {
      uid: this.uid,
      fOwner: this.fOwner,
      fCate: this.fCate,
      fName: this.fName,
      fContent: this.fContent,
      ttl: this.ttl
    }
  }
}
