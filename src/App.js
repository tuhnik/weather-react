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
    this.state = {inputValue: '', searchTerm: '', weatherData: null, error: null, isLoading: false, coord: {lat: 58.24, lon: 25.92},
    favs: ["Tarvastu, EE", "London, GB"]};
  }
  getWeatherData(str) {
    this.setState({isLoading: true})
    let url = "http://api.openweathermap.org/data/2.5/weather?units=metric&q="+ str +"&appid=" + KEYS.API_KEY
    if(str.match(/^lat=/i)) {
      url = "http://api.openweathermap.org/data/2.5/weather?units=metric&"+ str +"&appid=" + KEYS.API_KEY
    }
    fetch(url)
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
  getGeoLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data)=>{
        this.getWeatherData("lat=" + data.coords.latitude + "&lon=" + data.coords.longitude)
      });
    }
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
  addToFavs(){
    let fav = this.state.weatherData.name + ", " + this.state.weatherData.sys.country
    let favs = [...this.state.favs]
    if(favs.indexOf(fav) < 0){
      favs.push(fav)
      this.setState({favs})
    }  
  }

  removeFromFavs(evt, i){
    evt.stopPropagation()
    let favs = [...this.state.favs]
    favs.splice(i, 1)
      this.setState({favs})
  }

  checkIfFavs(){
    let fav = this.state.weatherData.name + ", " + this.state.weatherData.sys.country
    let favs = [...this.state.favs]
    if(favs.indexOf(fav) < 0){
      return true
    }  
    return false
  }

  render() {
    return <div className="App container">
        <h1 className= "title is-2"> <span style = {{cursor: "pointer"}}onClick={this.getGeoLocation.bind(this)}>☁️</span> React Weather 0.2</h1>   
        <InputForm formSubmitted={this.formSubmitted.bind(this)} inputChanged={this.inputChanged.bind(this)} inputValue={this.state.inputValue} placeholder="Enter city" isLoading={this.state.isLoading} />
        <div className="block favs">
      {this.state.favs.map((el, i)=>{
          return <span key = {i} onClick={()=>this.getWeatherData(el)} className="tag light">
            {el}
            <button className="delete is-small" onClick={(evt)=>this.removeFromFavs(evt,i)}></button>
          </span>
      })}
       </div>
        {this.state.weatherData &&       <div className="card card-container">
          <div className="card-image">
            {this.state.coord && <Map isMarkerShown coord={this.state.coord} googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + KEYS.MAPS_KEY + "&v=3.exp&libraries=geometry,drawing,places"} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `400px` }} />} mapElement={<div style={{ height: `100%` }} />} />}
            <div className="card-content">
              <div className="media">
                <div className="media-left degrees"> 
                <p>{+(this.state.weatherData.main.temp).toFixed(1) + "°C"}</p>
                </div>
                <div className="media-content">
                  <p className="title is-4">{
                    this.state.weatherData.name + ", " + this.state.weatherData.sys.country}</p>
                  <p className="subtitle is-5 weather-string">{this.state.weatherData.weather[0].description}</p>
                </div>
                {this.checkIfFavs() && <a className="button is-info" onClick={this.addToFavs.bind(this)}>Fav</a>}              
              </div>
              <div className="content">
              </div>
            </div>
          </div>
        </div>}
        {this.state.error &&   
        <div className="notification is-danger error">{this.state.error.message}</div>
        }
      </div>;
  }
}

export default App;
