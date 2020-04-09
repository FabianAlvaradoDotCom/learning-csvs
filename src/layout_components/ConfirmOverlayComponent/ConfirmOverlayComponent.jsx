import React, { useContext, useEffect } from "react";

import ApplicationContext from "../../context_stores/ApplicationContext";

const ConfirmOverlayComponent = props => {
  //
  const confirm_overlay_state = useContext(ApplicationContext).confirm_overlay_getter;
  const setConfirmOverlayState = useContext(ApplicationContext).confirmOverlaySetter;

  let confirm_existence;

  // When the accept button is clicked, we remove the overlay but we save as payload the origin of the 'setConfirmOverlayState' so the caller component can track it and respond accordingly
  const onAcceptHandler = () => {
    //
    setConfirmOverlayState( (prev) => {
      return { display_confirm_overlay: false, confirm_overlay_class_name: '', confirm_overlay_message: '', payload: prev.origin};
    });
  }

  // If the cancell button is clicked we just remove the overlay without doing anything else
  const onCancelHandler = () => {
    //
    setConfirmOverlayState( (prev) => {
      return { display_confirm_overlay: false, confirm_overlay_class_name: '', confirm_overlay_message: ''};
    });
  }

  // If the latest context state saving is 'display_confirm_overlay: true', then we show it, else it is removed from DOM
  if (confirm_overlay_state.display_confirm_overlay) {
    confirm_existence = (
      <div id="confirm-overlay">
        <div id="confirm-message-box" className={confirm_overlay_state.purpose}>
          <div id="confirm-overlay-title">
            <span className="confirm-overlay-titlebar-icon"></span>
            {confirm_overlay_state.confirm_overlay_title_bar_text}
          </div>
          <div id="confirm-overlay-header">
            <span
              className="confirm-overlay-icon"
              id={`${confirm_overlay_state.confirm_overlay_class_name}`}
            ></span>
            <h5 className="confirm-overlay-h5">{confirm_overlay_state.confirm_overlay_message_title}</h5>
          </div>
          <p id="confirm-event-description">
            {confirm_overlay_state.confirm_overlay_message}
          </p>
          <div id="buttons-bar">
            <button onClick={onAcceptHandler} autoFocus>Accept</button>&emsp;
            {confirm_overlay_state.hide_cancel ? null : <button onClick={onCancelHandler}>Cancel</button>}
          </div>          
        </div>
      </div>
    );
  } else {
    confirm_existence = null;
  }

  return confirm_existence;
};

export default ConfirmOverlayComponent;