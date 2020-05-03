import React from "react";

const WeatherComponent = (props) => {
  const imgUrl = `http://openweathermap.org/img/wn/${props.icon}@2x.png`;
  return (
    <div className="col-md-4 col-sm-6 col-xs-12">
      {props.error ? (
        <div className="alert alert-danger mx-5" role="alert">
          Please Enter City and Country
        </div>
      ) : (
        <div className="weather-data">
          {props.city && props.country && (
            <div>
              <h2>
                {props.city},{props.country}
              </h2>
              <div className="weather-icon">
                <img src={`${imgUrl}`} alt={`${props.weather}`} />
              </div>
              <div className="weather-info">
                <h2>
                  {props.temp}&deg;F
                  <br />
                </h2>
                <h3> {props.weather}</h3>
                <h5>
                  <div className="temp">Min Temp: {props.minTemp}&deg;F</div>
                  <div className="temp">Max Temp: {props.maxTemp}&deg;F</div>
                </h5>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
