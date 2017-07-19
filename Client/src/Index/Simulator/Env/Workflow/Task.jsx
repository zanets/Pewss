import React, {PropTypes} from 'react'
import Status from '../../Status.jsx'
import ModalRes from './ModalRes.jsx'
import ModalSettings from './ModalSettings.jsx'
import update from 'immutability-helper'
import {default as API} from '../../../../WebAPI.jsx'
import {
  Button
} from 'reactstrap'

const propTypes = {
  id: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
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
      showSettings: false,
      settings: {
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
    }

    const oldData = window.localStorage.getItem(`Settings-${this.props.id}`)
    this.state.settings = oldData ? JSON.parse(oldData) : this.state.settings
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
      this.state.settings
    , (res) => {
      console.log(res)
      this.setState({
        resStatus: Status.FIN_OK,
        res: this.filter(res.msg, Status.FIN_OK)
      })
    }, (res) => {
      console.log(res)
      this.setState({
        resStatus: Status.FIN_ERR,
        res: {errcode: Status.FIN_ERR.code, dbgs: null, raw: res.responseText }
      })
    })
  }

  filter (raw, status) {
    const f_start = '<WF-DBG-START>'
    const f_end = '<WF-DBG-FINISH>'

    /*
     * dbgs contains json string for visualization.
     * raw contains standard output.
     * */
    let p_start = 0,
      dbgs = []

    while ((p_start = raw.indexOf(f_start)) != -1) {
      const p_end = raw.indexOf(f_end)
      dbgs.push(raw.slice(p_start + f_start.length, p_end))
      raw = raw.slice(0, p_start) + raw.slice(p_end + f_end.length)
    }

    return {
      errcode: status.code,
      dbgs,
      raw
    }
  }

  setSettings (meta) {
    const n = update(this.state.settings, meta)
    this.setState({settings: n})
    window.localStorage.setItem(`Settings-${this.props.id}`, JSON.stringify(this.state.settings))
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
  getSlectedData () {
    return this.refs.modal_res.getDbgBody()
  }

  render () {
    const status = this.state.resStatus
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
          <ModalRes {...this.state.res}
            isOpen={this.state.showRes}
            toggle={this.toggleRes.bind(this)}
            ref='modal_res' />
          <ModalSettings {...this.state.settings}
            isOpen={this.state.showSettings}
            toggle={this.toggleSettings.bind(this)}
            setSettings={this.setSettings.bind(this)} />
        </td>
      </tr>
    )
  }
}

Task.propTypes = propTypes
