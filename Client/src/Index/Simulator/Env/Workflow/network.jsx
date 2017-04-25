const defaultOpts = {
	layout:{
		hierarchical:{
			direction: 'UD',
			blockShifting: true,
			edgeMinimization: true
		}
	},
	physics:{
		enabled:false
	},
	interaction: {
		tooltipDelay: 0
	}
};

export default class network {
	constructor(dom) {
		this.dom = dom;
		this.opts = defaultOpts;
		this.nodes = [];
		this.edges = [];
	}

	render(raw) {
		this.clear();
		this.parse(raw);
		this.destroy();
		this.instance = new vis.Network(
			this.dom, {
				nodes: this.nodes,
				edges: this.edges
			}, this.opts);
	}

	clear() {
		this.nodes = [];
		this.edges = [];
	}

	parse(raw) {
		if(raw === null)
			return;
		for(const wf of raw)
		{
			for(const task of wf.tasks)
			{
				this.nodes.push({
					id:`${wf.id}-${task.id}`,
					title: task.cp,
					label:`${wf.id}-${task.id}`,
					level: task.level,
				});

				for(const link of task.children)
				{
					this.edges.push({
						from: `${wf.id}-${task.id}`,
						to: `${wf.id}-${link.id}`,
						label: link.w
					});
				}
			}
		}
	}

	destroy() {
		if(this.instance)
			this.instance.destroy();
	}
}
