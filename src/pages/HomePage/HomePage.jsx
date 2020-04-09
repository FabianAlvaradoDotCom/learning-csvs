// Added comments
import React, { useEffect, useLayoutEffect, useState, useContext, useRef } from "react";
import { Redirect } from 'react-router-dom';

import { application_cards_path, subjects_list_file_name} from '../../configs/configs';

const fs = require('fs');

import ApplicationContext from "../../context_stores/ApplicationContext";
import RefreshButtonComponent from '../../layout_components/NavigationComponent/RefreshButtonComponent';

import CheckboxesComponent from './HomePageComponents/CheckboxesComponent';

import { server_url } from '../../configs/configs';


const HomePage = () => {

   // This is for being able to manage waiting overlay screen, most precisely to remove it later.
   const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;
   const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;

  // Redirect to handle the redirect when it is time
   const [ redirect_state, setRedirectState ] = useState(null);

   // This will store the list of ids for opening questions
   //const questions_ids_list_context_state = useContext(ApplicationContext).questions_ids_list_getter;

   const setQuestionsIDsListContextState = useContext(ApplicationContext).questionsIDsListSetter; 


  useLayoutEffect( () => {
    setWaitingOverlayContextState( (prev) => {
      return {display_waiting_overlay: true, waiting_overlay_class_name: 'fetching-dashboard', waiting_overlay_message: 'Fetching data from server...'};
    });
  }, []);


const fetchQuestionsHandler = async (array_of_subjects) => {  

  if(array_of_subjects.length === 0){
    return;
  }else{

    // setWaitingOverlayContextState( (prev) => {
    //   return {display_waiting_overlay: true, waiting_overlay_class_name: 'fetching-dashboard', waiting_overlay_message: 'Fetching data from server...'};
    // });
    
    try {

      // We create an array that will contain a list of question cards to later pick randmly
      let array_of_question_file_names = [];

      // From the array of subjects passed by the checkboxes, we will read the files in every folder corresponding to the list
      array_of_subjects.forEach((element) => {  

        // We read the directory and get an array with all files in it
        let subjects_in_folder_array = fs.readdirSync(application_cards_path + "/" + element.folder); 

        // As it will give the entire list, we remove the files that do not start with the folder name:
        let filtered_list = subjects_in_folder_array.filter( (file_element) => {
          return file_element.substring(0, file_element.indexOf("-")) === element.folder;
        });
        // Once we get the array containing the names of all files in the folder, we concatenate this with the ist that is holding the names of all files.
        array_of_question_file_names = array_of_question_file_names.concat(filtered_list);     

      });

      console.log(array_of_question_file_names);

      

      


    

      setQuestionsIDsListContextState( (prev) => {
        return [...array_of_question_file_names];
      });
   

      setRedirectState( (prev) => {
        return <Redirect to="/quiz" />;
      });

















    } catch (error) {
      console.log(error);

      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Connection error",
          confirm_overlay_message:
            'There was an error with the connection, please try again',
          confirm_overlay_title_bar_text: "Connection error",
          origin: "home",
          hide_cancel: true
        };
      });

      setWaitingOverlayContextState(prev => {
        return {
          display_waiting_overlay: false,
          waiting_overlay_class_name: "",
          waiting_overlay_message: ""
        };
      });
    }    
  }
}


  useEffect(() => {
    setWaitingOverlayContextState(prev => {
      return {
        display_waiting_overlay: false,
        waiting_overlay_class_name: "",
        waiting_overlay_message: ""
      };
    });   

    // Cleaning up D3 on leave
    return () => {
      console.log("Home unmounted");
    }
  }, []);

  return (
    <main id="home-page" className="internal-pages">
      <div id="transparent-title-tile" className="tiles-row">
        Home <RefreshButtonComponent />
      </div>
      <br />
      <CheckboxesComponent functionFromParent={fetchQuestionsHandler} />          
      <br /><br/>      
      {redirect_state}
    </main>
  );
};

export default HomePage;
