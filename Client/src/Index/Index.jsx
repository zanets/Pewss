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
	Collapse
} from 'reactstrap';

require("bootstrap/dist/css/bootstrap.css");
require("./Index.css");
const mounted = document.getElementById('mp');

const PAGES = {
	SIM: 'simulator',
	EDI: 'editor'
};
const INIT_STATE = {
	ready: false,
	classList: null,
	sourceList: null,
	page: null
};

class Index extends React.Component {

	constructor(props){
		super(props);
		this.state = INIT_STATE;
	}

	componentDidMount(){
		this.toSimulator();
	}

	toSimulator(){
		this.setState(INIT_STATE);
		API.getClassList((res)=>{
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

	render () {
		const page = (this.state.page === PAGES.EDI) ? 
			<Editors source_list={this.state.sourceList}/> :
			<Simulator class_list={this.state.classList}/>;
		
		return (
			<div className={'fixedDiv'}>
				<Navbar color="primary" inverse toggleable>
					<NavbarBrand>
						{'Workflow Simulation Platform'}
					</NavbarBrand>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href='#' onClick={this.toSimulator.bind(this)}>
						 		{'Simulator'}
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='#' onClick={this.toEditor.bind(this)}>
								{'Editor'}
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
