import kue from 'kue'

class JobManager {
  constructor () {
    this.Queue = kue.createQueue()
  }
}

module.exports = JobManager
