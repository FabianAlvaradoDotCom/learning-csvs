import React, { useState, useEffect, useContext } from "react";

import { server_url } from '../../../configs/configs';

import ApplicationContext from '../../../context_stores/ApplicationContext';

const QuestionsListComponent = (props) => {

  // Global context  
   // This is for being able to manage waiting overlay screen, most precisely to remove it later.
   const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;

   const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;

  const [fetched_reports_state, setFetchedReportsState ] = useState([]);

  // Function to update the list of existing reports. It will be triggered once on component did mount and on every new report creation

  const updateReportList = () => {
    (
      async () => {
        try{
          let all_fetched_reports_raw = await fetch(server_url + '/all-questions', {
            method: 'POST',
            headers:{
              "Content-Type" : "application/json",
              Authorization : `Bearer ${localStorage.getItem("token")}`
            }
          });
      
          let jsonified_reports_response = await all_fetched_reports_raw.json();
      
          console.log(jsonified_reports_response);

          setFetchedReportsState( (prev) => {
            return [...jsonified_reports_response.questions];
          });

          // Once all processing is done, we remove the waiting overlay
          setWaitingOverlayContextState(prev => {
            return {
              display_waiting_overlay: false,
              waiting_overlay_class_name: "",
              waiting_overlay_message: ""
            };
          });
      
         }catch (error) {
      
          setWaitingOverlayContextState(prev => {
            return {
              display_waiting_overlay: false,
              waiting_overlay_class_name: "",
              waiting_overlay_message: ""
            };
          });
    
          setConfirmOverlayContextState(prev => {
            return {
              display_confirm_overlay: true,
              confirm_overlay_class_name: "close-app",
              purpose: "warning",
              confirm_overlay_message_title: "Server Connection Error",
              confirm_overlay_message:
                'There was an error with the connection to the server, please refresh the page.',
              confirm_overlay_title_bar_text: "Server Connection Error",
              origin: "Home",
              hide_cancel: true
            };
          });
          console.log(error);
        }
      }
    )();
  };

  const findOneQuestion = async (e) => {
    e.preventDefault();    

    let one_question_fetched = await fetch(server_url + `/details/${e.target.id}`, {
      method: 'GET',
      headers: {
        "Content-Type" : "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    let one_question_json = await one_question_fetched.json();

    //console.log(one_question_json);

    props.openEditQuestionFormFromParent(one_question_json);
    document.getElementById('top-of-page').scrollIntoView(true);
  }

  

  useEffect( () => {
    updateReportList();
  }, [props.fetch_reports_list_state_from_parent]);

  return (
    <table id="questions-list-component">
      <tbody>
        <tr>
          <td width="20">#</td>
          <th>Subject</th>
          <th>Topic</th>
          <th>Question</th>
          <th>Action</th>
        </tr>
       {fetched_reports_state.map( (element, index) => {
       return <tr key={index}><td width="20">{index+1}</td><td>{element.subject}</td><td>{element.questionTopic}</td><td>{element.questionPart1}</td><td><a href="#top-of-page" onClick={findOneQuestion} id={element._id}>Edit</a></td></tr>
       })}
       {fetched_reports_state.length === 0 ? <tr><td>0</td><td>No reports in the DB, create a report</td><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr> : null }
      </tbody>
    </table>
  );
};

export default QuestionsListComponent;
