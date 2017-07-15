import uuid from 'node-uuid'
import ws from 'ws'
const sJob = {
  Q: 'in-queue',
  R: 'running',
  E: 'error',
  F: 'finish'
}

class Job {
  constructor (owner) {
    this.owner = owner
    this.id = uuid.v4()
    this.ws =
    this.state = sJob.Q
  }

  getId () {
    return this.id
  }

}

module.exports = {
  Job,
  sJob
}
