import React, {PropTypes} from 'react'
import Loader from 'react-loader'
import update from 'immutability-helper'
import NewFileGenerator from './NewFileGnerator.jsx'
import {
  ModalInfo,
  ModalNewFile,
  BarStatus,
  BarTool,
  MonacoEditor
} from './Component.jsx'
import {
  Row,
  Col
} from 'reactstrap'

const propTypes = {
  username: PropTypes.string.isRequired
}

export default class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.fileNew(false)
  }

  fileNew (isForce) {
    const defailtCode = NewFileGenerator.get(this.props.username)
    this.state = {
      sourceList: this.props.source_list,
      editorId: this.props.id,
      fileEdit: {
        isOpen: false,
        Name: '',
        Cate: '',
        Owner: '',
        isPub: false,
        isMod: false,
        Code: defailtCode,
        originCode: defailtCode
      },
      MainLoader: {
        isOpen: false
      },
      ModalInfo: {
        isOpen: false,
        msg: '',
        color: 'info',
        showDetail: false,
        detailmsg: ''
      },
      ModalNewFile: {
        isOpen: false
      }
    }
    if (isForce) { this.forceUpdate() }
  }

  setFileEdit (meta) {
    this.setState({
      fileEdit: update(this.state.fileEdit, meta)
    })
  }

  sourceOnChange (newSrc) {
    this.setFileEdit({
      isMod: {$set: (newSrc !== this.state.fileEdit.originCode)},
      Code: {$set: newSrc}
    })
  }

  getEditorContent () {
    return this.refs.monaco.editor.getModel().getValue()
  }

  toggleMainLoader (isOpen) {
    isOpen = isOpen || !this.state.MainLoader.isOpen
    const n = update(this.state.MainLoader, {isOpen: {$set: isOpen}})
    this.setState({MainLoader: n})
  }

  toggleModalInfo (isOpen, msg, color, showDetail, detailmsg) {
    const n = update(this.state.ModalInfo, {
      isOpen: {$set: isOpen},
      msg: {$set: msg},
      color: {$set: color},
      showDetail: {$set: showDetail},
      detailmsg: {$set: detailmsg}
    })
    this.setState({ModalInfo: n})
  }

  toggleModalNewFile (isOpen) {
    isOpen = isOpen || !this.state.ModalNewFile.isOpen
    const n = update(this.state.ModalNewFile, {isOpen: {$set: isOpen}})
    this.setState({ModalNewFile: n})
  }

  render () {
    return (
      <div className='fixedDiv' id='editor'>
        <Loader loaded={!this.state.MainLoader.isOpen} zIndex={100}>
          <Row className='toolbar'>
            <Col xs='5'>
              <BarStatus
                fileEdit={{
                  Name: this.state.fileEdit.Name,
                  isMod: this.state.fileEdit.isMod
                }}
              />
            </Col>
            <Col xs='7'>
              <BarTool
                sourceList={this.state.sourceList}
                fileNew={this.fileNew.bind(this)}
                fileEdit={{
                  isOpen: this.state.fileEdit.isOpen,
                  Name: this.state.fileEdit.Name,
                  Cate: this.state.fileEdit.Cate,
                  Owner: this.state.fileEdit.Owner,
                  isPub: this.state.fileEdit.isPub,
                  isMod: this.state.fileEdit.isMod
                }}
                getEditorContent={this.getEditorContent.bind(this)}
                setFileEdit={this.setFileEdit.bind(this)}
                toggleMainLoader={this.toggleMainLoader.bind(this)}
                toggleModalInfo={this.toggleModalInfo.bind(this)}
                toggleModalNewFile={this.toggleModalNewFile.bind(this)}
                username={this.props.username}
              />
            </Col>
          </Row>
          <ModalInfo {...this.state.ModalInfo} toggle={this.toggleModalInfo.bind(this)} />
          <ModalNewFile {...this.state.ModalNewFile}
            fileEdit={{
              Code: this.state.fileEdit.Code
            }}
            toggle={this.toggleModalNewFile.bind(this)}
            setFileEdit={this.setFileEdit.bind(this)}
            toggleMainLoader={this.toggleMainLoader.bind(this)}
            toggleModalInfo={this.toggleModalInfo.bind(this)}
          />
          <MonacoEditor
            ref='monaco'
            language='java'
            value={this.state.fileEdit.Code}
            onChange={this.sourceOnChange.bind(this)}
            options={{
              autoClosingBrackets: true,
              automaticLayout: true,
              renderIndentGuides: true,
              folding: true,
              renderLineHighlight: 'line'
            }}
          />

        </Loader>
      </div>
    )
  }
}

Editor.propTypes = propTypes
