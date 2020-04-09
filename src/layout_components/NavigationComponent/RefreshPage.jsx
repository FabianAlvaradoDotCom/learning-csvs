import React from 'react';
import { Redirect } from 'react-router-dom';

const RefreshPage = (props) => {

  //console.log(props.match.params.origin);
  return <Redirect to={`/${props.match.params.origin}`} />
};

export default RefreshPage;