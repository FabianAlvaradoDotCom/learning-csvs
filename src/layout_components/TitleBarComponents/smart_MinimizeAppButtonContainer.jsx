import React, { useState } from "react";
const remote = require("electron").remote;

const MinimizeAppButton = props => {
  //
  // Using array destructuring I will extract the 2 elements of the array and name them as I want:
  const [minimize_btn_state, setMinimizeBtnState] = useState({
    custom_buttom_style: { backgroundColor: "transparent" }
  });

  // We are going to implement a checking before minimizing, as it will not be allowed to minimize the application while the reading process is on
  const mouseClickHandler = () => {
    //
    setMinimizeBtnState({
      custom_buttom_style: {
        backgroundColor: "transparent",
        color: "#777"
      }
    });
    remote.getCurrentWindow().minimize();
    
  };
  
  /*
    We need to define the hover behaviour manually as when we use the standard implementation
    the hover state is retained when the window minimizes hence when we restore the window the button is still in hver state until we do hover anywhere on the app.
  */ 
  const mouseEnterHandler = () => {
    setMinimizeBtnState({
      custom_buttom_style: {
        backgroundColor: "#555",
        color: "#fff"
      }
    });
  };  

  const mouseLeaveHandler = () => {
    setMinimizeBtnState({
      custom_buttom_style: {
        backgroundColor: "transparent",
        color: "#777"
      }
    });
  };

  return (
    <div className="button_style" id="minimize-app-button"
      style={minimize_btn_state.custom_buttom_style}
      onMouseEnter={mouseEnterHandler}
      onClick={mouseClickHandler}
      onMouseLeave={mouseLeaveHandler} >
      &#128469;
    </div>
  );
};

export default MinimizeAppButton;
