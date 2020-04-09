import React, { useEffect, useContext } from "react";

import { server_url } from '../../configs/configs'

import ApplicationContext from '../../context_stores/ApplicationContext';

// Importing electron and remote to have access to the node main process, to be able to close the app.
const remote = require("electron").remote;
const { app } = remote;

// Importing Radium to be able to implement pseudo selectors
import Radium from "radium";

// Creating the app to close the app


// Creating the component
const CloseAppButton = () => {
  //
  // Initializing contexts
  const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;
  const confirm_overlay_state = useContext(ApplicationContext).confirm_overlay_getter;
  const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;  

  // Managing the close button actions
  const closeAppHandler = () => {
    //
    // If a session is currently in use, there will be a token, so if no session is there the below executes
    if(!localStorage.getItem('token')){
      //
      // We add the waiting overlay to indicate that the app is closing
      setWaitingOverlayContextState( (prev) => {
        return  {display_waiting_overlay: true,
        waiting_overlay_class_name: 'license-verification',
        waiting_overlay_message: 'Closing application...'}
      });

      // We close the application directly with no other comprobations
      app.quit();

    // When there is a session we first open the warning
    }else{
      setConfirmOverlayContextState(prev => {
        return { display_confirm_overlay: true, confirm_overlay_class_name: 'close-app',  purpose: "warning", confirm_overlay_message_title: 'Closing Visualization Application', confirm_overlay_message: 'Please confirm you want to close the application.', confirm_overlay_title_bar_text: 'Closing App?', origin:'close-button', hide_cancel: false};
      });
    }    
  };

  // This executes when there was a token and the user confirmed they wanted to close.
  useEffect( () => {
    if(confirm_overlay_state.payload === 'close-button'){
      //
      // As there will be a fetch process, in the meantime we show the waiting overlay so user knows what happens
      setWaitingOverlayContextState( (prev) => {
        return  {display_waiting_overlay: true,
        waiting_overlay_class_name: 'license-verification',
        waiting_overlay_message: 'Closing application...'}
      });

      // Performing the server API call      
      ( async ()=>{
        try{
          const clearing_session_fetch = await fetch(server_url + '/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });          
          //const fetched_json_response = await clearing_session_fetch.json();          
          localStorage.clear();
          app.quit();

        }catch(error){
          console.log('There was an error when tried to remove the session from teh server');
          localStorage.clear();
          app.quit();
        }
      })();      
    }
  }, [confirm_overlay_state.payload]);

  return (
    <div className="button_style" id="close-app-button" onClick={closeAppHandler}>
      &#128473;
    </div>
  );
};

export default Radium(CloseAppButton);