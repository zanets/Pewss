class Storage {
  setUname (uname) {
    window.sessionStorage.setItem('uname', uname)
  }
  getUname () {
    return window.sessionStorage.getItem('uname')
  }
  setTasks (tasks) {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
  }
  getTasks () {
    const str = window.localStorage.getItem('tasks')
    return str ? JSON.parse(str) : null
  }
  setTaskSettings (taskId, settings) {
    window.localStorage.setItem(`Settings-${taskId}`, JSON.stringify(settings))
  }
  getTaskSettings (taskId) {
    const str = window.localStorage.getItem(`Settings-${taskId}`)
    return str ? JSON.parse(str) : null
  }
}

export default new Storage()
