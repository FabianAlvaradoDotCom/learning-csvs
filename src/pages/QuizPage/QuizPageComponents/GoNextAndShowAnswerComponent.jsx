import React from 'react';

const GoNextAndShowAnswerComponent = (props) => {

  return(
    <button onClick={props.goNextShow} id="go-next-show">Mark complete, go next and show answer</button>
  );

}

export default GoNextAndShowAnswerComponent;