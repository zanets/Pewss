import React, {PropTypes} from 'react'
import Status from './Status.jsx'
import API from '../../WebAPI.jsx'
import {
  Button
} from 'reactstrap'

import Workflow from './Env/Workflow/Index.jsx'
import MixParallel from './Env/MixParallel/Index.jsx'

const Tasks = {
  Workflow,
  MixParallel
}

const propTypes = {
  id: PropTypes.string.isRequired,
  env: PropTypes.object.isRequired,
  generator: PropTypes.object.isRequired,
  scheduler: PropTypes.object.isRequired,
  simulator: PropTypes.object.isRequired,
  platform: PropTypes.object.isRequired,
  del: PropTypes.func.isRequired
}

export default class Task extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSelected: false,
      res: null,
      resStatus: Status.WAIT,
      showRes: false,
      showSettings: false
    }
  }

  toggleIsSelected () {
    this.setState({isSelected: !this.state.isSelected})
  }

  isSelected () {
    return this.state.isSelected
  }

  start () {
    if (this.state.resStatus === Status.RUNNING) { return }

    this.setState({resStatus: Status.RUNNING})
    // TODO: filer stderr and stdout
    API.simulate(
      this.props.id,
      this.props.env.Name,
      this.props.generator,
      this.props.scheduler,
      this.props.simulator,
      this.props.platform,
      this.refs.modal_settings.getSettings()
    , (res) => {
      // console.log(res)
      this.setState({
        resStatus: Status.FIN_OK,
        res: res.msg
      })
    }, (res) => {
      // console.log(res)
      this.setState({
        resStatus: Status.FIN_ERR,
        res: res.responseText
      })
    })
  }

  toggleRes (isOpen) {
    isOpen = isOpen || !this.state.showRes
    this.setState({showRes: isOpen})
  }

  toggleSettings (isOpen) {
    isOpen = isOpen || !this.state.showSettings
    this.setState({showSettings: isOpen})
  }

  clkSettings () {
    this.toggleSettings(true)
  }

  clkDel () {
    this.props.del(this.props.id)
  }

  clkStart () {
    this.start()
  }

  clkRes () {
    this.toggleRes(true)
  }

  /* get data when its selected */
  getSelectedData () {
    return this.refs.modal_res.getDbgBody()
  }

  render () {
    const status = this.state.resStatus
    const TaskComp = Tasks[this.props.env.Name]
    return (
      <tr>
        <td>
          <Button onClick={this.toggleIsSelected.bind(this)}>
            <input type='checkbox' checked={this.state.isSelected} />
          </Button>
        </td>
        <td>
          {`${this.props.generator.Name} @ ${this.props.generator.Owner}`}
        </td>
        <td>
          {`${this.props.platform.Name} @ ${this.props.platform.Owner}`}
        </td>
        <td>
          {`${this.props.simulator.Name} @ ${this.props.simulator.Owner}`}
        </td>
        <td>
          {`${this.props.scheduler.Name} @ ${this.props.scheduler.Owner}`}
        </td>
        <td>
          <Button size='sm' color='warning'
            disabled={status === Status.RUNNING}
            onClick={this.clkSettings.bind(this)}>
            <span className='fa fa-cog fa-1x' />
          </Button>
          {' '}
          <Button color='primary' size='sm'
            disabled={status === Status.RUNNING}
            onClick={this.clkStart.bind(this)}>
            <span className='fa fa-play fa-1x' />
          </Button>
          {' '}
          <Button size='sm' color='danger'
            disabled={status === Status.RUNNING}
            onClick={this.clkDel.bind(this)}>
            <span className='fa fa-trash fa-1x' />
          </Button>
        </td>
        <td>
          <Button size='sm' color={status.color}
            disabled={
              status !== Status.FIN_OK &&
              status !== Status.FIN_ERR
            }
            onClick={this.clkRes.bind(this)}>
            <span className={status.icon} />
          </Button>
        </td>
        <td>
          <TaskComp.ModalRes
            resStatus={this.state.resStatus}
            res={this.state.res}
            isOpen={this.state.showRes}
            toggle={this.toggleRes.bind(this)}
            ref='modal_res' />
          <TaskComp.ModalSettings
            id={this.props.id}
            isOpen={this.state.showSettings}
            toggle={this.toggleSettings.bind(this)}
            ref='modal_settings' />
        </td>
      </tr>
    )
  }
}

Task.propTypes = propTypes
