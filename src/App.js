import React, { Component } from "react";
import "./App.css";
import WeatherComponent from "./components/weather-component";
import InputComponent from "./components/input-component";
import "bootstrap/dist/css/bootstrap.min.css";
import mainLogo from "./images/weatherman-logo.png";

const api_key = process.env.REACT_APP_WEATHERAPI_KEY;
const api_url = "http://api.openweathermap.org/data/2.5/weather?";
const ipstack_Key = process.env.REACT_APP_IPSTACK_API_USER_KEY;
const ipstack_api_url = "http://api.ipstack.com/";

class App extends Component {
  state = {
    weatherData: [],
    error: false,
    errorState: false,
    icon: "",
    position: {
      latitude: null,
      longitude: null,
      userIp: null,
      city: null,
      country: null,
      flag: null,
    },
    locationError: false,
  };

  getPosition = (position) => {
    this.setState({
      position: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    this.getLocalWeather();
  };

  getUserIP = async () => {
    const userIPAPI = await fetch("https://api.ipify.org/?format=json");
    const api_response = await userIPAPI.json();
    const fetchLocationInfo = await fetch(
      `${ipstack_api_url}${api_response.ip}?access_key=${ipstack_Key}`
    );
    const locationResponse = await fetchLocationInfo.json();
    if (api_response.ip) {
      this.setState({
        position: {
          userIp: api_response.ip,
          city: locationResponse.city,
          country: locationResponse.country,
          flag: locationResponse.location.country_flag_emoji,
        },
      });
      this.callWeatherAPI(
        this.state.position.city,
        this.state.position.country
      );
    }
  };
  getLocation = () => {
    let positionOptions = {
      timeout: 10000,
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
    //this.getUserIP();
  }

  closeWidget = (index) => {
    const weatherData = this.state.weatherData;
    weatherData.splice(index, 1);
    this.setState({
      ...weatherData,
    });
  };

  //Data will be set to state from API response
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

  //Change background based on temperature
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

  //get local weather co ordinates and call api with latitude and longitude
  getLocalWeather = async () => {
    if (navigator.geolocation) {
      const api_call_location = await fetch(
        `${api_url}&lat=${this.state.position.latitude}&lon=${this.state.position.longitude}&appid=${api_key}`
      );
      const response = await api_call_location.json();
      this.setWeatherData(response);
    } else {
      console.log("Oops! This Browser does not support HTML Geolocation!");
    }
  };

  //catch any errors for local weather if user dont allow geo location access / other errors
  catchError = (positionError) => {
    this.getUserIP();
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

  callWeatherAPI = async (city, country) => {
    const api_call = await fetch(
      `${api_url}q=${city},${country}&appid=${api_key}`
    )
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
  };
  //call api using user input
  getWeatherData = async (event) => {
    event.preventDefault();
    const city = event.target.city.value;
    const country = event.target.country.value;
    if (city && country) {
      this.callWeatherAPI(city, country);
    }
  };

  //To convert weather to Fahrenheit based on API response
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
          closeAction={() => this.closeWidget(index)}
        />
      );
    });

    return (
      <div className="App">
        <div className="container input-container">
          <div className="row">
            <div className="col-xs-12 mb-3">
              <img
                src={mainLogo}
                width="420px"
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
