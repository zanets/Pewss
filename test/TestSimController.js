import SimController from './Server/SimController.js'

SimController.compile({
  env: 'workflow',
  name: 'PEFT_MaxMin_MaxMin',
  category: 'scheduler',
  owner: 'darg'
}).then(res => {
  console.log(res)
  SimController.simulate({
    env: 'workflow',
    generator: 'com.use.generator.ForkJoinDAGGenerator',
    scheduler: 'darg.scheduler.PEFT_MaxMin_MaxMin',
    simulator: 'com.use.simulator.StaticWorkflowSimulator',
    platform: 'com.use.resource.platform.WorkflowPlatformHeterogeneous',
    argums: '123'
  }).then(res => {
    console.error(res)
  }).catch(err => {
    console.error('err : ' + err)
  })
}).catch(err => {
  console.error(err)
})
