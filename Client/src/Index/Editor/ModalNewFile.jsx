import React, {PropTypes} from 'react'
import uuid from 'node-uuid'
import API from '../../WebAPI.jsx'
import Storage from '../../Storage.jsx'
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
} from 'reactstrap'

const propTypes = {
  fileEdit: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  setFileEdit: PropTypes.func.isRequired,
  toggleMainLoader: PropTypes.func.isRequired,
  toggleModalInfo: PropTypes.func.isRequired
}

export default class ModalNewFile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uname: Storage.getUname(),
      Name: '',
      Cate: 'generator'
    }
  }

  create () {
    if (this.state.Name === '') {
      this.props.toggleModalInfo(true, `File name is null`, 'danger', false, '')
      return
    }

    this.props.toggleMainLoader(true)
    API.newFile(
      this.state.Name,
      this.state.Cate,
      this.props.fileEdit.Code,
      this.state.uname
    , (res) => {
      this.props.toggleModalInfo(true, `Save as ${this.state.name} success`, 'success', false, '')
      this.props.setFileEdit({
        Name: {$set: this.state.Name},
        Cate: {$set: this.state.Cate},
        Owner: {$set: this.state.uname},
        isPub: {$set: false},
        isMod: {$set: false},
        isOpen: {$set: true},
        Code: {$set: this.props.fileEdit.Code},
        originCode: {$set: this.props.fileEdit.Code}
      })
    }, (res) => {
      this.props.toggleModalInfo(true, `Save as ${this.state.Name} fail`, 'danger', true, res)
    }, () => {
      this.props.toggleMainLoader(false)
    })
  }

  updateName (e) {
    this.setState({Name: e.target.value})
  }

  updateCategory (e) {
    this.setState({Cate: e.target.value})
  }

  render () {
    return (
      <Modal isOpen={this.props.isOpen} toggle={() => { this.props.toggle() }}>
        <ModalHeader>
          {'Save as'}
        </ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Label sm={3}>{'Name'}</Label>
            <Col sm={9}>
              <Input type='text' onChange={this.updateName.bind(this)} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={3}>{'Category'}</Label>
            <Col sm={9}>
              <Input type='select' onChange={this.updateCategory.bind(this)} value={this.state.Cate}>
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
            <Button color='danger' onClick={() => {
              this.props.toggle(false)
            }}>
              <span className='fa fa-close' />
            </Button>
            <Button color='primary' onClick={() => {
              this.props.toggle(false)
              this.create()
            }}>
              <span className='fa fa-check' />
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

ModalNewFile.propTypes = propTypes
