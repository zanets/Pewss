import React from 'react';
import ReactDOM from 'react-dom';
import jq from 'jquery';
import {
	Input,
	Card,
	CardTitle,
	CardBlock,
	Form,
	FormGroup,
	Label,
	Col
} from 'reactstrap';
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
const mounted = document.createElement('div');
mounted.className = "mounted";
const body = document.body;
body.insertBefore(mounted, body.firstChild);

class Login extends React.Component {

	constructor (props) {
		super(props);
	}

	login(){
		const name = ReactDOM.findDOMNode(this.refs['login-name']).value;
		const passwd = ReactDOM.findDOMNode(this.refs['login-passwd']).value;
		jq.post('/login',{name, passwd}, (data) => {
			window.location.href = data.redirect;
		});
	}

	render () {
		return (
			<div className="login-panel">
				<Card>
					<CardBlock>
						<CardTitle>Login</CardTitle>
						<Form>
							<FormGroup row>
							  <Label sm={2}>Name</Label>
							  <Col sm={10}>
								<Input ref="login-name"/>
							  </Col>
							</FormGroup>
							<FormGroup row>
							  <Label sm={2}>Password</Label>
							  <Col sm={10}>
								<Input type="password" ref="login-passwd"/>
							  </Col>
							</FormGroup>
						</Form>
						<hr/>
						<a className="btn btn-secondary fa fa-sign-in" onClick={this.login.bind(this)}/>
					</CardBlock>
				</Card>
			</div>
		);
	}
}

ReactDOM.render(<Login/>, mounted);
