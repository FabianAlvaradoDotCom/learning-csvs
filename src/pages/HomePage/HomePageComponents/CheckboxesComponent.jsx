'use strict';
import React, { Fragment, useState, useEffect, useContext } from "react";
const csvtojson = require('csvtojson');

// Local Database files
import { application_cards_path, subjects_list_file_name} from '../../../configs/configs';

import ApplicationContext from "../../../context_stores/ApplicationContext";

const CheckboxesComponent = props => {

   // This is for being able to manage waiting overlay screen, most precisely to remove it later.
   const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;
   const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;

  const [ list_of_checkboxes_state, setListOfCheckboxesState] = useState([]);

  const passCheckboxesStateToParent = () => {
    let array_of_subjects = [];

    let all_checkboxes = document.getElementsByTagName("input");

    for (let element of all_checkboxes) {
      if (element.checked) {
        array_of_subjects.push({ subject: element.id, folder: element.dataset.location });
      }
    }

    //console.log("Subjects checked", array_of_subjects);

    props.functionFromParent(array_of_subjects);
  };

  const creatingCheckboxesHTMLList = () => {
    let content_array = list_of_checkboxes_state.map((element, index) => {
      if ((index + 1) % 4 === 1) {
        return `<div id="transparent-title-tile" class="tiles-row">
      <div>
        <label for="${element.subject}">${element.subject}</label>
        <input type="checkbox" id="${element.subject}" data-location="${element.folder}"/>
      </div>`;
      }
      if ((index + 1) % 4 === 2 || (index + 1) % 4 === 3) {
        return `  <div>
        <label for="${element.subject}">${element.subject}</label>
        <input type="checkbox" id="${element.subject}" data-location="${element.folder}"/>
      </div>`;
      }
      if ((index + 1) % 4 === 0) {
        return `  <div>
        <label for="${element.subject}">${element.subject}</label>
        <input type="checkbox" id="${element.subject}" data-location="${element.folder}"/>
    </div>
    </div> <br/>`;
      }
    });

    if (list_of_checkboxes_state.length % 4 !== 0) content_array.push("</div>");

    return content_array.join(" ");
  };

  useEffect(() => {

    ( async ()=>{
      try {
        let list_of_subjects_from_csv = await csvtojson().fromFile(application_cards_path + subjects_list_file_name);
        console.log(list_of_subjects_from_csv);       

        setListOfCheckboxesState( (prev) => {
          return [...list_of_subjects_from_csv];
        });
        
      } catch (error) {
        console.log(error);
        setConfirmOverlayContextState(prev => {
          return {
            display_confirm_overlay: true,
            confirm_overlay_class_name: "close-app",
            purpose: "warning",
            confirm_overlay_message_title: "List of subjects does not exist",
            confirm_overlay_message:
              'List of subjects does not exist in the specific directory, please create it and try again',
            confirm_overlay_title_bar_text: "List of subjects does not exist",
            origin: "home",
            hide_cancel: true
          };
        });
      }
    })();

  }, [])

  return (
    <Fragment>
      <div dangerouslySetInnerHTML={{ __html: creatingCheckboxesHTMLList() }}></div>
      <br/>
      <div id="transparent-title-tile" className="tiles-row" style={{ justifyContent: "center" }}>
        <button id="start" className="dark-blue-button" onClick={passCheckboxesStateToParent}>
          Start
        </button>
      </div>
    </Fragment>
  );
};

export default CheckboxesComponent;