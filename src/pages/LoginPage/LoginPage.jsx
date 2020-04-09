import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
const path = require("path");

// Importing the component which manages UI form behaviour
import LoginFormComponent from "./LoginPageComponents/LoginFormComponent";

// Importing the Context Handler
import ApplicationContext from "../../context_stores/ApplicationContext";

// Getting configuration details
import { server_url } from "../../configs/configs";

const LoginPage = () => {
  // Not Destructuring the getter and setter for the Waiting overlay context
  // Just pulling the Waiting Overlay Setter
  const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;

  // We need to import the confirm overlay to let user know in case credentials are invalid
  const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;
  
  // We also import the function to update the username:
  const setSessionDataContext = useContext(ApplicationContext).sessionDataSetter;



  // We create a variable that will hold the content that this page should render, the login form, and it will change if the API login request is successful, it will be then a redirect for the next component.
  const [LoginForm_State, setLoginForm_State] = useState('');
  
  // This makes and hadles the API login request, it is triggered by the child form component
  const signInDataSubmit = async (email, password) => {
    // Before anything we first confirm that the fileds have been filled out

    /* COMMENTING OUT FOR TESTING--------------------------------------------------
    if(email === "" || password === ""){
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Required fields",
          confirm_overlay_message: 'Please enter your user and password',
          confirm_overlay_title_bar_text: "Required fields",
          origin: "create-report",
          hide_cancel: true
        };
      });
      // We stop function excution with return
      return;
    }

    // Next we confirm that the email address is an email address
    if(email.indexOf("@") === -1 || email.indexOf(".") === -1){
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Email address is not valid",
          confirm_overlay_message: 'Please enter a valid email address',
          confirm_overlay_title_bar_text: "Email address is not valid",
          origin: "create-report",
          hide_cancel: true
        };
      });
      // We stop function excution with return
      return;
    }
  /* COMMENTING OUT FOR TESTING--------------------------------------------------*/


    // We add the waiting overlay while the request to API is performed
    setWaitingOverlayContextState( (prev) => {
      return {display_waiting_overlay: true, waiting_overlay_class_name: 'credentials-verification', waiting_overlay_message: 'Please wait, verifying credentials...'};
    });

    const credentials = {
      email: "1@1.com",
      password: "11111111",
     /* email,      
      password,*/
      equipment_id: localStorage.getItem("equipment_id")
    };

    try {
      // alert(email_input_ref.current.value + ' ' + password_input_ref.current.value);
      const authentication_fetch = await fetch(server_url + "/login-visualization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials) // data can be `string` or {object}!
      });

      const parsed_authentication_response = await authentication_fetch.json();

      if (parsed_authentication_response.user.email) {
        //
        // We first shorten these properties:
        const first_name = parsed_authentication_response.user.first_name;
        const last_name = parsed_authentication_response.user.last_name;
        const user_type = parsed_authentication_response.user.user_type;

        // As a valid account was found, we save the user details in the local storage for processing afterwards        
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("token", parsed_authentication_response.token);

        console.log(parsed_authentication_response);

        // We use the fetched data to put it into the Global Application Context so we can use it later:
        setSessionDataContext( (prev) => {
          return { first_name, last_name, user_type };
        });        

        // As the API login response has been successful, we need to unmount this component (page), we do so by redirecting:
        setLoginForm_State( (prev) => {
          return <Redirect exact to="/home" />
        });
      }
    } catch (error) {
      console.log(error);
      // Getting an error here means that the provided credentials are not correct.
      
      // First we remove the waiting overlay
      setWaitingOverlayContextState( (prev) => {
        return { display_waiting_overlay: false };
      });

      // Then we show the confirm overlay with the errro description 
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Entered credentials are not valid",
          confirm_overlay_message: 'The entered credentials are not valid, please verify your user and password',
          confirm_overlay_title_bar_text: "Entered credentials are not valid",
          origin: "create-report",
          hide_cancel: true
        };
      });
    }    
  };

  useEffect( () => {
    setLoginForm_State( (prev) => {
      return <LoginFormComponent apiRequestFromParent={signInDataSubmit} />
    });
  },[]);

  return LoginForm_State;

};

export default LoginPage;
