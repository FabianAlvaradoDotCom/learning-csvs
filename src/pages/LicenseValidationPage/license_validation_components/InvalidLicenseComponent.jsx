import React, { Fragment } from "react";
const path = require('path');

const InvalidLicenseComponent = () => {
  return (
    <Fragment>
      <span className="error-icon-style" id="licence-error-icon"></span>
      <br />
      <span>
        The license of this software is not valid on
        <br />
        this computer. Please contact us for support,
        <br />
        we will be glad to help you configuring this
        <br />
        computer to access our systems:
        <br />
        <br />
        <b>support@SmartyPants.com</b>
        <br />
        or
        <br />
        <b>+52 449 426 02 10</b>.
      </span>
    </Fragment>
  );
};

export default InvalidLicenseComponent;