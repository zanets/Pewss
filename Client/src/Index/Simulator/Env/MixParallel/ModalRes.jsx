import React, {PropTypes} from 'react'
import uuid from 'node-uuid'
import Status from '../../Status.jsx'
import Visualizer from './Visualizer.jsx'

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

  componentWillReceiveProps (nextProps) {
    this.raw = nextProps.res

    this.setState({
      isOpen: nextProps.isOpen,
      resStatus: nextProps.resStatus
    })
  }

  switch (tab) {
    this.setState({active: tab})
  }

  getTabs () {
    let cmps = []

    cmps.push(
      <NavItem key={uuid.v4()}>
        <NavLink
          className={(this.state.active === 1) ? 'active' : ''}
          onClick={this.switch.bind(this, 1)}>
          # {1}
        </NavLink>
      </NavItem>
    )

    return cmps
  }

  getTabcontents () {
    let cmps = []
    cmps.push(
      <TabPane key={uuid.v4()} tabId={1}>
        <div style={{'display': 'grid'}}>
          <Visualizer />
        </div>
      </TabPane>
    )

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
