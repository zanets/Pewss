import React from 'react';
import ReactDOM from 'react-dom';
import Loader from 'react-loader';
import {default as API} from '../WebAPI.jsx';
import Editors from './Editor/Editors.jsx';
import Simulator from './Simulator/Simulator.jsx';
import {
	Navbar,
	Nav,
	NavbarBrand,
	NavLink,
	NavItem,
	Collapse,
	Button,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';

import "bootstrap/dist/css/bootstrap.min.css";
import "./Index.css";
const mounted = document.getElementById('mp');

const PAGES = {
	SIM: 'simulator',
	EDI: 'editor'
};
const INIT_STATE = {
	ready: false,
	classList: null,
	sourceList: null,
	page: null,
	isMemberOpen: false
};

class Index extends React.Component {

	constructor(props){
		super(props);
		this.state = INIT_STATE;
	}

	componentDidMount(){
		API.getUserName((data) => {
			this.username = data.name;
		});
		this.toSimulator();
	}

	toSimulator(){
		this.setState(INIT_STATE);
		API.getClassList({
			env: "workflow"
		}, (res)=>{
			setTimeout(() => {
				this.setState({
					ready: true,
					classList: res,
					page: PAGES.SIM
				});
			}, 1000);
		}, (res)=>{
			console.log(res);
		});
	}

	toEditor(){
		this.setState(INIT_STATE);
		API.getSourceList((res)=>{
			setTimeout(() => {
				this.setState({
					ready: true,
					sourceList: res,
					page: PAGES.EDI
				});
			}, 1000);
		}, (res)=>{
			console.log(res);
		});
	}

	logout(){
		API.logout();
	}

	toggleMember(){
		this.setState({isMemberOpen: !this.state.isMemberOpen});
	}

	render () {
		const page = (this.state.page === PAGES.EDI) ?
			<Editors source_list={this.state.sourceList}/> :
			<Simulator class_list={this.state.classList}/>;

		return (
			<div className={'fixedDiv'}>
				<Navbar color="primary" inverse toggleable>
					<NavbarBrand>
						{'Parallel Extendable Workflow Scheduling Simulator'}
					</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href='#' onClick={this.toSimulator.bind(this)} style={{paddingTop:'1.3rem'}}>
						 		{'Simulator'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#' onClick={this.toEditor.bind(this)} style={{paddingTop:'1.3rem'}}>
								{'Editor'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#'>
								<Dropdown isOpen={this.state.isMemberOpen} toggle={this.toggleMember.bind(this)}>
        					<DropdownToggle>
          					<i className="fa fa-user-circle-o fa-2x" ></i>
        					</DropdownToggle>
        					<DropdownMenu right>
										<DropdownItem disabled>
											{this.username}
										</DropdownItem>
          					<DropdownItem>
											{'Profile '}
										</DropdownItem>
          					<DropdownItem onClick={this.logout.bind(this)}>
											{'Logout '}
										</DropdownItem>
        					</DropdownMenu>
      					</Dropdown>
							</NavLink>
						</NavItem>

					</Nav>
				</Navbar>
				<Loader loaded={this.state.ready} zIndex={100}>
					{page}
				</Loader>
			</div>
		);
	}
}

ReactDOM.render(<Index/>, mounted);
