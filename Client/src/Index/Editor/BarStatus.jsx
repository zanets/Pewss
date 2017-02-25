import React, {PropTypes} from 'react';

import {
	Badge
} from 'reactstrap';

const propTypes = {
	fileEdit: PropTypes.object.isRequired
};

export default class BarStatus extends React.Component{
	constructor (props) {
		super(props);
		this.state = {
			fileEdit: props.fileEdit
		};
	}

	componentWillReceiveProps(props){
		this.setState({
			fileEdit: props.fileEdit
		});
	}

	render(){
		return (
			<h5>
				<Badge pill color="primary">
					{this.state.fileEdit.name}
				</Badge>
				{' '}
				{this.state.fileEdit.isMod ?
					<Badge pill color="warning">Modified</Badge> :
					<Badge pill color="success">No Modify</Badge>
				}
			</h5>
		);
	}
}

BarStatus.propTypes = propTypes;