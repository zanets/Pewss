
class Job {
  constructor (owner) {
    this.owner = owner
  }

  register () {}
}

class simJob extends Job {
  constructor () {

  }

}

class compJob extends Job {

}

module.exports = {
  simJob,
  compJob
}
