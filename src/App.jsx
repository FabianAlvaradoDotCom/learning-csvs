
/*

TRYGIN TP SIMULATE 

Pending:
  create an external component to format date

*/
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";

// It is not necessary to import 'useContext' here because we are not consuming it yet, we need only to import the file that manages it.
// Importing the context storer file created by us
import ApplicationContext from "./context_stores/ApplicationContext";

const initial_waiting_overlay_status= {
  display_waiting_overlay: true,
  waiting_overlay_class_name: 'license-verification',
  waiting_overlay_message: 'Please wait, validating license...'
};

const initial_confirm_overlay_state= {
  display_confirm_overlay: false,
  confirm_overlay_class_name: '',
  confirm_overlay_message: '',
  payload:'',
  origin:''
};

// Before any processing we clear the LocalStorage
localStorage.clear();

const App = () => {
  //
  // Creating the global store state for session data (user, license, address, etc.):
  const [ session_data_context_state, setSessionDataContextState ] = useState( { last_name: "LastName", first_name: "FirstName", user_type: "Student"} ); // For managing Session data
  const [ waiting_overlay_context_state, setWaitingOverlayContextState ] = useState(initial_waiting_overlay_status); // For managing Wainting screen state
  const [ confirm_overlay_context_state, setConfirmOverlayContextState ] = useState(initial_confirm_overlay_state); // For managing Confirm screen state
  const [ questions_ids_list_context_state, setQuestionsIDsListContextState ] = useState([]); // For managing Confirm screen state

  return (
    <BrowserRouter>
      <ApplicationContext.Provider value={
        {
          session_data_getter: session_data_context_state,
          sessionDataSetter: setSessionDataContextState,
          waiting_overlay_getter: waiting_overlay_context_state,
          waitingOverlaySetter: setWaitingOverlayContextState,
          confirm_overlay_getter: confirm_overlay_context_state,
          confirmOverlaySetter: setConfirmOverlayContextState,
          questions_ids_list_getter: questions_ids_list_context_state,
          questionsIDsListSetter: setQuestionsIDsListContextState
        }
      } >
        <Layout />
      </ApplicationContext.Provider>
    </BrowserRouter>
  );
};

export default App;





/*
Updates made to fix the pausing animations because of inactivity issue:
  minimizable: false
  alwaysOnTop: true
  Commenting out minimizing function from smart_MinimizeAppButtonContainer.jsx, line 31
  Replacing the timeout by interval as per some recommendation, CountDownComponent.jsx, lines 143 and 150

Commented out devModeTools in main.js line 49 For prod

Adding context menu

Updated initial position to be right-bottom.

-- Added noValidate attribute so it does not show the yellow box


*/