// LoginFormComponent.jsx - This component is in charge of the form and its logic, it does not handle anything of the login, that is managed by its parent page.

import React, { useState, useEffect, useRef } from "react";
const path = require("path");

const LoginFormComponent = props => {
  // Creating the references to the inputs so we can move focus across
  const $email_input_ref = useRef();
  const $password_input_ref = useRef();
  const $submit_input_ref = useRef();

  // Creating an array that will hold the refs to inputs so we can iterate them as an array. IT IS NECESSARY TO USE 'useEffect' AS THE PAGE (COMPONENT) RE RENDERS AND A SIMPLE 'VAR' OR 'LET' WILL NOT HOLD THE VALUE IN MULTIPLE RE-RENDERS.
  const [ array_of_input_refs, setArrayOfRefs ] = useState([]);

  //As the refs are assigned after the DOM as been created, we fill the array with the ref CURRENTs (ref.current) which are html elements, and we do it after the component has been rendered, with useEffect:
  useEffect(() => {
    setArrayOfRefs(prev => {
      return [ $email_input_ref.current, $password_input_ref.current, $submit_input_ref.current ];
    });

    // And in addition we set focus on the first field when the form has loaded
    $email_input_ref.current.focus();

    // Executed before component unmounting
    return () => {
      console.log("On dismount");
    };
  }, []);

  // Cancelling form submission on enter or any default action
  const onFormSubmition = e => {
    e.preventDefault();
  };

  const signInDataSubmit = () => {
    // We change focus to first input in case the login fails so it is ready to receive new credentials
    $email_input_ref.current.focus();

    // Then we execute API request function FROM PARENT
    props.apiRequestFromParent($email_input_ref.current.value, $password_input_ref.current.value);
  };

  const onKeyDownHandler = e => {
    // If the key pressed is 'Enter' or 'Down arrow'...
    if (e.keyCode === 13 || e.keyCode === 40) {
      // In this 'If' we do several things:
      // 1.- From the array of elements referenced with ref.current, we get the index of the element that matches the target of the key press
      // 2.- If the element of the array is not the last one, we perform the actions
      e.preventDefault();
      if ( array_of_input_refs.indexOf(e.target) < array_of_input_refs.length - 1 ) {
        // We set focus on the next element
        array_of_input_refs[array_of_input_refs.indexOf(e.target) + 1].focus();
      } else {
        // We verify first that the key pressed is down arrow.
        if (e.keyCode === 40) {
          // If the element is the last element of the array, we set focus on the first element:
          array_of_input_refs[0].focus();

          // If the key is enter we will send a request to the server for authentication
        } else {
          signInDataSubmit();
        }
      }

      // We do a similiar thing an move focus up above if the pressed key was up arrow
    } else if (e.keyCode === 38) {
      e.preventDefault();
      if (array_of_input_refs.indexOf(e.target) === 0) {
        array_of_input_refs[array_of_input_refs.length - 1].focus();
      } else {
        array_of_input_refs[array_of_input_refs.indexOf(e.target) - 1].focus();
      }
    }
  };

  return (
    <main id="login-form-page">
      <form id="login-form" onSubmit={onFormSubmition} noValidate>
        <input type="email" placeholder="Please enter your email" minLength="6" onKeyDown={onKeyDownHandler} ref={$email_input_ref} />
        <input type="password" rel="login-password" type="password" placeholder="and password" onKeyDown={onKeyDownHandler} ref={$password_input_ref} />
        <input type="submit" value="Sign in" onKeyDown={onKeyDownHandler} onClick={signInDataSubmit} ref={$submit_input_ref} />
      </form>
    </main>
  );
};

export default LoginFormComponent;
