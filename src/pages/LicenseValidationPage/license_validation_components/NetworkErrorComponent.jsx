import React, { Fragment } from "react";
const path = require('path');

const NetworkErrorComponent = () => {
  return (
    <Fragment>
      <span className="error-icon-style"></span>
      <br />
      <span>
        There is an error connecting to the
        <br />
        database, please verify your internet
        <br />
        connection and try again.
        <br />
        <br />
        For further assistance please send an
        <br />
        email to: <b>support@SmartyPants.com</b>
        <br />
        or call: <b>+52 449 426 02 10</b>.
      </span>
    </Fragment>
  );
};

export default NetworkErrorComponent;


