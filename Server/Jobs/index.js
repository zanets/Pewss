import CompJob from './CompJob.js'
import ModUserJob from './ModUserJob.js'
import ReadJob from './ReadJob.js'
import SimJob from './SimJob.js'
import StoreJob from './StoreJob.js'
import JobManager from './JobManager.js'

module.exports = {
  CompJob,
  ModUserJob,
  ReadJob,
  SimJob,
  StoreJob,
  JobManager: new JobManager()
}
