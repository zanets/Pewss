import kue from 'kue'

module.exports = class JobManager {
  constructor () {
    this.Q = kue.createQueue()
  }

  add (job, onComplete, onFailed) {
    const kJob = this.Q.create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).removeOnComplete(true).save()
    kJob.on('complete', onComplete)
    kJob.on('failed', onFailed)
  }

  register () {
    for (const JobClass of arguments) {
      if (!('onProcess' in JobClass)) {
        console.error(`onProcess not found in ${JobClass.name || 'object'}`)
        process.exit(-1)
      }
      this.Q.process(JobClass.name, (JobClass.name === 'JSimulation') ? 10 : 1, JobClass.onProcess)
    }
  }
}
