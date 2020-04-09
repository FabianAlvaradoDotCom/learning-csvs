import React from "react";
import MinimizeAppButton from "./smart_MinimizeAppButtonContainer";
import MaximizeAppButton from "./MaximizeAppButtonContainer";
import CloseAppButton from "./CloseAppButtonComponent";
import DragDots from "./DragDotsComponent";


function TitleBarComponent() {
  return (
    <div id="title-bar-container">
      <div id='symbol-and-title' className="drag-bar-style">
        <div id="symbol"></div>
        &emsp;Smarty Pants
      </div>
      <MinimizeAppButton />
      <MaximizeAppButton />
      <CloseAppButton />
      <DragDots />
    </div>
  );
}

export default TitleBarComponent;
