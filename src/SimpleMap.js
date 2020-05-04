/*
Full CoronaCrypt Client

Date: May 6
*/

import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { geolocated } from "react-geolocated";
import MyGreatPlace from './MyGreatPlace.js';
import './App.css';
import avatar from './img/avatar.svg';
import ReactPageScroller from 'react-page-scroller';
import bg from './img/bg.svg';
import wave from './img/wave.png';
import coronabottle from './img/cclogo.png';
import FirstComponent from "./FirstComponent";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



//Sends login username to server
function sendLogin(url, username) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url);  
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xmlhttp.setRequestHeader("Purpose", "login");
  xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlhttp.setRequestHeader("Username", username);
  xmlhttp.send(username);
	console.log("sent: " + username);
}

//Sends coordinates of username to server
function sendCoords(coords, url, username) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url);  
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xmlhttp.setRequestHeader("Purpose", "sendCoords");
  xmlhttp.setRequestHeader("Username", username);
  xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlhttp.setRequestHeader("Coords", coords.latitude.toString() + ' ' + coords.longitude.toString());
  xmlhttp.send(coords.latitude.toString() + ' ' + coords.longitude.toString());
	console.log("sent: " + coords.latitude.toString() + ' ' + coords.longitude.toString());
}

//Formats coordinates for rendering
function parseCoords(coords) {
  var latlon = coords.slice(1, -1).split(', ');
  var lat = parseFloat(latlon[0]);
  var lon = parseFloat(latlon[1]);
  return {
    "latitude": lat,
    "longitude": lon
  };
}

//For input animations for login username
function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}


//For input animations for login username
function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}

//For reporting a Coronavirus case at current location
function gotCorona(coords, url, username) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url);  
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xmlhttp.setRequestHeader("Purpose", "gotCorona");
  xmlhttp.setRequestHeader("Username", username);
  xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlhttp.setRequestHeader("Coords", coords.latitude.toString() + ' ' + coords.longitude.toString());
  xmlhttp.send(coords.latitude.toString() + ' ' + coords.longitude.toString());
  console.log(xmlhttp.responseText);
	console.log("sent: " + coords.latitude.toString() + ' ' + coords.longitude.toString());
}

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', loggedIn: false, map: false, currentPage: null};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.corona = this.corona.bind(this);
    this.logOut = this.logOut.bind(this);
    SimpleMap.state = {map: false, latitude: 0.0, longitude: 0.0, coords: [], coordState: false};
  }

  //Handles change in username input
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  //Handles submitting of username input
  handleSubmit(event) {
    sendLogin("https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
    sendCoords(this.props.coords ,"https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
    this.setState({loggedIn: true});
    this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
    event.preventDefault();
  }
  
  //Called by "Report Corona" button, calls gotCorona function
  corona() {
    gotCorona(this.props.coords,"https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
  }
  
  //Called by "Show Map button", sets state of map to show
  toggleMap() {
    this.setState({map: true});
  }

  //Called by "Logout" button, removes map and username
  logOut() {
    this.setState({loggedIn: false, map: false});
  }
  
  //Gets coordinates of covid cases nearby
   getCoords(coords, url, username) {
    console.log(coords);
    var newcoords;
    var xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function() {
        
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            newcoords = xmlHttp.responseText.split("\n");
              for (var i=0; i<newcoords.length; i++) {
                newcoords[i] = parseCoords(newcoords[i]);
                SimpleMap.state.coords.push(newcoords[i]);
              }
            console.log(SimpleMap.state.coords);
            SimpleMap.state.coordState = true;
          }
      }

      xmlHttp.open("GET", url, true); 
      
      xmlHttp.setRequestHeader("Username", username);
      xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");

      xmlHttp.send(null);
  }
  static createPoints(url, coords) {
      var coordsList = coords;
      for (var i = 0; i< coordsList.length + 1; i++) {
        
        SimpleMap.state.coords.push(<MyGreatPlace lat={coordsList[i].latitude} lng={coordsList[i].longitude} />);
      }
      // console.log(SimpleMap.state.coords);// SimpleMap.state.coords = coordsTable;
      
      

  }
  //Creates markers on the map
  createTable = () => {
    let table = []
    console.log(SimpleMap.state.coords.length);
    for (var i = 0; i < SimpleMap.state.coords.length; i++) {
      table.push(<MyGreatPlace key={i} lat={SimpleMap.state.coords[i].latitude} lng={SimpleMap.state.coords[i].longitude} />);
      console.log("Coords: Latitude - " + SimpleMap.state.coords[i].latitude.toString() + " Longitude - " + SimpleMap.state.coords[i].longitude.toString());
      
      
    }
    console.log(table);
    
    return table;
  }

  static defaultProps = {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 11
  };

  //Updates input container
  componentDidUpdate() {
    document.querySelectorAll(".input").forEach(input => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  }
  
  //Complete UI
  render() {
   
    return !this.props.isGeolocationAvailable ? (
      <div style={{ height: '100vh', width: '100%', position: 'relative', textAlign: 'center' ,display: 'flex'}}>
      <img class="wave" src={wave} />
      <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <h2><br></br></h2>
      <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
    </div>
      <h2>Your browser does not support Geolocation
      </h2>
      </div>
  ) : !this.props.isGeolocationEnabled ? (
    <div style={{ height: '100vh', width: '100%', position: 'relative', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <img class="wave" src={wave} />
      <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <h2><br></br></h2>
      <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
    </div>
      <h2>Geolocation is loading...</h2>
    </div>
  ) : this.props.coords && !this.state.loggedIn ? (
      <div style={{ height: '100vh', width: '100%', position: 'absolute' }}>
      <img class="wave" src={wave} style={{height: '100vh', position: 'fixed'}} />
      <h2><br></br></h2>
      <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center', position: 'fixed', width: '100vw'}}>
        <h2><br></br></h2>
        <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
      </div>
      
    <div class="container">
    <div class="img">
        <h1>Privacy x Health.</h1>
        <hr></hr>
        <li>See cases near you</li>
        <hr></hr>
        <li>Report to help others</li>
        <hr></hr>
        <li>See a detailed US heatmap</li>
      </div>
    
		<div class="login-content">
			<form onSubmit={this.handleSubmit}>
				<img src={avatar} />
				<h1>Welcome</h1>
           		<div class="input-div one">
           		   <div class="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div class="div">
           		   		<h5>Enter a username</h5>
                    <h5><br></br></h5>
           		   		<input type="text" class="input" value={this.state.value} onChange={this.handleChange} />
           		   </div>
           		</div>
            	<input type="submit" class="btn" value="Login" />
            </form>
        </div>
        
    </div>
    
      </div>
      
  ) : this.props.coords && this.state.loggedIn && !this.state.map ? (
    <div style={{ height: '100vh', width: '100%', position: 'relative', }}>
    <img class="wave" src={wave} />
    <h2><br></br></h2>
    <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <h2><br></br></h2>
      <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
    </div>
    <div class="container">
    <div class="img">
        <h1>Privacy x Health.</h1>
        <hr></hr>
        <li>See cases near you</li>
        <hr></hr>
        <li>Report to help others</li>
        <hr></hr>
        <li>See a detailed US heatmap</li>
      </div>
  <div class="login-content">
    <form onSubmit={this.handleSubmit}>
      <img src={avatar} />
      <h1>Welcome, {this.state.value}.</h1>
             <div class="input-div one">
                <div class="i">
                    <i class="fas fa-user"></i>
                </div>
             </div>
             <button class="btn" onClick={this.toggleMap}>Show Map</button>
          </form>
      </div>
      </div>
      </div>
  ) : this.props.coords && this.state.loggedIn && this.state.map ? ( 
    <div style={{ height: '100vh', width: '100%' , textAlign: 'center', marginTop: 'auto', marginBottom: 'auto'}}>
      <img class="wave" src={wave} />
    <h2><br></br></h2>
    <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <h2><br></br></h2>
      <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
    </div>
    <div style={{textAlign: 'center'}}>
    <h1><br></br></h1>
    <h1>Welcome, {this.state.value}.</h1>
    <div style={{display: 'flex'}}>
    <button class="btn" style={{width: '200px', marginLeft: 'auto', marginRight: 'auto'}} onClick={this.corona}>Report Corona</button>
    <button class="btn" style={{width: '200px', marginLeft: 'auto', marginRight: 'auto'}} onClick={this.logOut}>Logout</button>
     </div>
     </div>
     <GoogleMapReact
          bootstrapURLKeys={{key: "AIzaSyDTz5KwujIjzE6RRCnaJ5ZoZSroy4vdz-0"}}
          defaultCenter={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}}
          defaultZoom={14}
        >
       {this.createTable()}

      </GoogleMapReact>
    </div>
  ) : (
    <div style={{ height: '100vh', width: '100%', position: 'relative', textAlign: 'center'}}>
      <img class="wave" src={wave} />
      <div style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
      <h2><br></br></h2>
      <img src={coronabottle} style={{height: '50px'}} /><h1>  CORONA</h1><h1 style={{color: '#25ac7d'}}>CRYPT</h1>
    </div>
      <h2>Getting location data...</h2>
    </div>
    );
  }
}



export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(SimpleMap);
