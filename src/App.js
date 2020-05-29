import React, { Component } from "react";
import "./App.css";
import WeatherComponent from "./components/weather-component";
import InputComponent from "./components/input-component";
import currentLocationComponent from "./components/current-location-component";
import "bootstrap/dist/css/bootstrap.min.css";
import mainLogo from "./images/weatherman-logo.png";

const api_key = process.env.REACT_APP_WEATHERAPI_KEY;
const api_url = "http://api.openweathermap.org/data/2.5/weather?";
class App extends Component {
  state = {
    weatherData: [],
    error: false,
    errorState: false,
    icon: "",
    position: {
      latitude: null,
      longitude: null,
    },
    locationError: false,
  };

  getPosition = (position) => {
    console.log(position);
    this.setState({
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    this.getLocalWeather();
  };

  getLocation = () => {
    let positionOptions = {
      timeout: Infinity,
      maximumAge: 0,
      enableHighAccuracy: true,
    };

    navigator.geolocation.getCurrentPosition(
      this.getPosition,
      this.catchError,
      positionOptions
    );
  };

  componentDidMount() {
    this.getLocation();
  }

  setWeatherData = (response) => {
    const weatherInfo = {
      city: response.name,
      country: response.sys.country,
      temp: this.convertKtoF(response.main.temp),
      minTemp: this.convertKtoF(response.main.temp_min),
      maxTemp: this.convertKtoF(response.main.temp_max),
      weather: response.weather[0].main,
      icon: response.weather[0].icon,
      backdrop: this.weatherBackground(response.main.temp),
    };
    this.setState({
      weatherData: [...this.state.weatherData, weatherInfo],
      error: false,
    });
  };

  weatherBackground = (temp) => {
    let backgroundSet = "";
    if (temp < 40) {
      backgroundSet = "snow-day";
    } else if (temp > 40 && temp <= 65) {
      backgroundSet = "spring-day";
    } else if (temp > 65) {
      backgroundSet = "summer-day";
    }
    return backgroundSet;
  };

  getLocalWeather = async () => {
    if (navigator.geolocation) {
      const api_call_location = await fetch(
        `${api_url}lat=${this.state.position.latitude}&lon=${this.state.position.longitude}&appid=${api_key}`
      );
      const response = await api_call_location.json();
      this.setWeatherData(response);
    } else {
      console.log("Oops! This Browser does not support HTML Geolocation!");
    }
  };

  catchError = (positionError) => {
    console.log(positionError.code);
    switch (positionError.code) {
      case positionError.TIMEOUT:
        this.setState({
          errorState: true,
          locationError:
            "Request Timeout: The request to get user location has aborted as it has taken too long.",
        });
        break;
      case positionError.POSITION_UNAVAILABLE:
        this.setState({
          errorState: true,
          locationError: "Warning: Location information is not available.",
        });
        break;
      case positionError.PERMISSION_DENIED:
        this.setState({
          errorState: true,
          locationError:
            "Warning: Couldn't find Current location as user denied permissions",
        });
        break;
      default:
        this.setState({
          errorState: true,
          locationError: "Error: Unknown Error Occured",
        });
    }
  };

  getWeatherData = async (event) => {
    event.preventDefault();
    const city = event.target.city.value;
    const country = event.target.country.value;
    let api_call;
    if (city && country) {
      api_call = await fetch(`${api_url}q=${city},${country}&appid=${api_key}`)
        .then((response) => {
          if (response.status !== 200) {
            this.setState({
              error: true,
            });
          }
          return response.json();
        })
        .then((res) => {
          this.setWeatherData(res);
        })
        .catch((err) => console.log("Error calling API: " + err.message));
    }
  };

  convertKtoF = (temp) => {
    const celsius = temp - 273;
    const fahrenheit = celsius * (9 / 5) + 32;
    return Math.round(fahrenheit, 2);
  };

  render() {
    const showWeatherInfo = this.state.weatherData.map((data, index) => {
      return (
        <WeatherComponent
          city={data.city}
          country={data.country}
          temp={data.temp}
          minTemp={data.minTemp}
          maxTemp={data.maxTemp}
          weather={data.weather}
          error={data.error}
          icon={data.icon}
          key={index}
          card={index}
          locationError={this.state.errorState}
          background={data.backdrop}
        />
      );
    });

    return (
      <div className="App">
        <div className="container input-container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <img
                src={mainLogo}
                width="350px"
                height="100px"
                alt="WeatherMan Application"
              />
            </div>
          </div>
          <div className="row">
            <InputComponent getWeather={this.getWeatherData} />
          </div>
          <div className="row">
            {this.state.error && (
              <div className="col-sm-6 offset-2  mt-4">
                <h6 className="error">
                  Error: Please Enter City and Country correctly!
                </h6>
              </div>
            )}
            {this.state.locationError && (
              <div className="col-sm-6 offset-2 mt-4">
                <h6 className="error">{this.state.locationError}</h6>
              </div>
            )}
          </div>
        </div>
        <div className="container background">
          <div
            className={
              this.state.weatherData.length > 3
                ? "weather-card left"
                : "weather-card"
            }
          >
            {showWeatherInfo}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
