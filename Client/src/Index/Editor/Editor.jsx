import React from 'react';
import uuid from 'node-uuid';
import Loader from 'react-loader';
import update from 'immutability-helper';
import {
	ModalInfo,
	ModalNewFile,
	BarStatus,
	BarTool,
	MonacoEditor
} from './Component.jsx';
import {
	Row,
	Col,
} from 'reactstrap';

require("./Editor.css");

export default class Editor extends React.Component{

	constructor(props){
		super(props);
		this.fileNew(false);
	}

	fileNew(isForce){
		this.state = {
			sourceList: this.props.source_list,
			editorId: this.props.id,
			fileEdit: {
				isOpen: false,
				name: '',
				category: '',
				owner: '',
				isPub: false,
				isMod: false,
				code: '',
				originCode: ''
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
		};
		if(isForce)
			this.forceUpdate();
	}

	setFileEdit(meta){
		this.setState({
			fileEdit: update(this.state.fileEdit, meta)
		});
	}

	sourceOnChange(newSrc){
		this.setFileEdit({
			isMod: {$set: (newSrc !== this.state.fileEdit.originCode)},
			code: {$set: newSrc}
		});
	}

	getEditorContent(){
		return this.refs.monaco.editor.getModel().getValue();
	}

	toggleMainLoader(isOpen){
		isOpen = isOpen || !this.state.MainLoader.isOpen;
		const n = update(this.state.MainLoader, {isOpen: {$set: isOpen}});
		this.setState({MainLoader: n});
	}

	toggleModalInfo(isOpen, msg, color, showDetail, detailmsg){
		const n = update(this.state.ModalInfo, {
			isOpen: {$set: isOpen},
			msg: {$set: msg}, 
			color: {$set: color},
			showDetail: {$set: showDetail},
			detailmsg: {$set: detailmsg}
		});
		this.setState({ModalInfo: n});
	}
	
	toggleModalNewFile(isOpen) {
		isOpen = isOpen || !this.state.ModalNewFile.isOpen;
		const n = update(this.state.ModalNewFile, {isOpen: {$set: isOpen}});
		this.setState({ModalNewFile: n});
	}

	render () {
		return(
			<div className="fixedDiv" id="editor">
				<Loader loaded={!this.state.MainLoader.isOpen} zIndex={100}>
					<Row className="toolbar">
						<Col xs="5">
							<BarStatus
								fileEdit={{
									name: this.state.fileEdit.name,
									isMod:  this.state.fileEdit.isMod
								}}
							/>
						</Col>
						<Col xs="7">
							<BarTool 
								sourceList={this.state.sourceList}
								fileNew={this.fileNew.bind(this)}
								fileEdit={{
									isOpen: this.state.fileEdit.isOpen,
									name: this.state.fileEdit.name,
									category: this.state.fileEdit.category,
									owner: this.state.fileEdit.owner,
									isPub: this.state.fileEdit.isPub,
									isMod: this.state.fileEdit.isMod
								}}
								getEditorContent={this.getEditorContent.bind(this)}
								setFileEdit={this.setFileEdit.bind(this)}
								toggleMainLoader={this.toggleMainLoader.bind(this)}
								toggleModalInfo={this.toggleModalInfo.bind(this)}
								toggleModalNewFile={this.toggleModalNewFile.bind(this)}
							/>
						</Col>
					</Row>
					<ModalInfo {...this.state.ModalInfo} toggle={this.toggleModalInfo.bind(this)}/>
					<ModalNewFile {...this.state.ModalNewFile} toggle={this.toggleModalNewFile.bind(this)}/>
					<MonacoEditor 
						ref='monaco' 
						language='java' 
						value={this.state.fileEdit.code}
						onChange={this.sourceOnChange.bind(this)}
						options={{
							autoClosingBrackets: true,
							automaticLayout:true,
							renderIndentGuides: true,
							folding: true,
							renderLineHighlight:'line'
						}}
					/>
				</Loader>
			</div>	
		);
	}
}
