import React, { Fragment, useState, useEffect, useContext } from "react";

// Importing the Context Store created by us
import ApplicationContext from "../../context_stores/ApplicationContext";

// Importing date formatter
import { formattingDateNoSeconds } from "../../configs/configs";

const HeaderComponent = () => {
  // Accessing the useState data stored in the Context Store, for the SESSION DATA (waiting overlay status is also part of the context)
  const session_data_context = useContext(ApplicationContext)
    .session_data_getter;

  // Ths useState and useEffect controls the clock at the top right:
  const [clock_state, setClockState] = useState(formattingDateNoSeconds(Date.now()));

  useEffect(() => {
    let clock_interval = setInterval(() => {
      setClockState(prev => {
        return formattingDateNoSeconds(Date.now());
      });
    }, 10000);

    // Cleaning function
    return () => {
      clearInterval(clock_interval);
    };
  });

  return (
    <Fragment>      
      <div id="header">
        <pre id="user-fullname">
          {session_data_context.last_name +
            ", " +
            session_data_context.first_name}
        </pre>
        <pre id="user-type">{session_data_context.user_type}</pre>
        <div id="avatar-icon"></div>
        <pre id="date">{clock_state}</pre>
      </div>
    </Fragment>
  );
};

export default HeaderComponent;