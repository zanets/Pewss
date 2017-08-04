const defaultOpts = {
  stack: false,
  clickToUse: false,
  align: 'centor',
  max: '',
  min: '',
  timeAxis: {
    scale: 'year',
    step: 10
  },
  showCurrentTime: false,
  showMajorLabels: false,
  showMinorLabels: false,
  width: '100%'
}

export default class Timeline {
  constructor (dom) {
    this.currentTime = new Date('2016-01-01T00:00:00')
    this.instance = new vis.Timeline(dom)
    this.opts = defaultOpts
    this.datum = []
    this.groups = []
    this.maxTime = 0
  }

  render (raw) {
    this.clear()
    this.parseTask(raw)
    this.parseTime(this.datum)
    this.instance.setOptions(this.opts)
    this.instance.setGroups(this.groups)
    this.instance.setItems(this.datum)
    this.bindEvt()
  }

  destroy () {
    this.clear()
    this.instance.setItems(this.datum)
    this.instance.setGroups(this.groups)
  }

  parseTask (raw) {
    for (const wf of raw) {
      for (const task of wf.tasks) {
        const data = {
          content: `${wf.id}-${task.id}`,
          title: `${wf.id}-${task.id} Start: ${task.start} CP: ${task.cp} End: ${task.finish}`,
          group: task.res,
          start: new Date(this.currentTime.getTime() + task.start * 1000),
          start_time_sec: task.start,
          end: new Date(this.currentTime.getTime() + task.finish * 1000),
          end_time_sec: task.finish,
          child: task.children,
          id: `${wf.id}-${task.id}`,
          type: 'range'
        }

        this.maxTime = this.maxTime > task.finish
              ? this.maxTime
              : task.finish

        this.addGroup(data.group)
        this.datum.push(data)
      }
    }

    this.opts.min = this.currentTime
    this.opts.max = new Date(this.currentTime.getTime() + this.maxTime * 1000 + 20 * 1000)
  }

  parseTime (datum)	{
    this.addGroup('Time')
    for (let t = 0; t < this.maxTime; t = t + 100) {
      const tp = {
        content: `${t}`,
        group: 'Time',
        start: new Date(this.currentTime.getTime() + t * 1000),
        type: 'point',
        id: `time-${t}`
      }

      datum.push(tp)
    }
  }

  addGroup (newGroup) {
    for (const group of this.groups) { if (group.id === newGroup) return }

    this.groups.push({
      id: newGroup,
      content: newGroup
    })
  }

  clear () {
    this.datum = []
    this.groups = []
  }

  bindEvt () {
    this.instance.on('select', evt => {
    })
  }
}
