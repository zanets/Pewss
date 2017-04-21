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

		for(let task of raw.task_list){
			this.nodes.push({
				id: task.order_number,
				title: task.computation_time,
				level: task.level,
				label: task.order_number
			});

			for(let childTask of task.children){
				this.edges.push({
					from: task.order_number,
					to: childTask.task_id,
					label: childTask.weight
				});
			}
		}
	}

	destroy() {
		if(this.instance)
			this.instance.destroy();
	}
}
