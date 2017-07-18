import kue from 'kue'
class JobManager {
  constructor () {
    this.Q = kue.createQueue()
    this.TTL = 60000
  }

  add (job, onComplete, onFailed) {
    this.Q.create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).save()
    .on('complete', onComplete)
    .on('failed', onFailed)
  }

  register (JobClass) {
    this.Q.process(JobClass.name, JobClass.onProcess)
  }
}

module.exports = {
  JobManager: new JobManager()
}
