import React, { Component } from "react";
import "./App.css";
import WeatherComponent from "./components/weather-component";
import InputComponent from "./components/input-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.min.css";

const api_key = process.env.REACT_APP_WEATHERAPI_KEY;

class App extends Component {
  state = {
    weatherData: [],
    error: false,
    icon: "",
  };

  getWeatherData = async (event) => {
    event.preventDefault();
    const city = event.target.city.value;
    const country = event.target.country.value;

    this.weatherIcon = {
      Thunderstrom: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmostphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };
    if (city && country) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api_key}`
      );
      const response = await api_call.json();
      console.log(response);

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
      this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
    } else {
      this.setState({
        error: true,
      });
    }
  };

  convertKtoF = (temp) => {
    const celsius = temp - 273;
    const fahrenheit = celsius * (9 / 5) + 32;
    return Math.round(fahrenheit, 2);
  };

  getWeatherIcon = (icon, rangeId) => {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstrom });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: this.weatherIcon.Atmostphere });
        break;
      case rangeId === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
    }
  };

  render() {
    const makeInfo = this.state.weatherData.map((data, index) => {
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
          <div className="weather-card">{makeInfo}</div>
        </div>
      </div>
    );
  }
}

export default App;
