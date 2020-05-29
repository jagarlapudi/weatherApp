import React from "react";

const closeButtonComponent = (props) => {
  return (
    <div>
      <div
        name="close"
        className="close-button"
        onClick={() => this.closeDiv(props)}
      >
        Clear
      </div>
    </div>
  );
};

function closeDiv(props) {
  let widgets = props.weatherData;
  console.log("widgets : " + widgets + " " + props.index);
  //widgets.splice(index, 1);
  this.setState({
    ...widgets,
  });
  console.log("Close me: " + widgets);
}
export default closeButtonComponent;
