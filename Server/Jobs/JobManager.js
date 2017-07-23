import kue from 'kue'

module.exports = class JobManager {
  constructor () {
    this.registered = []
    this.Q = kue.createQueue()
    this.Q.setMaxListeners(1000)
  }

  add (job, onComplete, onFailed) {
    const qJob = this.createKJob(job)
    qJob.on('complete', onComplete)
    qJob.on('failed', onFailed)
  }

  register () {
    for (const JobClass of arguments) {
      if (!('onProcess' in JobClass)) {
        console.error(`onProcess not found in ${JobClass.name || 'object'}`)
        process.exit(-1)
      }
      this.registered.push(JobClass.name)
      this.Q.process(JobClass.name, 10, JobClass.onProcess)
    }
  }

  createKJob (job) {
    return this.Q.create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).removeOnComplete(true).save()
  }
}
