import React, {PropTypes} from 'react'
import uuid from 'node-uuid'
import Status from '../../Status.jsx'
import RDag from './RDag.jsx'
import RTimeline from './RTimeline.jsx'
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalBody
} from 'reactstrap'

const propTypes = {
  res: PropTypes.string,
  resStatus: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}

const defaultProps = {
  resStatus: Status.WAIT,
  res: ''
}

export default class ModalRes extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      resStatus: Status.WAIT,
      active: '0',
      isOpen: false
    }
  }

  filter (raw) {
    const f_start = '<WF-DBG-START>'
    const f_end = '<WF-DBG-FINISH>'

    /*
     * dbgs contains json string for visualization.
     * raw contains standard output.
     * */
    let p_start = 0, dbgs = []

    while ((p_start = raw.indexOf(f_start)) != -1) {
      const p_end = raw.indexOf(f_end)
      dbgs.push(raw.slice(p_start + f_start.length, p_end))
      raw = raw.slice(0, p_start) + raw.slice(p_end + f_end.length)
    }

    return {
      dbgs,
      raw
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.resStatus.code === Status.FIN_OK.code) {
      const filted = this.filter(nextProps.res)
      this.dbgs = filted.dbgs
      this.raw = filted.raw
    } else {
      this.dbgs = []
      this.raw = nextProps.res
    }

    this.setState({
      isOpen: nextProps.isOpen,
      resStatus: nextProps.resStatus
    })
  }

  switch (tab) {
    this.setState({active: tab})
  }

  getTabs () {
    if (this.state.resStatus.code !== Status.FIN_OK.code || this.dbgs === null) { return }

    let cmps = []
    this.dbgs.forEach((dbg, index) => {
      const tab_id = index + 1
      cmps.push(
        <NavItem key={uuid.v4()}>
          <NavLink
            className={(this.state.active === tab_id) ? 'active' : ''}
            onClick={this.switch.bind(this, tab_id)}>
            # {tab_id}
          </NavLink>
        </NavItem>
      )
    })
    return cmps
  }

  getTabcontents () {
    if (this.state.resStatus.code !== Status.FIN_OK.code) { return }

    let cmps = []

    this.dbgs.forEach((dbg, index) => {
      const tab_id = index + 1
      const o_dbg = JSON.parse(dbg)
      cmps.push(
        <TabPane key={uuid.v4()} tabId={tab_id}>
          <div style={{'display': 'grid'}}>
            <RDag data={o_dbg} />
            <RTimeline data={o_dbg} />
          </div>
        </TabPane>
      )
    })
    return cmps
  }

  /* dirty: for compare */
  getDbgBody () {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={this.state.active === '0' ? 'active' : ''}
              onClick={this.switch.bind(this, '0')}>
              Output
            </NavLink>
          </NavItem>
          {this.getTabs()}
        </Nav>
        <TabContent activeTab={this.state.active}>
          <TabPane tabId='0'>
            <pre>
              {this.raw}
            </pre>
          </TabPane>
          {this.getTabcontents()}
        </TabContent>
      </div>
    )
  }

  render () {
    return (
      <Modal size='lg' isOpen={this.state.isOpen} toggle={this.props.toggle}>
        <ModalBody>
          {this.getDbgBody()}
        </ModalBody>
      </Modal>
    )
  }
}

ModalRes.defaultProps = defaultProps

ModalRes.propTypes = propTypes
