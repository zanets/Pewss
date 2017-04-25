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

export default class timeline 
{
	constructor(dom) 
	{
		this.currentTime = new Date('2016-01-01T00:00:00');
		this.instance = new vis.Timeline(dom);
		this.opts = defaultOpts;
		this.datum = [];
		this.groups = [];
		this.maxTime = 0;
	}

	render(raw) 
	{
		this.clear();
		this.parse(raw);
		this.instance.setOptions(this.opts);
		this.instance.setGroups(this.groups);
		this.instance.setItems(this.renderTimeBar(this.datum));
		this.bindEvt();
	}

	destroy() 
	{
		this.clear();
		this.instance.setItems(this.datum);
		this.instance.setGroups(this.groups);
	}

	parse(raw) 
	{
		for(const wf of raw)
		{
			for(const task of wf.tasks)
			{
				const data = {
					content:`${wf.id}-${task.id}`,
					title: `${wf.id}-${task.id} Start: ${task.start} CP: ${task.cp} End: ${task.finish}`,
					group: task.res,
					start: new Date(this.currentTime.getTime() + task.start * 1000),
					start_time_sec: task.start,
					end: new Date(this.currentTime.getTime() + task.finish * 1000),
					end_time_sec: task.finish,
					child: task.children,
					id:`${wf.id}-${task.id}`,
					type: 'range'
				};

 				this.maxTime = this.maxTime > task.finish 
							? this.maxTime
							: task.finish;

				this.addGroup(data.group);
				this.datum.push(data);
			}
		}

		this.opts.min = this.currentTime;
		this.opts.max = new Date(this.currentTime.getTime() + this.maxTime * 1000 + 20 * 1000);
	}

	addGroup(newGroup) 
	{
		for(const group of this.groups)
			if(group.id === newGroup) return;

		this.groups.push({
			id: newGroup,
			content: newGroup
		});
	}

	clear() 
	{
		this.datum = [];
		this.groups = [];
	}

	bindEvt() 
	{
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

	stepRender(stepRange) 
	{
		let datum = [];
		stepRange.forEach(stepId => {
			const data = this.datum.find(d => d.id === stepId);
			datum.push(data);
		});
		datum = this.renderTimeBar(datum);
		this.instance.setItems(datum);
		this.instance.redraw();
	}


	renderTimeBar(datum)
	{
		let times = [];

		for(const data of datum)
		{
			if(!times.includes(data.start_time_sec))
			{
				times.push(data.start_time_sec);
			}

			if(!times.includes(data.end_time_sec))
			{
				times.push(data.end_time_sec);
			}
		}

		for (var i=0; i<this.maxTime; i=i+100)
		{
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
