import {simJob} from './Job.js'
import {JobState} from './Utils.js'

class JobManager {
  constructor () {
    this.JobQueue = []
    this.cRunning = 0
  }

  addJob () {

  }

  delJob () {

  }
}

module.exports = {
  JobManager: new JobManager()
}
