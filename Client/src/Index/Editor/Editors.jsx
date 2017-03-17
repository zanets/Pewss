import React, {PropTypes} from 'react';
import Editor from './Editor.jsx';

const propTypes = {
	username: PropTypes.string.isRequired
};

/* TODO: add mutiple file edit */
export default class Editors extends React.Component {

	constructor (props) {
		super(props);
		this.state = props;
	}

	render () {
		return (
			<Editor
				username={this.state.username}
				source_list={this.state.source_list}/>
		);
	}
}

Editors.propTypes = propTypes;
