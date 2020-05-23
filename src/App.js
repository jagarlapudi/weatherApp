import React, { Component } from "react";
import "./App.css";
import WeatherComponent from "./components/weather-component";
import InputComponent from "./components/input-component";
import "bootstrap/dist/css/bootstrap.min.css";

const api_key = process.env.REACT_APP_WEATHERAPI_KEY;
const api_url = "http://api.openweathermap.org/data/2.5/weather?";
class App extends Component {
  state = {
    weatherData: [],
    error: false,
    icon: "",
    position: {
      latitude: null,
      longitude: null,
    },
  };

  getCurrentLocation = () => {
    this.getCurrentPosition();
  };
  getCurrentPosition = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });

      this.getLocalWeather();
    });
  };

  componentDidMount() {
    this.getCurrentLocation();
  }

  setWeatherData = (response) => {
    const weatherInfo = {
      city: response.name,
      country: response.sys.country,
      temp: this.convertKtoF(response.main.temp),
      minTemp: this.convertKtoF(response.main.temp_min),
      maxTemp: this.convertKtoF(response.main.temp_max),
      weather: response.weather[0].description,
      icon: response.weather[0].icon,
    };
    this.setState({
      weatherData: [...this.state.weatherData, weatherInfo],
      error: false,
    });
  };

  getLocalWeather = async () => {
    if (navigator.geolocation) {
      const api_call_location = await fetch(
        `${api_url}lat=${this.state.position.latitude}&lon=${this.state.position.longitude}&appid=${api_key}`
      );
      const response = await api_call_location.json();
      this.setWeatherData(response);
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
        />
      );
    });

    return (
      <div className="App">
        <div className="container input-container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h1>Weather Application</h1>
            </div>
          </div>
          <div className="row">
            <InputComponent getWeather={this.getWeatherData} />
          </div>
          <div className="row">
            {this.state.error && (
              <div className="col-sm-6  mt-4">
                <h4 className="error">
                  Error: Please Enter City and Country correctly!
                </h4>
              </div>
            )}
          </div>
        </div>
        <div className="container">
          <div className="weather-card">{showWeatherInfo}</div>
        </div>
      </div>
    );
  }
}

export default App;
