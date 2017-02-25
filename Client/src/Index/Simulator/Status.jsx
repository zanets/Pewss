const Status = {
	WAIT: {
		code: 0,
		icon: 'fa fa-stop fa-1x',
		color: 'secondary'
	},
	RUNNING: {
		code: 1,
		icon: 'fa fa-spinner fa-pulse fa-1x fa-fw',
		color: 'warning'
	},
	FIN_OK: {
		code: 2,
		icon: 'fa fa-check fa-1x',
		color: 'success'
	},
	FIN_ERR: {
		code: 3,
		icon: 'fa fa-remove fa-1x',
		color: 'danger'
	}
};

export default Status;