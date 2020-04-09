import React, { useState, useLayoutEffect, useContext } from "react";

import ApplicationContext from '../../context_stores/ApplicationContext';

import QuestionsListComponent from './CreateQuestionPageComponents/QuestionsListComponent';
import CreateQuestionFormComponent from './CreateQuestionPageComponents/CreateQuestionFormComponent';
import RefreshButtonComponent from '../../layout_components/NavigationComponent/RefreshButtonComponent';

const ReportsPage = () => {

    // Global context
    // This is for being able to manage waiting overlay screen, most precisely to remove it later.
   const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;

  const [ reports_list_trigger_state, setReportsListTriggerState] = useState(true);

  const [ edit_question_state, setEditQuestionState] = useState(null);

  // Function to open edit question

  const openEditQuestionForm = (passed_question) => {   
    setEditQuestionState( (prev) => {
      return {...passed_question};
    });
  }

    // Displaying the overlay before the component renders:
    useLayoutEffect( () => {
      setWaitingOverlayContextState( (prev) => {
        return {display_waiting_overlay: true, waiting_overlay_class_name: 'fetching-dashboard', waiting_overlay_message: 'Fetching data from server...'};
      });
    },[]);

  return (
    <main className="internal-pages" id="reports">
      <div id="transparent-title-tile" className="tiles-row">Reports <RefreshButtonComponent /></div>
      <p><a id="top-of-page"></a></p>
      <p id="intro-text">These are the reports created for your company, please go ahead and create more if needed. In addition, please contact us in case you need any support for creating more reports.</p>
      <p>&nbsp;</p>
      <CreateQuestionFormComponent fetchReportsListStateFromParent={setReportsListTriggerState} edit_question_state_from_parent={edit_question_state}/>
      <p>&nbsp;</p>
      <QuestionsListComponent fetch_reports_list_state_from_parent={reports_list_trigger_state} openEditQuestionFormFromParent={openEditQuestionForm}/>      
    </main>
  );
};

export default ReportsPage;
