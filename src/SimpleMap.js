

import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { geolocated } from "react-geolocated";
import MyGreatPlace from './MyGreatPlace.js';


//Sends current coordinates to url
// eslint-disable-next-line
function sendCoords(coords, url, username) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url);  
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xmlhttp.setRequestHeader("Purpose", "login");
  xmlhttp.setRequestHeader("Username", username);
  xmlhttp.setRequestHeader("Coords", coords.latitude.toString() + ' ' + coords.longitude.toString());
  xmlhttp.send(coords.latitude.toString() + ' ' + coords.longitude.toString());
  console.log(xmlhttp.responseText);
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
function gotCorona(coords, url, username) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url);  
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
  xmlhttp.setRequestHeader("Purpose", "gotCorona");
  xmlhttp.setRequestHeader("Username", username);
  xmlhttp.setRequestHeader("Coords", coords.latitude.toString() + ' ' + coords.longitude.toString());
  xmlhttp.send(coords.latitude.toString() + ' ' + coords.longitude.toString());
  console.log(xmlhttp.responseText);
	console.log("sent: " + coords.latitude.toString() + ' ' + coords.longitude.toString());
}
//Formats coordinates for rendering

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  console.log(end);
  while(end < start + ms) {
    end = new Date().getTime();
 }
}
//Sends a request to the server in order to get coordinates of every point
// async function getCoords(coords, url) {
//   var newcoords;
//   var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//             newcoords = xmlHttp.responseText.split("\n");
//             for (var i=0; i<newcoords.length; i++) {
//               newcoords[i] = parseCoords(newcoords[i]);
//             }
//             SimpleMap.createPoints(url, newcoords);
//           }
//       }
//     xmlHttp.open("GET", "https://RawPythonTest.r2dev2bb8.repl.co", true); 
//     xmlHttp.setRequestHeader("coords", "37.5042267 -121.9643745");
//     xmlHttp.send("37.5042267 -121.9643745");
//     // return newcoords;
// }
// Not used -> form posting 
// xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', loggedIn: false, map: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMap = this.toggleMap.bind(this);

    //sendCoords({latitude:  37.5042267, longitude:  -121.9643745} ,"https://RawPythonTest.r2dev2bb8.repl.co");
    SimpleMap.state = {map: false, latitude: 0.0, longitude: 0.0, coords: [], coordState: false};
    //this.getCoords({latitude: 37.5042267, longitude: -121.9643745 }, "https://RawPythonTest.r2dev2bb8.repl.co");
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    sendCoords(this.props.coords ,"https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
    this.setState({loggedIn: true});
    this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co", this.state.value);
    event.preventDefault();
  }
  toggleMap() {
    this.setState({map: true});
  }
  // create points on maps
  setCoordState(coords) {
    this.setState(coords, coords);
  }
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
      // xmlHttp.onreadystatechange = function() { 
      //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //         newcoords = xmlHttp.responseText.split("\n");
      //           for (var i=0; i<newcoords.length; i++) {
      //             newcoords[i] = parseCoords(newcoords[i]);
      //             SimpleMap.state.coords.push(newcoords[i]);
      //           }
             
              
              
      //       }
      //   }
      xmlHttp.open("GET", "https://RawPythonTest.r2dev2bb8.repl.co", true); 
      //xmlHttp.setRequestHeader("coords", coords.latitude.toString() + " " + coords.longitude.toString());
      xmlHttp.setRequestHeader("Username", username)
      xmlHttp.send(null);
      // if (SimpleMap.state.coords.length > 0) {
      //   return true;
      // }
      // return false;
      // return newcoords;
  }
  static createPoints(url, coords) {
      var coordsList = coords;
      for (var i = 0; i< coordsList.length + 1; i++) {
        
        SimpleMap.state.coords.push(<MyGreatPlace lat={coordsList[i].latitude} lng={coordsList[i].longitude} />);
      }
      // console.log(SimpleMap.state.coords);// SimpleMap.state.coords = coordsTable;
      
      

  }
  createTable = () => {
    let table = []
    // console.log(coordsList);
    
    // this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co");

    // setTimeout(function() {
    //   console.log(SimpleMap.state.coords);
    //   // for (var i = 0; i < 4; i++) {
    //   //   //Create the parent and add the childrene
    //   //   // table.push(<MyGreatPlace lat={coordsList.props.lat} lng={coordsList.props.lng} />);
    //   //   table.push(<MyGreatPlace lat={37.5042267 + i } lng={-121.9643745 + i} />);
        
    //   // }
  
    // }, 500);
    console.log(SimpleMap.state.coords.length);
    for (var i = 0; i < SimpleMap.state.coords.length; i++) {
      //Create the parent and add the childrene
      // table.push(<MyGreatPlace lat={coordsList.props.lat} lng={coordsList.props.lng} />);
      table.push(<MyGreatPlace key={i} lat={SimpleMap.state.coords[i].latitude} lng={SimpleMap.state.coords[i].longitude} />);
      console.log("Coords: Latitude - " + SimpleMap.state.coords[i].latitude.toString() + " Longitude - " + SimpleMap.state.coords[i].longitude.toString());
      
      
    }
    console.log(table);
    
    return table;
    // console.log(SimpleMap.state.coords);
    // // Outer loop to create parent
    // for (var i = 0; i < 4; i++) {
    //   //Create the parent and add the childrene
    //   // table.push(<MyGreatPlace lat={coordsList.props.lat} lng={coordsList.props.lng} />);
    //   table.push(<MyGreatPlace lat={37.5042267 + i } lng={-121.9643745 + i} />);
      
    // }
    // return table
  }

  static defaultProps = {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 11
  };
  
  render() {
    // testing code
    // Geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude});
    //     sendCoords(this.state, "https://RawPythonTest.r2dev2bb8.repl.co");
    //   })
    // this.setState({latitude: this.props.latitude, longitude: this.props.longitude});
    // if (this.props.coords)  {
    //   sendCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co");
    //   console.log(getCoords(this.prop]
   
    return !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
  ) : !this.props.isGeolocationEnabled ? (
      <div>Geolocation is not enabled</div>
  ) : this.props.coords && !this.state.loggedIn ? (

      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' , textalign: 'center'}}>
        <h1>Welcome to <b>CoronaSafe.</b></h1>
        <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
        <GoogleMapReact
          bootstrapURLKeys={{key: "AIzaSyDTz5KwujIjzE6RRCnaJ5ZoZSroy4vdz-0"}}
          defaultCenter={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}}
          defaultZoom={17}
        >
       
       {/* <MyGreatPlace lat={this.props.coords.latitude} lng={this.props.coords.longitude} />  */}
          {/* {this.createTable(SimpleMap.state.coords)} */}
          {/* {this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co")} */}
          {/* {this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co")} */}
          {/* {this.createTable()} */}
          {/* <AnyReactComponent
            lat={this.state.latitude}
            lng={this.state.longitude}
            text="My Marker"
          />  */}
        </GoogleMapReact>
      </div>
  ) : this.props.coords && this.state.loggedIn && !this.state.map ? (
    <div style={{ height: '100vh', width: '100%' , textAlign: 'center', marginTop: 'auto', marginBottom: 'auto'}}>
      <h1>Welcome to CoronaSafe, {this.state.value}.</h1>
      <button onClick={this.toggleMap}>Show Map</button>
    </div>
  ) : this.props.coords && this.state.loggedIn && this.state.map ? ( 
    <div style={{ height: '100vh', width: '100%' , textAlign: 'center', marginTop: 'auto', marginBottom: 'auto'}}>
      <h1>Welcome to CoronaSafe, {this.state.value}.</h1>
      <h2>Cases near you below...</h2>
      <button onClick={gotCorona(this.props.coords,"https://RawPythonTest.r2dev2bb8.repl.co", this.state.value)}>I Got Corona</button>
      <GoogleMapReact
          bootstrapURLKeys={{key: "AIzaSyDTz5KwujIjzE6RRCnaJ5ZoZSroy4vdz-0"}}
          defaultCenter={{lat: this.props.coords.latitude, lng: this.props.coords.longitude}}
          defaultZoom={14}
        >
       {this.createTable()}
       {/* <MyGreatPlace lat={this.props.coords.latitude} lng={this.props.coords.longitude} />  */}
          {/* {this.createTable(SimpleMap.state.coords)} */}
          {/* {this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co")} */}
          {/* {this.getCoords(this.props.coords, "https://RawPythonTest.r2dev2bb8.repl.co")} */}
          {/* {this.createTable()} */}
          {/* <AnyReactComponent
            lat={this.state.latitude}
            lng={this.state.longitude}
            text="My Marker"
          />  */}
        </GoogleMapReact>
    </div>
  ) : (
        <div>Getting the location data&hellip; </div>
    );
  }
}

export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(SimpleMap);