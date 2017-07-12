import React, {PropTypes} from 'react'
import update from 'immutability-helper'
import {default as API} from '../../WebAPI.jsx'
import {
  FormFeedback,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Jumbotron
} from 'reactstrap'

const propTypes = {
  username: PropTypes.string.isRequired
}

const STATE = {
  OK: 'success',
  FAIL: 'warning'
}

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword: {
        value: '',
        state: STATE.FAIL,
        msg: ''
      },
      rePassword: {
        value: '',
        state: STATE.FAIL,
        msg: ''
      }
    }
  }

  updateNewPassword (evt) {
    const input = evt.target.value
    let newState = {
      value: input,
      state: '',
      msg: ''
    }
    if (input.length <= 5 || input.length > 15) {
      newState.state = STATE.FAIL
      newState.msg = 'Password length must be longer than 5 and shorter than 15'
    } else {
      newState.state = STATE.OK
      newState.msg = ''
    }
    newState = update(this.state.newPassword, {$set: newState})
    this.setState({newPassword: newState})
    this.verifyRePassword(input)
  }

  verifyRePassword (input) {
    if (input === this.state.rePassword.value) {
      this.setState({
        rePassword: update(this.state.rePassword, {
          $set: {
            state: STATE.OK,
            msg: ''
          }
        })
      })
    } else {
      this.setState({
        rePassword: update(this.state.rePassword, {
          $set: {
            state: STATE.FAIL,
            msg: 'Not match new password'
          }
        })
      })
    }
  }

  updateRePassword (evt) {
    const input = evt.target.value
    let newState = {
      value: input,
      state: '',
      msg: ''
    }
    if (input !== this.state.newPassword.value) {
      newState.state = STATE.FAIL
      newState.msg = 'Not match new password'
    } else {
      newState.state = STATE.OK
      newState.msg = ''
    }
    newState = update(this.state.rePassword, {$set: newState})
    this.setState({rePassword: newState})
  }

  submit () {
    if (this.state.newPassword.state !== STATE.OK ||
        this.state.rePassword.state !== STATE.OK) {
      return
    }

    API.updatePassword({
      name: this.props.username,
      password: this.state.newPassword.value
    }, res => {
      API.logout()
    }, res => {
      console.log('error on server')
    }, res => {

    })
  }

  render () {
    return (
      <Jumbotron fluid style={{width: '50%', marginLeft: '18%'}}>
        <div className='row'>
          <i className='fa fa-user-circle-o fa-5x' />
          <h2 className='display-3' style={{marginLeft: '20px'}}>
            {this.props.username}
          </h2>
        </div>
        <Form>
          <FormGroup color={this.state.newPassword.state}>
            {'New Password '}<Input onChange={this.updateNewPassword.bind(this)} state={this.state.newPassword.state} value={this.state.newPassword.value} type='password' />
            <FormFeedback>{this.state.newPassword.msg}</FormFeedback>
          </FormGroup>
          <FormGroup color={this.state.rePassword.state}>
            {'Re-Type Password '}<Input onChange={this.updateRePassword.bind(this)} state={this.state.rePassword.state} value={this.state.rePassword.value} type='password' />
            <FormFeedback>{this.state.rePassword.msg}</FormFeedback>
          </FormGroup>
        </Form>
        <div className={'row'}>
          <Button color='secondary' onClick={this.submit.bind(this)}>
            {'Submit'}
          </Button>
          <Label>{'Re-login with new password after submit.'}</Label>
        </div>
      </Jumbotron>
    )
  }
}

Profile.propTypes = propTypes
