import React, {PropTypes} from 'react';
import uuid from 'node-uuid';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	FormGroup,
	Label,
	Input,
	Col
} from 'reactstrap';

const propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired
};

export default class ModalNewFile extends React.Component{
	constructor (props) {
		super(props);
	}

	create(){

	}

	render(){
		return(
			<Modal isOpen={this.props.isOpen} toggle={()=>{this.props.toggle();}}>
				<ModalHeader>
					{'Save as'}
				</ModalHeader>
				<ModalBody>
					<FormGroup row>
						<Label sm={3}>{'Name'}</Label>
						<Col sm={9}>
							<Input type='text' ref="_name"/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label sm={3}>{'Category'}</Label>
						<Col sm={9}>
							<Input type='select' ref='_category'>
								<option key={uuid.v4()} value='generater'>{'Generater'}</option>
								<option key={uuid.v4()} value='scheduler'>{'Scheduler'}</option>
								<option key={uuid.v4()} value='simulator'>{'Simulator'}</option>
								<option key={uuid.v4()} value='platform'>{'Platform'}</option>
							</Input>
						</Col>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<div>
						<Button color='danger' onClick={()=>{
							this.props.toggle(false);
						}}>
							<span className="fa fa-close"/>
						</Button>
						<Button color='primary' onClick={()=>{
							this.props.toggle(false);
						}}>
							<span className="fa fa-check"/>
						</Button>
					</div>
				</ModalFooter>
			</Modal>
		);
	}
}

ModalNewFile.propTypes = propTypes;