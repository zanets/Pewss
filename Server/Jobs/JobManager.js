import kue from 'kue'

module.exports = class JobManager {
  constructor () {
    this.registered = []
    this.Q = kue.createQueue()
    this.simQ = kue.createQueue()

    /*
    Resolve MaxListenersExceededWarning.
      Be careful about memory leak from event emitter.
      The number of listener should not exceed it
    */
    this.Q.setMaxListeners(60)
    this.simQ.setMaxListeners(90)
  }

  add (job, onComplete, onFailed) {
    const qJob = this.createJob(job)
    qJob.on('complete', onComplete)
    qJob.on('failed', onFailed)
  }

  register () {
    for (const JobClass of arguments) {
      this.registered.push(JobClass.name)

      this.getQ(JobClass.name)
        .process(JobClass.name, 15, JobClass.onProcess)
    }
  }

  createJob (job) {
    return this.getQ(job.constructor.name).create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).removeOnComplete(true).save()
  }

  getQ (jname) {
    return (jname === 'JSimulation')
      ? this.simQ
      : this.Q
  }
}
