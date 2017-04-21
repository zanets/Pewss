import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import uuid from 'node-uuid';
import {
	Input,
	Button,
	FormGroup,
	Label,
	Table,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Jumbotron,
	Col
} from 'reactstrap';


const propTypes = 
{
	username: PropTypes.string.isRequired
};


export default class Profile extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div className="card card-default">
				<div className="card-block">
					<Jumbotron>
						<i className="fa fa-user-circle-o fa-5x"/>
						{`  ${this.props.username}`}
							
						{"New Password "}<Input/>
					</Jumbotron>
				</div>
			</div>
		)
	}
}

Profile.propTypes = propTypes;
