class Storage {
  setUname(uname){
    sessionStorage.setItem('uname', uname)
  }
  getUname(){
    return sessionStorage.getItem('uname')
  }
  setTasks(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }
  getTasks(){
    const str = localStorage.getItem('tasks')
    return str ? JSON.parse(str) : null
  }
  setTaskSettings(taskId, settings){
    localStorage.setItem(`Settings-${taskId}`, JSON.stringify(settings))
  }
  getTaskSettings(taskId){
    const str = localStorage.getItem(`Settings-${taskId}`)
    return str ? JSON.parse(str) : null
  }
}

export default new Storage()