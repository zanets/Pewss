import React from 'react';
import Editor from './Editor.jsx';

/* TODO: add mutiple file edit */
class Editors extends React.Component {

	constructor (props) {
		super(props);
		this.state = props;
	}

	render () {
		return (
			<Editor source_list={this.state.source_list}/>
		);
	}
}

export default Editors;