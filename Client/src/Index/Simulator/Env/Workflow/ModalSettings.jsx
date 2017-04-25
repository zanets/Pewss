import React, {PropTypes} from 'react';
import {
	Button,
	Modal,
	ModalBody,
	Label,
	Col,
	Form,
	Input,
	FormGroup,
	InputGroup,
	InputGroupAddon
} from 'reactstrap';

const propTypes = {
	randomSeed: PropTypes.number.isRequired,
	numberOfExperiments: PropTypes.number.isRequired,
	communicationToComputationRatio: PropTypes.number.isRequired,
	numberOfResource: PropTypes.number.isRequired,
	minComputationTime: PropTypes.number.isRequired,
	maxComputationTime: PropTypes.number.isRequired,
	numberOfForkJoin: PropTypes.number.isRequired,
	numberOfBranch: PropTypes.number.isRequired,
	nodesForEachBranch: PropTypes.number.isRequired,
	numberOfLevel: PropTypes.number.isRequired,
	numberOfNodesPerLevel: PropTypes.number.isRequired,
	visualization: PropTypes.array.isRequired,
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
	setSettings: PropTypes.func.isRequired
};

export default class ModalSettings extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalBody>
					<Form>
						<FormGroup row>
							<Label sm={12} className='mdlabel'>General</Label>
						</FormGroup>
						<hr/>
						<FormGroup row>
							<Label sm={6}>Random Seed</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.randomSeed} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 10000) return;
									this.props.setSettings({randomSeed: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 10000'}</InputGroupAddon>
							</InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Experiments</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfExperiments} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 10000) return;
									this.props.setSettings({numberOfExperiments: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 10000'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>CCR</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.communicationToComputationRatio} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 10) return;
									this.props.setSettings({communicationToComputationRatio: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 10'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Workflow per experiment</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfWorkflow} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 100) return;
									this.props.setSettings({numberOfWorkflow: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 100'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Workflow max inter-arrival time</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.maxInterArrivalTime} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 1000) return;
									this.props.setSettings({maxInterArrivalTime: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 1000'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Resource</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfResource} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 100) return;
									this.props.setSettings({numberOfResource: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 100'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={4}>Visualization</Label>
							<Col sm={8}><InputGroup>
								<Input type="number" step="1" value={this.props.visualization[0]} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= -1 || ivalue > this.props.numberOfExperiments) return;
									this.props.setSettings({visualization: {[0]: {$set: ivalue}}});
								}}/>
								<Input type="number" step="1" value={this.props.visualization[1]} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= -1 || ivalue > this.props.numberOfExperiments) return;
									this.props.setSettings({visualization: {[1]: {$set: ivalue}}});
								}}/>
								<Input type="number" step="1" value={this.props.visualization[2]} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= -1 || ivalue > this.props.numberOfExperiments) return;
									this.props.setSettings({visualization: {[2]: {$set: ivalue}}});
								}}/>
								<InputGroupAddon>{`0~${this.props.numberOfExperiments}`}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={12} className='mdlabel'>DAG Generator</Label>
						</FormGroup>
						<hr/>
						<FormGroup row>
							<Label sm={6}>Minimum Computation Time</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.minComputationTime} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 300 || ivalue >= this.props.maxComputationTime) return;
									this.props.setSettings({minComputationTime: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 300'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Maximum Computation Time</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.maxComputationTime} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 500 || ivalue <= this.props.minComputationTime) return;
									this.props.setSettings({maxComputationTime: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 500'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={12} className='mdlabel'>Fork-Join DAG</Label>
						</FormGroup>
						<hr/>
						<FormGroup row>
							<Label sm={6}>Fork-Join</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfForkJoin} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 2) return;
									this.props.setSettings({numberOfForkJoin: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 2'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Branch</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfBranch} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 5) return;
									this.props.setSettings({numberOfBranch: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 5'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Nodes per branch</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.nodesForEachBranch} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 5) return;
									this.props.setSettings({nodesForEachBranch: {$set: ivalue}});
								}}/>	
								<InputGroupAddon>{'1 ~ 5'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={12} className='mdlabel'>General DAG</Label>
						</FormGroup>
						<hr/>
						<FormGroup row>
							<Label sm={6}>Level</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfLevel} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 2) return;
									this.props.setSettings({numberOfLevel: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 2'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
						<FormGroup row>
							<Label sm={6}>Nodes per level</Label>
							<Col sm={6}><InputGroup>
								<Input type="number" step="1" value={this.props.numberOfNodesPerLevel} onChange={ proxy => {
									const ivalue = Number(proxy.target.value);
									if(ivalue <= 0 || ivalue > 5) return;
									this.props.setSettings({numberOfNodesPerLevel: {$set: ivalue}});
								}}/>
								<InputGroupAddon>{'1 ~ 5'}</InputGroupAddon>
						  </InputGroup></Col>
						</FormGroup>
					</Form>
				</ModalBody>
			</Modal>
		);
	}
}

ModalSettings.propTypes = propTypes;
