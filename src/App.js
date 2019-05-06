import React, { Component } from 'react';
import logo from './logo.svg';
import Websocket from 'react-websocket';
import './App.css';
import { SortablePane, Pane } from 'react-sortable-pane';

const titleStyle = {
	color: "#000000",
	fontSize: 28,
	fontWeight: "bold",
	backgroundColor: "#EDEDED",
	marginBottom: 50,
	padding: 25,
	display: "inline-block",
	fontFamily: "roboto"
};

const paneStyle = {
	display: 'flex',
	justifyContent: 'left',
	padding: 30,
	color: "#035218",
	fontSize: 28,
	backgroundColor: "#EDEDED",
	fontFamily: "roboto"
};

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = { message: "nothing yet" };
	}

	handleData(data) {
      let result = data;
      this.setState({message: result});
    }
	
	handleClick(e) {
		e.preventDefault();
		console.log('The link was clicked.');
		this.refWebSocket.sendMessage("Hello");
	}

	render(){
		const panes = []
		panes[0] = (
			<Pane key={0} defaultSize={{ width: '30%', height: 500 }} style={paneStyle}>
			  Statistiques
			</Pane>
		)
		
		panes[1] = (
			<Pane key={1} defaultSize={{ width: '30%', height: 500 }} style={paneStyle}>
			  Dossiers de biomasses non identifiées
			</Pane>
		)
		
		panes[2] = (
			<Pane key={2} defaultSize={{ width: '30%', height: 500 }} style={paneStyle}>
			  Dernières identifications
			</Pane>
		)
		
		return (
			<div style={{ padding: '10px' , backgroundColor: '#4286f4'}}>
				<div style={titleStyle}>
					BIOMASSE
				</div>
				<SortablePane direction="horizontal" style={{ height: 1000 }} margin={20} >
					{panes}	
				</SortablePane>
			</div>
			/*<Websocket url='ws://192.168.1.85:8080/'
			onMessage={this.handleData.bind(this)}
			ref={Websocket => {this.refWebSocket = Websocket;}} />*/
			
		);
	}
}

export default App;

