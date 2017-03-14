import jq from 'jquery';
class WebAPI{

	getClassList(meta, success, fail, always){
		jq.get('/api/uses/class', {
			env: meta.env
		}, success).fail(fail).always(always);
	}

	getSourceList(success, fail, always){
		jq.get('/api/uses/source', success).fail(fail).always(always);
	}

	simulate(meta, success, fail, always){
		jq.post('/api/uses/simulate', {
			env: meta.env,
			generator: meta.generator,
			scheduler: meta.scheduler,
			simulator: meta.simulator,
			platform: meta.platform,
			argums: meta.argums
		}, success).fail(fail).always(always);
	}

	getSourceCode(meta, success, fail, always){
		jq.get('/api/uses/source_content', {
			category: meta.category,
			name: meta.name,
			owner: meta.owner
		}, success).fail(fail).always(always);
	}

	setSourceCode(meta, success, fail, always){
		jq.ajax({
			url: `/api/uses/source_content/${meta.name}`,
			data: {
				name: meta.name,
				category: meta.category,
				content: meta.content,
				owner: meta.owner
			},
			type: 'patch'
		}).done(success).fail(fail).always(always);
	}

	newFile(meta, success, fail, always){
		jq.post(`/api/uses/source_content/${meta.name}`, {
			name: meta.name,
			category: meta.category,
			content: meta.content,
			owner: meta.owner
		}, success).fail(fail).always(always);
	}

	compile(meta, success, fail, always){
		jq.post('/api/uses/compile', {
			env: meta.env,
			name: meta.name,
			category: meta.category,
			owner: meta.owner
		}, success).fail(fail).always(always);
	}

	addPublish(meta, success, fail, always){
		jq.ajax({
			url: `/api/users/public/${meta.name}`,
			data: {
				name: meta.name,
				category: meta.category,
				type: meta.type
			},
			type: 'patch'
		}).done(success).fail(fail).always(always);
	}

	deletePublish(meta, success, fail, always){
		jq.ajax({
			url: `/api/users/public/${meta.name}`,
			data: {
				name: meta.name,
				category: meta.category,
				type: meta.type
			},
			type: 'delete'
		}).done(success).fail(fail).always(always);
	}

}

export default new WebAPI();
