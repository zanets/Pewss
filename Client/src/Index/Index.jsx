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
	NavDropdown,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
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
	isMemberOpen: false,
	username: ''
};

class Index extends React.Component {

	constructor(props){
		super(props);
		this.state = INIT_STATE;
	}

	componentWillMount(){
		API.getUserName((data) => {
			this.setState({username: data.name});
		});
    }

	componentDidMount(){
		this.toSimulator();
	}

	setInitState(){
		this.setState({
			ready: false,
			isMemberOpen: false
		});
	}

	toSimulator(){
		this.setInitState();
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
		});
	}

	toEditor(){
		this.setInitState();
		API.getSourceList((res)=>{
			setTimeout(() => {
				this.setState({
					ready: true,
					sourceList: res,
					page: PAGES.EDI
				});
			}, 1000);
		});
	}

	logout(){
		API.logout();
	}

	toggleMember(){
		this.setState({isMemberOpen: !this.state.isMemberOpen});
	}

	render () {
		const page = (this.state.page === PAGES.EDI)
			? <Editors
				source_list={this.state.sourceList}
				username={this.state.username}/>
			: <Simulator
				class_list={this.state.classList}
				username={this.state.username}/>;

		return (
			<div className={'fixedDiv'}>
				<Navbar color="primary" inverse toggleable>
					<NavbarBrand style={{paddingTop:'1rem'}}>
			
						{'Parallel Extensible Workflow Scheduling Simulator'}
					</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href='/documents' style={{paddingTop:'2rem'}}>
						 		{'Documents'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#' onClick={this.toSimulator.bind(this)} style={{paddingTop:'2rem'}}>
						 		{'Simulator'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#' onClick={this.toEditor.bind(this)} style={{paddingTop:'2rem'}}>
								{'Editor'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#'>
								<NavDropdown isOpen={this.state.isMemberOpen} toggle={this.toggleMember.bind(this)}>
        							<DropdownToggle>
          								<i className="fa fa-user-circle-o fa-2x" ></i>
        							</DropdownToggle>
        							<DropdownMenu right>
										<DropdownItem disabled>
											{this.state.username}
										</DropdownItem>
          								<DropdownItem>
											{'Profile '}
										</DropdownItem>
          								<DropdownItem onClick={this.logout.bind(this)}>
											{'Logout '}
										</DropdownItem>
        							</DropdownMenu>
      							</NavDropdown>
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
