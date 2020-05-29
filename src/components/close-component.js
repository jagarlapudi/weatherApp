import React from "react";

const closeButtonComponent = (props) => {
  return (
    <div>
      <div
        name="close"
        className="close-button"
        onClick={() => closeDiv(props.removewidget)}
      >
        Clear
      </div>
    </div>
  );
};

const closeDiv = (index) => {
  let widgets = this.state.weatherData.slice();
  widgets.splice(index, 1);
  this.setState({
    widgets,
  });
  console.log("Close me: " + widgets);
};
export default closeButtonComponent;
