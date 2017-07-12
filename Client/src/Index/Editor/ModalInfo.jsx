import React, {PropTypes} from 'react'
import {
  Alert,
  Modal,
  ModalBody,
  Button
} from 'reactstrap'

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  showDetail: PropTypes.bool.isRequired,
  detailmsg: PropTypes.string.isRequired
}

export default class ModalInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpenDetail: false
    }
  }

  toggleDetail (isOpen) {
    isOpen = isOpen || !this.state.isOpenDetail
    this.setState({isOpenDetail: isOpen})
  }

  getDetailBtn () {
    return this.props.showDetail
      ? <Button color='link' onClick={this.toggleDetail.bind(this, true)}>
        {'Click for detail.'}
      </Button>
      : ''
  }

  render () {
    return (
      <div>
        <Alert color={this.props.color} isOpen={this.props.isOpen} toggle={() => { this.props.toggle(false) }}>
          {this.props.msg} {this.getDetailBtn()}
        </Alert>
        <Modal size='lg' isOpen={this.state.isOpenDetail} toggle={this.toggleDetail.bind(this)}>
          <ModalBody>
            <pre>{this.props.detailmsg}</pre>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

ModalInfo.propTypes = propTypes
