import React, {PropTypes} from 'react'
import {
  Modal,
  ModalBody,
  Label,
  Col,
  Form,
  Input,
  FormGroup,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import update from 'immutability-helper'
import Storage from '../../../../Storage.jsx'
const propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

export default class ModalSettings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      randomSeed: 1,
      numberOfExperiments: 3,
      communicationToComputationRatio: 1,
      numberOfResource: 3,
      rankingMethod: 'BottomAmountRank',
      groupingMethod: 'NewPCHGrouping',
      numberOfWorkflow: 1,
      minComputationTime: 20,
      maxComputationTime: 100,
      maxInterArrivalTime: 1,
      numberOfForkJoin: 1,
      numberOfBranch: 3,
      nodesForEachBranch: 3,
      numberOfLevel: 2,
      numberOfNodesPerLevel: 2,
      fitnessWeight: 1,
      EFTWeight: 2,
      remainingTimeWeight: 3,
      visualization: [0, 0, 0]
    }
    const oldData = Storage.getTaskSettings(this.props.id)
    this.state = oldData ? JSON.parse(oldData) : this.state
  }

  setSettings (meta) {
    const n = update(this.state, meta)
    this.setState(n)
    Storage.setTaskSettings(this.props.id, JSON.stringify(this.state))
  }

  getSettings () {
    return this.state
  }

  render () {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label sm={12} className='mdlabel'>General</Label>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label sm={6}>Random Seed</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.randomSeed} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10000) return
                  this.setSettings({randomSeed: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 10000'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Experiments</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfExperiments} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 100000) return
                  this.setSettings({numberOfExperiments: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 10000'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>CCR</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.communicationToComputationRatio} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10) return
                  this.setSettings({communicationToComputationRatio: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 10'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Workflow per experiment</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfWorkflow} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10000) return
                  this.setSettings({numberOfWorkflow: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 100'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            {/*
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
            */}
            <FormGroup row>
              <Label sm={6}>Resource</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfResource} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 100) return
                  this.setSettings({numberOfResource: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 100'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4}>Visualization</Label>
              <Col sm={8}><InputGroup>
                <Input type='number' step='1' value={this.state.visualization[0]} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= -1 || ivalue > this.state.numberOfExperiments) return
                  this.setSettings({visualization: {0: {$set: ivalue}}})
                }} />
                <Input type='number' step='1' value={this.state.visualization[1]} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= -1 || ivalue > this.state.numberOfExperiments) return
                  this.setSettings({visualization: {1: {$set: ivalue}}})
                }} />
                <Input type='number' step='1' value={this.state.visualization[2]} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= -1 || ivalue > this.state.numberOfExperiments) return
                  this.setSettings({visualization: {2: {$set: ivalue}}})
                }} />
                <InputGroupAddon>{`0~${this.state.numberOfExperiments}`}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={12} className='mdlabel'>DAG Generator</Label>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label sm={6}>Minimum Computation Time</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.minComputationTime} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 300 || ivalue >= this.state.maxComputationTime) return
                  this.setSettings({minComputationTime: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 300'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Maximum Computation Time</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.maxComputationTime} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 500 || ivalue <= this.state.minComputationTime) return
                  this.setSettings({maxComputationTime: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 500'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={12} className='mdlabel'>Fork-Join DAG</Label>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label sm={6}>Fork-Join</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfForkJoin} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10) return
                  this.setSettings({numberOfForkJoin: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 2'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Branch</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfBranch} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10) return
                  this.setSettings({numberOfBranch: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 5'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Nodes per branch</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.nodesForEachBranch} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 0 || ivalue > 10) return
                  this.setSettings({nodesForEachBranch: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'1 ~ 10'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={12} className='mdlabel'>General DAG</Label>
            </FormGroup>
            <hr />
            <FormGroup row>
              <Label sm={6}>Level</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfLevel} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 1 || ivalue > 10) return
                  this.setSettings({numberOfLevel: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'2 ~ 10'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Nodes per level</Label>
              <Col sm={6}><InputGroup>
                <Input type='number' step='1' value={this.state.numberOfNodesPerLevel} onChange={proxy => {
                  const ivalue = Number(proxy.target.value)
                  if (ivalue <= 1 || ivalue > 5) return
                  this.setSettings({numberOfNodesPerLevel: {$set: ivalue}})
                }} />
                <InputGroupAddon>{'2 ~ 5'}</InputGroupAddon>
              </InputGroup></Col>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    )
  }
}

ModalSettings.propTypes = propTypes
