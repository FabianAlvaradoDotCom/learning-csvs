import React, { useState, useEffect, useContext } from "react";
import ApplicationContext from "../../context_stores/ApplicationContext";
import { Redirect } from 'react-router-dom';

// Importing the components to content for license and network errors:
import InvalidLicenseComponent from './license_validation_components/InvalidLicenseComponent';
import NetworkErrorComponent from './license_validation_components/NetworkErrorComponent';

// Getting configuration details
import { server_url, license } from "../../configs/configs";

// For this component it will be necessary to import a macaddress library
const mac_address_library = require("macaddress");
const pc_mac_address = mac_address_library.one(function(err, mac) {
  console.log(pc_mac_address);
  return mac;
});

const LicenseValidationPage = () => {
  // This statement handles the setter status of the session data
  const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;
  
  // Variable that will contain the component to show in case there is an error with license, or that will contain the redirect for the next component if license is valid.
  const [license_validation_results_state, setLicenseValidationResultsState] = useState('');

  // We send local pc data to remote API and retrieve data indicating whether or not the license is valid
  const fetchLicense = async () => {
    try {
      const fetched_licence = await fetch(`${server_url}/validate-license`, {
        method: "POST", // or 'PUT'
        body: JSON.stringify({
          hardcoded_license: license,
          pc_mac_address//: "40:9f:38:38:46:6" // "40:9f:38:38:46:63"
        }), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json"
        }
      });

      const json_fetched_license = await fetched_licence.json();

      if (json_fetched_license.valid_license) {

        // By doing this we tell the App what next component to load is, to close waiting overlay, and its waiting message text.
        //props.parentsComponentsUpdate("credentials-verification", false, "Verifying user credentials...");
        console.log(json_fetched_license);       

        // If license is valid we save session data on local storage for access further functionality
        localStorage.setItem("valid_license", true);
        localStorage.setItem("equipment_name", json_fetched_license.equipment_name);
        localStorage.setItem("equipment_id", json_fetched_license.equipment_id);
        localStorage.setItem("capturing_intervals", json_fetched_license.capturing_intervals);        

        // We remove the waiting overlay before any redirect
        setWaitingOverlayContextState( (prev) => {
          return {display_waiting_overlay: false, waiting_overlay_class_name: '', waiting_overlay_message: ''};
        });

        // As the license is valid, we are redirecting to login page.  
        setLicenseValidationResultsState( (prev) => {
          return (<Redirect to="/login"></Redirect>);
        });
        
      } else {
        // We remove the Waiting Overlay. The 2nd and 3rd array elements have no effect.
        setWaitingOverlayContextState( (prev) => {
          return {display_waiting_overlay: false, waiting_overlay_class_name: '', waiting_overlay_message: ''};
        });
        
        // If license is invalid we put some content in the component to describe it:        
        setLicenseValidationResultsState( (prev) => {
          return <InvalidLicenseComponent />;
        });  

        console.log("Not VALID");
      }
    } catch (error) {
      // If there is any network error we put some content in the component to describe it:     
      console.log(error);

      // We remove the Waiting Overlay. The 2nd and 3rd array elements have no effect.
      setWaitingOverlayContextState( (prev) => {
        return {display_waiting_overlay: false, waiting_overlay_class_name: '', waiting_overlay_message: ''};
      });
      
      // If there is a network error we put some content in the component to describe it:
      setLicenseValidationResultsState( (prev) => {
        return <NetworkErrorComponent />;
      });   
    }     
  };

  // We fetch the licence from the server only after the component has been created:
  useEffect(() => {
    // Before executing this method we make sure that this is the first and only time it runs, by including an empty array dependency list, hence we will enter into an endless loop
    fetchLicense();
  }, []);

  return <main className="error-page">{license_validation_results_state}</main>;
};

export default LicenseValidationPage;
