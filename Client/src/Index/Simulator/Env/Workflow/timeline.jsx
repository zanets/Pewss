import vis from 'vis';

const defaultOpts = {
	stack:false,
	clickToUse:false,
	align:'centor',
	max:'',
	min:'',
	timeAxis: {
		scale: 'year',
		step: 10
	},
	showCurrentTime:false,
	showMajorLabels:false,
	showMinorLabels:false,
	width:'100%'
};

export default class timeline {
	constructor(dom) {
		this.currentTime = new Date('2016-01-01T00:00:00');
		this.instance = new vis.Timeline(dom);
		this.opts = defaultOpts;
		this.datum = [];
		this.groups = [];
	}

	render(raw) {
		this.clear();
		this.parse(raw);
		this.instance.setOptions(this.opts);
		this.instance.setGroups(this.groups);
		this.instance.setItems(this.renderTimeBar(this.datum));
		this.bindEvt();
	}

	destroy() {
		this.clear();
		this.instance.setItems(this.datum);
		this.instance.setGroups(this.groups);
	}

	parse(raw) {
		const tasks = raw.task_list;
		let maxFinishTime = tasks[0].finish_time;

		for(const task of tasks){
			const data = {
				content: `${task.order_number}`, 
				title: `start : ${task.start_time}\ncp : ${task.finish_time-task.start_time}\nend : ${task.finish_time}`,
				group: task.resource_id,
				start: new Date(this.currentTime.getTime() + task.start_time * 1000),
				start_time_sec: task.start_time,
				end: new Date(this.currentTime.getTime() + task.finish_time * 1000),
				end_time_sec: task.finish_time,
				child: task.children,
				parent: task.parent,
				id:task.order_number,
				type: 'range'
			};
			this.addGroup(data.group);
			this.datum.push(data);
			maxFinishTime = (maxFinishTime < task.finish_time) ? task.finish_time : maxFinishTime;
		}
		this.addGroup('Time');
		const maxTime = new Date(this.currentTime.getTime() + maxFinishTime * 1000 + 20 * 1000);
		// const maxTime = new Date(this.currentTime.getTime() + 1000 * 1500);
		this.opts.min = this.currentTime;
		this.opts.max = maxTime;
	}

	addGroup(newGroup) {
		for(const group of this.groups)
			if(group.id === newGroup) return;

		this.groups.push({
			id: newGroup,
			content: newGroup
		});
	}

	clear() {
		this.datum = [];
		this.groups = [];
	}

	bindEvt() {
		this.instance.on('select', evt => {
			const id = evt.items[0];
			if(id === undefined) 
				return;
			
			let willSelected = [id];
	
			const _groupChild = selid => {
				const selectedData = this.datum.find( d => d.id === selid );
				if(!('child' in selectedData))
					return;
				willSelected.push('time-' + selectedData.start_time_sec);
				willSelected.push('time-' + selectedData.end_time_sec);
				selectedData.child.every( d => {
					const id = d.task_id;
					if(!willSelected.includes(id)){
						willSelected.push(id);
						_groupChild(id);
					}
					return true;
				});
			};
			const _groupParent = selid => {
				const selectedData = this.datum.find( d => d.id === selid );
				if(!('parent' in selectedData))
					return;
				willSelected.push('time-' + selectedData.start_time_sec);
				willSelected.push('time-' + selectedData.end_time_sec);
				selectedData.parent.every( d => {
					const id = d.task_id;
					if(!willSelected.includes(id)){
						willSelected.push(id);
						_groupParent(id);
					}
					return true;
				});
			};
			_groupChild(id);
			_groupParent(id);
			this.instance.setSelection(willSelected);
		});
	}

	stepRender(stepRange) {
		let datum = [];
		stepRange.forEach(stepId => {
			const data = this.datum.find(d => d.id === stepId);
			datum.push(data);
		});
		datum = this.renderTimeBar(datum);
		this.instance.setItems(datum);
		this.instance.redraw();
	}
	

	renderTimeBar(datum){
		let times = [];

		for(const data of datum){
			if(!times.includes(data.start_time_sec)){
				times.push(data.start_time_sec); 
			}
			if(!times.includes(data.end_time_sec)){
				times.push(data.end_time_sec);
			}
		}
		
		for (var i=0; i<2000; i=i+100){
			let time = i;

			const data = {
				content: `${time}`, 
				group: 'Time',
				start: new Date(this.currentTime.getTime() + time * 1000),
				type: 'point',
				id: `time-${time}`
			};
	
			datum.push(data);
		}

		return datum;
	}
}