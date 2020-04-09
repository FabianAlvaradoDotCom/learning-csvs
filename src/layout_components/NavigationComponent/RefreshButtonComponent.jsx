import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

const RefreshButtonComponent = () => {

  const [ redirect_state, setRedirectState ] = useState(null);

  const refreshButtonHandler = () => {
    
    const page_location = window.location.href;
    const starting_position = page_location.lastIndexOf("/");
    const current_page_href = page_location.substring(starting_position, page_location.length);
    
    setRedirectState( (prev) => {
      return <Redirect to={`/refresh${ current_page_href }`} />;
    });
  };

  return <Fragment>
    <button onClick={refreshButtonHandler} id="refresh-page-button">&#11118; Refresh data</button>
    {redirect_state}
  </Fragment>
};

export default RefreshButtonComponent;