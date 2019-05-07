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
	flexDirection: 'column',
	justifyContent: 'left',
	padding: 30,
	color: "#035218",
	fontWeight: "bold",
	fontSize: 20,
	backgroundColor: "#EDEDED",
	fontFamily: "roboto"
};

const mainDivStyle = {
	backgroundImage: 'url(https://images.pexels.com/photos/1131458/pexels-photo-1131458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	padding: '10px',
	height:1000
}

const reportStyle = {
	backgroundColor: "#9EED9C",
	margin: 20,
}

class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			message: "nothing yet",
			dummy : 'yo',
			arrayReports : []
		};
	}

	handleData(data) {
		let result = JSON.parse(data);
		
		switch(result['result']){
			case "OK_HELLO":
				console.log("Server said OK hello")
				console.log("Requesting reports")
				
				this.refWebSocket.sendMessage(JSON.stringify({
					"type":"GET_REPORTS"
				}))
				break
				
			case "OK_REPORTS":
				console.log("Server said OK reports")
				console.log(result['reports'])
				
				this.setState(({
					arrayReports: result['reports']
				}))
		}
	}
	
	handleConnection(){
		const helloMessage = {
			"type":"HELLO",
			"username":"JohnDoe"
		}
		this.refWebSocket.sendMessage(JSON.stringify(helloMessage))
	}
	
	handleClick(e) {
		e.preventDefault();
		console.log('The link was clicked.');
	}

	render(){
		const listReports = this.state.arrayReports.map(r => 
			<div key={r.id} style={reportStyle}>
				Report
			</div>
		)
		const panes = []
		panes[0] = (
			<Pane key={0} defaultSize={{ width: '20%', height: '80%' }} style={paneStyle}>
			  Statistiques {this.state.dummy}
			</Pane>
		)
		
		panes[1] = (
			<Pane key={1} defaultSize={{ width: '50%', height: '80%'  }} style={paneStyle}>
			  <div>Dossiers de biomasses non identifiées</div>
			  <div>
				{listReports}
			  </div>
			</Pane>
		)
		
		panes[2] = (
			<Pane key={2} defaultSize={{ width: '25%', height: '80%'  }} style={paneStyle}>
			  Dernières identifications
			</Pane>
		)
		
		return (
			<div style={mainDivStyle}>
				<div style={titleStyle}>
					BIOMASSE
				</div>
				<SortablePane direction="horizontal" style={{ height: '100%' }} margin={20} >
					{panes}	
				</SortablePane>
				
				<Websocket url='ws://192.168.1.85:8080/'
					onMessage={this.handleData.bind(this)}
					onOpen={this.handleConnection.bind(this)}
					ref={Websocket => {this.refWebSocket = Websocket;}}/>
			</div>
			
		);
	}
}

export default App;

