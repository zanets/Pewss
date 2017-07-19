import React, {PropTypes} from 'react'
import { default as WorkflowTask } from './Env/Workflow/Task.jsx'
import ReactDOM from 'react-dom'
import uuid from 'node-uuid'
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
} from 'reactstrap'

const propTypes = {
  username: PropTypes.string.isRequired,
  class_list: PropTypes.array.isRequired,
  envs: PropTypes.array.isRequired
}

export default class Simulator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      envs: props.envs,
      class_list: this.fixClassName(props.class_list),
      isOpenNewTask: false,
      isOpenCompare: false
    }
    const oldTasks = window.localStorage.getItem('Tasks')
    this.state.tasks = oldTasks ? JSON.parse(oldTasks) : []

    this.compare = {
      body: '',
      header: ''
    }
  }

  fixClassName (raw) {
    let fixed = {
      generator: [],
      scheduler: [],
      platform: [],
      simulator: []
    }

    for (const files of raw) { fixed[files.Cate].push(files) }

    return fixed
  }

  toggleNewTaskModal (isOpen) {
    isOpen = isOpen || !this.state.isOpenNewTask
    this.setState({
      isOpenNewTask: isOpen
    })
  }

  newTask () {
    let tasks = this.state.tasks

    tasks.push({
      id: uuid.v4(),
      env: JSON.parse(ReactDOM.findDOMNode(this.refs.ienv).value),
      generator: JSON.parse(ReactDOM.findDOMNode(this.refs.igenerator).value),
      scheduler: JSON.parse(ReactDOM.findDOMNode(this.refs.ischeduler).value),
      simulator: JSON.parse(ReactDOM.findDOMNode(this.refs.isimulator).value),
      platform: JSON.parse(ReactDOM.findDOMNode(this.refs.iplatform).value)
    })

    this.setState({tasks: tasks})
    window.localStorage.setItem('Tasks', JSON.stringify(tasks))
    this.toggleNewTaskModal(false)
  }

  delTask (id) {
    const newTasks = this.state.tasks.filter(task => id !== task.id)

    this.setState({tasks: newTasks})
  }

  getTaskComponent () {
    return this.state.tasks.map(ele =>
      <WorkflowTask key={ele.id} ref={ele.id} {...ele} del={this.delTask.bind(this)} />
    )
  }

  getOptionComponent (arr) {
    return arr.map(ele =>
      <option key={uuid.v4()} value={JSON.stringify(ele)}>
        {`${ele.Name} @ ${ele.Owner}`}
      </option>
    )
  }

  toggleCompare (isOpen) {
    isOpen = isOpen || !this.state.isOpenCompare
    this.setState({
      isOpenCompare: isOpen
    })

    this.compare.header = 'Compare '
    let targets = []
    for (const task of this.state.tasks) {
      if (this.refs[task.id].isSelected() === true) { targets.push(task) }
    }

    let targetsComp = []
    const size = 100 / targets.length - 5
    for (const task of targets) {
      this.compare.header += `##${task.scheduler.Name} @ ${task.scheduler.Owner} `
      targetsComp.push(
        <div style={{width: `${size}%`, marginLeft: '1%'}}>
          {this.refs[task.id].getSlectedData()}
        </div>
      )
    }

    this.compare.body = targetsComp
  }

  render () {
    const nullTaskHint = (this.state.tasks.length === 0)
      ? <Jumbotron>
        <h2>No simulation task.</h2>
        <h5>Press <span className='fa fa-plus fa-1x' /> to create.</h5>
      </Jumbotron>
      : ''

    return (
      <div className='card card-default'>
        <div className='card-block'>

          {/* ---------------- Btn bar ------------- */}
          <Button color='warning' onClick={this.toggleNewTaskModal.bind(this, true)}>
            <span className='fa fa-plus-circle fa-3x' />
          </Button>
          <Button color='info' onClick={this.toggleCompare.bind(this, true)}>
            <span className='fa fa-balance-scale fa-3x' />
          </Button>

          <Input type='select' ref='ienv'>
            {this.getOptionComponent(this.state.envs)}
          </Input>

          {/* ---------------- Compare Modal ------------- */}
          <Modal style={{maxWidth: '90%'}} isOpen={this.state.isOpenCompare} toggle={this.toggleCompare.bind(this)}>
            <ModalHeader>
              {this.compare.header}
            </ModalHeader>
            <ModalBody>
              <div className={'row'}>
                {this.compare.body}
              </div>
            </ModalBody>
          </Modal>

          {/* ---------------- New Task Modal ------------- */}
          <Modal isOpen={this.state.isOpenNewTask} toggle={this.toggleNewTaskModal.bind(this)}>
            <ModalHeader>
              {'New Simulation Task'}
            </ModalHeader>

            <ModalBody>

              <FormGroup row>
                <Label sm={3}>{'Generator'}</Label>
                <Col sm={9}>
                  <Input type='select' ref='igenerator'>
                    {this.getOptionComponent(this.state.class_list.generator)}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>{'Platform'}</Label>
                <Col sm={9}>
                  <Input type='select' ref='iplatform'>
                    {this.getOptionComponent(this.state.class_list.platform)}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>{'Simulator'}</Label>
                <Col sm={9}>
                  <Input ref='isimulator' type='select'>
                    {this.getOptionComponent(this.state.class_list.simulator)}
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label sm={3}>{'Scheduler'}</Label>
                <Col sm={9}>
                  <Input ref='ischeduler' type='select'>
                    {this.getOptionComponent(this.state.class_list.scheduler)}
                  </Input>
                </Col>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <Button color='danger' onClick={this.toggleNewTaskModal.bind(this, false)}>
                <span className='fa fa-close' />
              </Button>
              <Button color='primary' onClick={this.newTask.bind(this)}>
                <span className='fa fa-check' />
              </Button>
            </ModalFooter>

          </Modal>

          {/* ---------------- Task List ------------- */}
          <Table hover responsive style={{marginTop: '.7rem'}}>
            <thead>
              <tr>
                <th />
                <th>{'Generator'}</th>
                <th>{'Platform'}</th>
                <th>{'Simulator'}</th>
                <th>{'Scheduler'}</th>
                <th>{'Operate'}</th>
                <th>{'Status'}</th>
                <th style={{display: 'none'}} />
              </tr>
            </thead>
            <tbody>
              {this.getTaskComponent()}
            </tbody>
          </Table>
          {nullTaskHint}
        </div>
      </div>
    )
  }
}

Simulator.propTypes = propTypes
