import {JobState, log} from './Utils.js'

class Job {
  constructor (owner, uuid) {
    this.owner = owner
    this.id = uuid
    this.state = JobState.Q
  }

  getId () {
    return this.id
  }

  getOwner () {
    return this.id
  }

  run () {
    console.error('Override me')
  }

  stop () {
    console.error('Override me')
  }
}

class wsJob extends Job {
  constructor (owner, uuid) {
    super(owner, uuid)
    this.socket = null
  }

  open () {

  }

  send () {

  }
}

class simJob extends wsJob {
  constructor () {
    super()
    log(`Create simJob ${this.id}`, 'info', {name: this.owners})
  }

  run () {

  }

  stop () {

  }
}

module.exports = {
  simJob
}
