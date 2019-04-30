import React, { Component } from 'react';
import logo from './logo.svg';
import Websocket from 'react-websocket';
import './App.css';

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
	 return (
		<div className="App">
		  <header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<p>
			  Server says : {this.state.message}
			</p>
			<a
			  className="App-link"
			  href="#"
			  target="_blank"
			  onClick={this.handleClick.bind(this)}
			  rel="noopener noreferrer">
			  Learn React
			</a>
		  </header>
		 <div>

		 </div>
		  <Websocket url='ws://192.168.1.85:8080/'
              onMessage={this.handleData.bind(this)}
			  ref={Websocket => {this.refWebSocket = Websocket;}} />
		</div>
	  );
	}
}

export default App;

