import React, { Fragment, useState, useEffect } from "react";
const remote = require("electron").remote;

const MinimizeAppButton = props => {
  const [maximize_icon_state, setMaximizeIconState] = useState(
    <Fragment>&#128470;</Fragment>
  );

  // With this function we manage the maximize and unmaximize process, icons are updated by useEffect down below.
  const mouseClickHandler = () => {
    if (remote.getCurrentWindow().isMaximized() === false) {
      remote.getCurrentWindow().maximize();
    } else {
      remote.getCurrentWindow().unmaximize();
    }
  };

  useEffect(() => {
    // This function shows the right icon depending on the maximize status of the screen, as it is within a useEffect, it checks for it on every render cycle.
    remote.getCurrentWindow().on("resize", () => {
      if (remote.getCurrentWindow().isMaximized()) {
        setMaximizeIconState(prev => {
          return <Fragment>&#128471;</Fragment>;
        });
      } else {
        setMaximizeIconState(prev => {
          return <Fragment>&#128470;</Fragment>;
        });
      }
    });
  }, []);

  return (
    <div
      className="button_style"
      id="maximize-app-button"
      onClick={mouseClickHandler}
    >
      {maximize_icon_state}
    </div>
  );
};

export default MinimizeAppButton;
