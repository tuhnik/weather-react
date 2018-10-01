import React, { Component } from 'react';
import InputForm from './InputForm.js'
import './App.css';
import KEYS from './KEYS.js'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"



const Map = withScriptjs(withGoogleMap((props) => 
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: props.coord.lat, lng: props.coord.lon }}
    defaultOptions={{
     // these following 7 options turn certain controls off see link below
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      rotateControl: false,
      fullscreenControl: false
    }}
    center={{ lat: props.coord.lat, lng: props.coord.lon }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.coord.lat, lng: props.coord.lon }} />}
  </GoogleMap>

))

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {inputValue: '', searchTerm: '', weatherData: null, error: null, isLoading: false, coord: {lat: 58.24, lon: 25.92}};
  }
  getWeatherData(str) {
    this.setState({isLoading: true})
    fetch("http://api.openweathermap.org/data/2.5/weather?units=metric&q="+ str +"&appid=" + KEYS.API_KEY)
      .then(res => res.json())
      .then(
        (result) => {
          if(result.cod === "404"){
            this.setState({error: result, weatherData: null, isLoading: false, coord: null})
            return;
          }
          this.setState({
            weatherData: result,
            error: null,
            coord: result.coord,
            isLoading: false
          });
        
        },
        (error) => {
          this.setState({
            error, 
            isLoading: false,
            coord: null
          });
        })
  }
  formSubmitted(evt){
    evt.preventDefault()
    this.setState({searchTerm: this.state.inputValue})
    this.getWeatherData(this.state.inputValue)
    this.setState({inputValue: ''})
  }

  inputChanged(evt){
    this.setState({inputValue: evt.target.value})
  }

  render() {
    return <div className="App container">
        <h1 className= "title is-2"> ☁️ React Weather 0.2</h1> // eslint-disable-next-line
        <InputForm formSubmitted={this.formSubmitted.bind(this)} inputChanged={this.inputChanged.bind(this)} inputValue={this.state.inputValue} placeholder="Enter city" isLoading={this.state.isLoading} />
        {this.state.weatherData &&       <div className="card card-container">
          <div className="card-image">
            {this.state.coord && <Map isMarkerShown coord={this.state.coord} googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + KEYS.MAPS_KEY + "&v=3.exp&libraries=geometry,drawing,places"} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `400px` }} />} mapElement={<div style={{ height: `100%` }} />} />}
            <div className="card-content">
              <div className="media">
                <div className="media-left degrees"> 
                <p>{this.state.weatherData.main.temp + "°C"}</p>
                </div>
                <div className="media-content">
                  <p className="title is-4">{
                    this.state.weatherData.name + ", " + this.state.weatherData.sys.country}</p>
                  <p className="subtitle is-5 weather-string">{this.state.weatherData.weather[0].description}</p>
                </div>
              </div>
              <div className="content">
                
              </div>
            </div>
          </div>
        </div>}
        {this.state.error && 
      
        <div className="notification is-danger error">{this.state.error.message}</div>
      
        }
        {/* <div>
         {this.state.weatherData && <section className="section">{
          this.state.weatherData.name + ", " + this.state.weatherData.sys.country + " " + this.state.weatherData.main.temp + "°C"}</section>}     
         {this.state.error && <div className="notification is-danger">{this.state.error.message}</div>}
        </div>
          {this.state.coord && <Map      
            isMarkerShown
            coord = {this.state.coord}
            googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=" + KEYS.MAPS_KEY + "&v=3.exp&libraries=geometry,drawing,places"} 
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />}      */}
      </div>;
  }
}

export default App;
