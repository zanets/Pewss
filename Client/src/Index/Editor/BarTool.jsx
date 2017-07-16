import React, {PropTypes} from 'react'
import uuid from 'node-uuid'
import update from 'immutability-helper'
import {default as API} from '../../WebAPI.jsx'
import {
  Button,
  ButtonToolbar,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown
} from 'reactstrap'

const propTypes = {
  fileNew: PropTypes.func.isRequired,
  fileEdit: PropTypes.object.isRequired,
  sourceList: PropTypes.array.isRequired,
  setFileEdit: PropTypes.func.isRequired,
  toggleMainLoader: PropTypes.func.isRequired,
  toggleModalInfo: PropTypes.func.isRequired,
  toggleModalNewFile: PropTypes.func.isRequired,
  getEditorContent: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default class BarTool extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isDropdownOpen: false,
      fileSelect: {
        isSelect: false,
        Name: this.props.fileEdit.Name,
        Owner: '',
        Cate: ''
      }
    }
  }

  getFileList () {
    const files = {
      scheduler: [],
      platform: [],
      simulator: [],
      generator: []
    }

    for (const file of this.props.sourceList) { files[file.Cate].push(file) }

    let cmps = []
    for (const key in files) {
      cmps.push(
        <DropdownItem key={uuid.v4()} header>
          {key}
        </DropdownItem>
      )

      for (const file of files[key]) {
        cmps.push(
          <DropdownItem key={uuid.v4()} onClick={this.setFileSelect.bind(this, file, true)}>
            {`${file.Name} @ ${file.Owner}`}
          </DropdownItem>
        )
      }
    }
    return cmps
  }

  setFileSelect (meta, isSelect) {
    const n = update(this.state.fileSelect, {
      isSelect: {$set: isSelect},
      Name: {$set: meta.Name},
      Owner: {$set: meta.Owner},
      Cate: {$set: meta.Cate}
    })
    this.setState({fileSelect: n})
  }

  toggleDropdown () {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    })
  }

  isFileSelect () {
    return this.state.fileSelect.isSelect
  }

  isFileOpen () {
    return this.props.fileEdit.isOpen
  }

  isFileMod () {
    return this.props.fileEdit.isMod
  }

  clkOpen () {
    this.props.toggleMainLoader(true)
    API.getSourceCode(
      this.state.fileSelect.Cate,
      this.state.fileSelect.Name,
      this.state.fileSelect.Owner
    , (res) => {
      this.props.setFileEdit({
        Name: {$set: this.state.fileSelect.Name},
        Cate: {$set: this.state.fileSelect.Cate},
        Owner: {$set: this.state.fileSelect.Owner},
        isPub: {$set: res.isPub},
        isMod: {$set: false},
        isOpen: {$set: true},
        Code: {$set: res.data},
        originCode: {$set: res.data}
      })
      this.props.toggleModalInfo(true, `Open file ${this.state.fileSelect.Name}`, 'success')
    }, (res) => {
      this.props.toggleModalInfo(true, res.error, 'danger')
    }, (res) => {
      this.props.toggleMainLoader(false)
    })
  }

  clkSave () {
    this.props.toggleMainLoader(true)
    const content = this.props.getEditorContent()
    API.setSourceCode(
      this.props.fileEdit.Name,
      this.props.fileEdit.Cate,
      content,
      this.props.fileEdit.Owner
    , (res) => {
      this.props.setFileEdit({
        isMod: {$set: false},
        Code: {$set: content},
        originCode: {$set: content}
      })
      this.props.toggleModalInfo(true, 'Save complete.', 'success', false, '')
    }, (res) => {
      this.props.toggleModalInfo(true, 'Save fail.', 'danger', true, res.error)
    }, (res) => {
      this.props.toggleMainLoader(false)
    })
  }

  clkCompile () {
    if (this.isFileMod()) {
      this.props.toggleModalInfo(true, 'Please save file.', 'warning', false, '')
      return
    }
    this.props.toggleMainLoader(true)
    API.compile(
      'workflow',
      this.props.fileEdit.Name,
      this.props.fileEdit.Cate,
      this.props.fileEdit.Owner
    , (res) => {
      if (res.status === 'stderr') {
        this.props.toggleModalInfo(true, 'Compile fail.', 'danger', true, res.msg)
      } else {
        this.props.toggleModalInfo(true, 'Compile success.', 'success', false, '')
      }
    }, (res) => {
      this.props.toggleModalInfo(true, 'Compile fail.', 'danger', true, res.msg)
    }, (res) => {
      this.props.toggleMainLoader(false)
    })
  }

  clkPub () {
    this.props.toggleMainLoader(true)
    if (this.props.fileEdit.isPub) {
      API.deletePublish(
        this.props.fileEdit.Name,
        this.props.fileEdit.Cate,
        'class'
      , (res) => {
        this.props.toggleModalInfo(true, 'Set private success', 'success', false, '')
        this.props.setFileEdit({
          isPub: {$set: false}
        })
      }, (res) => {
        this.props.toggleModalInfo(true, 'Set private fail', 'danger', true, res)
      }, (res) => {
        this.props.toggleMainLoader(false)
      })
    } else {
      API.addPublish(
        this.props.fileEdit.Name,
        this.props.fileEdit.Cate,
        'class'
      , (res) => {
        this.props.toggleModalInfo(true, 'Set publish success', 'success', false, '')
        this.props.setFileEdit({
          isPub: {$set: true}
        })
      }, (res) => {
        this.props.toggleModalInfo(true, 'Set publish fail', 'danger', true, res)
      }, (res) => {
        this.props.toggleMainLoader(false)
      })
    }
  }

  clkNew () {
    this.props.fileNew(true)
    this.setFileSelect({
      Name: '',
      Owner: '',
      Cate: '',
      isPub: false
    }, false)
  }

  clkSaveAs () {
    this.props.toggleModalNewFile(true)
  }

  render () {
    const pubColor = this.props.fileEdit.isPub ? 'primary' : 'secondary'
    return (
      <ButtonToolbar>
        <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown.bind(this)}>
          <DropdownToggle caret>
            {this.state.fileSelect.Name === '' ? 'Select File ' : this.state.fileSelect.Name}
          </DropdownToggle>
          <DropdownMenu>
            {this.getFileList.apply(this)}
          </DropdownMenu>
        </ButtonDropdown>

        <Button onClick={this.clkOpen.bind(this)} disabled={!this.isFileSelect.apply(this)}>
          <span className='fa fa-pencil-square-o fa-lg' />{' Open'}
        </Button>
        <Button onClick={this.clkSave.bind(this)} disabled={!this.isFileOpen.apply(this)}>
          <span className='fa fa-save fa-lg' />{' Save'}
        </Button>
        <Button onClick={this.clkCompile.bind(this)} disabled={!this.isFileOpen.apply(this)}>
          <span className='fa fa-asterisk fa-lg' />{' Compile'}
        </Button>
        <Button onClick={this.clkPub.bind(this)} color={pubColor} disabled={!this.isFileOpen.apply(this)}>
          <span className='fa fa-group fa-lg' />{' Publish'}
        </Button>
        <Button onClick={this.clkNew.bind(this)}>
          <span className='fa fa-file-code-o fa-lg' />{' New File'}
        </Button>
        <Button onClick={this.clkSaveAs.bind(this)}>
          <span className='fa fa-plus fa-lg' />{' Save as'}
        </Button>

      </ButtonToolbar>
    )
  }
}

BarTool.propTypes = propTypes
