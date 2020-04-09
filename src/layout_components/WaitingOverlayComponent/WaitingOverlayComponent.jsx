import React, { useContext } from "react";
const path = require("path");

import ApplicationContext from "../../context_stores/ApplicationContext";

const WaitingOverlayComponent = props => {
  //
  const waiting_overlay_status = useContext(ApplicationContext).waiting_overlay_getter;
  
  let waiting_existence;


  if (waiting_overlay_status.display_waiting_overlay) {
    waiting_existence = (
      <div id="waiting-overlay" className={waiting_overlay_status.background_opacity}>
        <div id="waiting-message-box">
          <br />
          <br />
          <br />
          <span className="waiting-overlay-icon" id={`${waiting_overlay_status.waiting_overlay_class_name}`}></span>
          <br />
          <br />
          <span id="waiting-event-description">
            {waiting_overlay_status.waiting_overlay_message}
          </span>
          <div id="spinner"></div>
        </div>
      </div>
    );
  } else {
    waiting_existence = null;
  }

  return waiting_existence;
};

export default WaitingOverlayComponent;