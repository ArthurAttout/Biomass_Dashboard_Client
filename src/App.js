import React, { Component } from 'react';
import Websocket from 'react-websocket';
import './App.css';
import { SortablePane, Pane } from 'react-sortable-pane';
import ReactBnbGallery from 'react-bnb-gallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt,faClock,faEdit, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';

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
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: "#9EED9C",
	margin: 20,
}

const reportInfoImageStyle = {
	padding: 50,
	display: 'flex',
	justifyContent: 'space-between',
}

const reportsButtonsStyle = {
	padding: 20,
	display: 'flex',
	justifyContent: 'space-between',
}

const imageContainerStyle = {
	display: "flex",
	justifyContent: "right"
}

const reportInfoContainerStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between"
}

const panelContainerStyle = {
	display: "flex",
	justifyContent: "space-between"
}

const infoEntryStyle = {
	fontSize: 12
}


class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			message: "nothing yet",
			shouldShowGallery: false,
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
				break
				
			case "NEW_REPORT":
				console.log("New report incoming")
				
				this.setState(prevState => ({
					arrayReports: [...prevState.arrayReports, result['new_report']]
				}))
				break
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
	
	showGallery(images){
		this.setState(({
			shouldShowGallery: true,
			imagesToShow: images
		}))
	}
	
	closeGallery(){
		this.setState(({
			shouldShowGallery: false,
			imagesToShow: []
		}))
	}

	render(){
		if(!this.state.shouldShowGallery){		
			const listReports = this.state.arrayReports.map(r => {
				
				const images = r.images.length > 0 ? 
					(<img src={r.images[0].path} style={{ width : '30%'}} onClick={() => this.showGallery(r.images)}/>)
				:
					(<div>Pas d'images disponibles</div>)
				
				return (
					<div key={r.id} style={reportStyle}>
						<div style={reportInfoImageStyle}>
							<div style={reportInfoContainerStyle}>
								<div>
									<FontAwesomeIcon icon={faClock} style={{paddingRight:15}}/>
									<Moment format="DD - MM - YYYY" style={infoEntryStyle}>
										{r.submission_date}
									</Moment>
								</div>
								<div>
									<FontAwesomeIcon icon={faMapMarkerAlt} style={{paddingRight:15}}/>
									<span style={infoEntryStyle}>{r.place}</span>
								</div>
								<div>
									<FontAwesomeIcon icon={faEdit} style={{paddingRight:15}}/>
									<span style={infoEntryStyle}>{r.comment}</span>
								</div>
							</div>
							
							<div style={imageContainerStyle}>
								{images}
							</div>
						</div>
						<div style={reportsButtonsStyle}>
							<div>
								<Button variant="contained">
									Identifier
									<FontAwesomeIcon icon={faCheck} style={{paddingLeft:8}}/>
								</Button>
							</div>
							<div>
								<Button variant="contained">
									Ignorer
									<FontAwesomeIcon icon={faTimes} style={{paddingLeft:8}}/>
								</Button>
							</div>
						</div>
					</div>
				)
			})
			
			
			return (
				<div style={mainDivStyle}>
				
					<div style={titleStyle}>
						BIOMASSE
					</div>
					<div style={panelContainerStyle}>
						<div style={{... paneStyle, width: '12%'}}>
							Statistiques
						</div>
						
						<div style={{... paneStyle, width: '49%'}}>
							<div>Dossiers de biomasses non identifiées</div>
							<div>
								{listReports}
							</div>
						</div>

						<div style={{... paneStyle, width: '21%'}}>
							Dernières identifications
						</div>
					</div>

					
					<Websocket url='ws://192.168.1.85:8080/'
						onMessage={this.handleData.bind(this)}
						onOpen={this.handleConnection.bind(this)}
						ref={Websocket => {this.refWebSocket = Websocket;}}/>
				</div>
				
			);
		}
		else{
			// Gallery
			return (
				<ReactBnbGallery
					show={true}
					photos={this.state.imagesToShow.map(img => img.path)}
					onClose={this.closeGallery.bind(this)} />
			)
		}
	}
}

export default App;

