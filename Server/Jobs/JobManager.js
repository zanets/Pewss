import kue from 'kue'
import { ChildProcess } from 'child_process'

let cQ = {}

module.exports = class JobManager {
  constructor () {
    this.Q = kue.createQueue()
    this.TTL = 60000
  }

  add (clientId, job, onComplete, onFailed) {
    const kJob = this.Q.create(
      job.constructor.name, job.getData()
    ).ttl(job.getTTL()).removeOnComplete(true).save()
    kJob.on('complete', onComplete)
    kJob.on('failed', onFailed)

    cQ[clientId] = {
      job: kJob,
      proc: null
    }
  }

  register () {
    for (const JobClass of arguments) {
      if (!('onProcess' in JobClass)) {
        console.error(`onProcess not found in ${JobClass.name || 'object'}`)
        process.exit(-1)
      }
      this.Q.process(JobClass.name, JobClass.onProcess)
    }
  }

  static addProc (jobId, proc) {
    console.log(cQ)
    if (!(jobId in cQ)) {
      console.error(`No job ${jobId} in ProcQueue`)
      return
    }
    cQ[jobId].proc = proc
  }

  /* remove job from c queue and kill proc */
  static removeC (jobId) {
    const proc = cQ[jobId].proc
    if (proc instanceof ChildProcess) { proc.kill('SIGHUP') }
    delete cQ[jobId]
  }

  /* remove job from job queue */
  static remove (clientId, jobId) {
    jobId = jobId || JobManager.getJobId(clientId)
    JobManager.removeC(jobId)
    kue.Job.get(jobId, (err, job) => {
      job.inactive()
    })
  }

  static getJobId (clientId) {
    for (const jobId in cQ) {
      if (cQ[jobId].clientId === clientId) {
        return jobId
      } else {
        return null
      }
    }
  }
}
