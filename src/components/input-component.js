import React from "react";
const InputComponent = (props) => {
  return (
    <div className="container">
      <form onSubmit={props.getWeather}>
        <div className="row">
          <div className="col-md-3 offset-md-2">
            <input
              className="form-control"
              type="text"
              name="city"
              id="city"
              placeholder="City"
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              name="country"
              id="country"
              placeholder="Country"
            />
          </div>

          <div className="col-md-3 top-padding-20">
            <button type="submit" className="btn btn-warning">
              Get Weather
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputComponent;
