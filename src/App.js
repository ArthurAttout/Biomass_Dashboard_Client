import React, { Component } from 'react';
import Websocket from 'react-websocket';
import './App.css';
import ReactBnbGallery from 'react-bnb-gallery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt,faClock,faEdit, faTimes, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


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

const historyEntryStyle = {
	display: 'flex',
	justifyContent: 'space-between',
	padding: 20,
	alignItems: 'center'
}

const historyInfoStyle = {
	display: 'flex',
	flexDirection: 'column',
	fontSize: 18
}

const modalStyle = {
	display: 'flex',
	flexDirection: 'column',
	padding: 40,
	width: 350,
	height: 250,
	boxShadow: 3,
    backgroundColor: '#f4f4f4',
    outline: 'none',
}


class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = { 
			message: "nothing yet",
			shouldShowGallery: false,
			arrayReports : [],
			showModal: false,
			history : [],
			biomassList: [],
			selectedBiomass: "",
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
				
				this.refWebSocket.sendMessage(JSON.stringify({
					"type":"GET_HISTORY"
				}))
				
				this.refWebSocket.sendMessage(JSON.stringify({
					"type":"GET_BIOMASS_LIST"
				}))
				
				break
				
			case "OK_HISTORY":
				console.log("Server said OK history")
				console.log(result['history'])
				this.setState(({
					history: result['history']
				}))
				break
				
			case "OK_REPORTS":
				console.log("Server said OK reports")
				console.log(result['reports'])
				
				this.setState(({
					arrayReports: result['reports']
				}))
				break
				
			case "OK_BIOMASS_LIST":
				console.log("Server said Biomass list")
				console.log(result['biomass_list'])
				this.setState(({
					biomassList: result['biomass_list']
				}))
				break
				
			case "NEW_REPORT":
				console.log("New report incoming")
				
				this.setState(prevState => ({
					arrayReports: [...prevState.arrayReports, result['new_report']]
				}))
				break
				
			case "NEW_HISTORY":
				console.log("Received new history elem")
				console.log(result)
				this.setState(prevState => ({
					history: [...prevState.history, result['elem']]
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
								<Button variant="contained" onClick={() => {this.handleOpenModal(r.id)}}>
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
			
			const history = this.state.history.map(h => (
				<div key={h.id} style={historyEntryStyle}>
					<img src={h.path} style={{ width : '30%'}}/>
					<div style={historyInfoStyle}>
						<div>{h.name}</div>
						<div>Certitude : {(h.certitude * 100).toFixed(2)}</div>
						<Moment format="DD - MM - YYYY">
							{h.date}
						</Moment>
					</div>
					<IconButton>
						<FontAwesomeIcon icon={faExclamationCircle} style={{textAlign: 'center'}}/>
					</IconButton>
					
				</div>
			))
			
			const menuItemsBiomass = this.state.biomassList.map(b => (
				<MenuItem key={b.id} value={b.name}>{b.name}</MenuItem>
			))
			
			
			return (
				<div style={mainDivStyle}>
				
					<div style={titleStyle}>
						BIOMASSE
					</div>
					<div style={panelContainerStyle}>
						<div style={{...paneStyle, width: '12%'}}>
							Statistiques
						</div>
						
						<div style={{...paneStyle, width: '49%'}}>
							<div>Dossiers de biomasses non identifiées</div>
							<div>
								{listReports}
							</div>
						</div>

						<div style={{...paneStyle, width: '21%'}}>
							<div>Dernières identifications</div>
							<div>
								{history}
							</div>
						</div>
					</div>

					
					<Websocket url='ws://192.168.1.85:8080/'
						onMessage={this.handleData.bind(this)}
						onOpen={this.handleConnection.bind(this)}
						ref={Websocket => {this.refWebSocket = Websocket;}}/>
						
						<Modal
						aria-labelledby="simple-modal-title"
						aria-describedby="simple-modal-description"
						open={this.state.showModal}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
						onClose={this.handleCloseModal}>
							<div style={modalStyle}> 
								<Typography variant="h6" id="modal-title">
									Identification d'une biomasse
								</Typography>
								<Typography style={{paddingTop : 15}}>
									Précisez l'identité de la biomasse
								</Typography>
								<FormControl style={{marginTop: 20}}>
									<InputLabel htmlFor="age-simple">Biomasse</InputLabel>
									<Select
										value={this.state.selectedBiomass}
										onChange={this.handleSelectBiomass}>
											<MenuItem value="">
												<em>Nouvelle</em>
											</MenuItem>
											
											{menuItemsBiomass}
									</Select>
								</FormControl>
								<Button variant="contained" style={{marginTop: 35}} onClick={this.handleSubmitIdentify} >
									Valider
									<FontAwesomeIcon icon={faCheck} style={{paddingLeft:8}}/>
								</Button>
							</div>
						</Modal>
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
	
	handleOpenModal = reportId => {
		console.log("Show modal !");
		console.log(reportId);
		this.setState({ showModal: true, currentReportID: reportId });
	};

	handleCloseModal = () => {
		this.setState({ showModal: false, currentReportID: -1 });
	};
	
	handleSelectBiomass = event => {

		const biomassName = event.target.value;
		console.log(this.state.biomassList)
		this.setState({ 
			selectedBiomass: biomassName,
			selectedBiomassID: this.state.biomassList.filter(b => b.name === biomassName)[0].id
		});
	};
	
	handleSubmitIdentify = () => {
		const identifyMessage = {
			"type":"IDENTIFY_BIOMASS",
			"report_id": this.state.currentReportID,
			"identity": this.state.selectedBiomass,
			"biomass_id": this.state.selectedBiomassID,
		}
		this.refWebSocket.sendMessage(JSON.stringify(identifyMessage))
		this.setState(prevState => ({ 
			showModal: false, 
			arrayReports : prevState.arrayReports.filter(r => r.id != this.state.currentReportID)
		}));
	};
}

export default App;

