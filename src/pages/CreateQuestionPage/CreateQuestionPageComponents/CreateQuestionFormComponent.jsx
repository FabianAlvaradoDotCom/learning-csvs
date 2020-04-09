import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";

import ApplicationContext from "../../../context_stores/ApplicationContext";

import { server_url } from "../../../configs/configs";

const CreateQuestionFormComponent = props => {
  // Global states (contexts)
  const setConfirmOverlayContextState = useContext(ApplicationContext)
    .confirmOverlaySetter;

    const setWaitingOverlayContextState = useContext(ApplicationContext)
    .waitingOverlaySetter;

  // Local states
  // State to manage the min time value on the input datetime-local
  const [ current_date_for_picker_state, setCurrentDateForPickerState ] = useState(new Date());

  const [create_report_form_state, setCreateReportFormState] = useState(false);
  

  const [ completely_rendered_component_state, setCompletelyRenderedComponentState] = useState(false);

  const [ uno_value_state, setUnoValueState ] = useState("");
  const [ dos_value_state, setDosValueState ] = useState("");
  const [ tres_value_state, setTresValueState ] = useState("");
  const [ cuatro_value_state, setCuatroValueState ] = useState("");

  // Creating the refs for the inputs to get the data from
  const distribution_list_ref = useRef(null);
  const email_body_ref = useRef(null);
  const report_name_ref = useRef(null);


  const scheduleJobHandler = e => {
    e.preventDefault();

    //console.log(new Date(`${current_date_for_picker_state}`).toISOString());

    // We make sure that the fields have been filled out with anything
    if (distribution_list_ref.current.value === "" || email_body_ref.current.value === "" || report_name_ref.current.value === "") {
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Required fields are empty",
          confirm_overlay_message:
            'Please fillout "Report Name", "Email Body" and "Distribution list" fields',
          confirm_overlay_title_bar_text: "Required fields",
          origin: "create-report",
          hide_cancel: true
        };
      });
      return;
    }

    if ( distribution_list_ref.current.value.indexOf("@") === -1) {
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Invalid email address",
          confirm_overlay_message:
            'Please make sure you are entering valid email address / adresses',
          confirm_overlay_title_bar_text: "Invalid email address",
          origin: "create-report",
          hide_cancel: true
        };
      });
      return;
    }

    if (new Date(`${current_date_for_picker_state}`) < new Date(Date.now())) {
      setConfirmOverlayContextState(prev => {
        return {
          display_confirm_overlay: true,
          confirm_overlay_class_name: "close-app",
          purpose: "warning",
          confirm_overlay_message_title: "Report scheduled for the past",
          confirm_overlay_message:
            'The schedule time should be sometime in future, it cannot be a past date',
          confirm_overlay_title_bar_text: "Report scheduled for the past",
          origin: "create-report",
          hide_cancel: true
        };
      });
      return;
    }

    // If all fields are correct then we show the waiting overlay:
    setWaitingOverlayContextState( (prev) => {
      return {display_waiting_overlay: true, waiting_overlay_class_name: 'fetching-dashboard', waiting_overlay_message: 'Saving report...'};
    });

    (async () => {
      try {
        const report_creation_fetch = await fetch(
          server_url + "/schedule-report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              // Sending date as was saved into the useState (localtime with no seconds), without parsing it into isostring was working fine in local,
              // but herokus server was converting into their own time (6 hours back), so what I did was parsing it into isodate and it fixed the issue as it is now a universal time.
              scheduling_date: new Date(`${current_date_for_picker_state}`).toISOString(), //current_date_for_picker_state,
              distribution_list: distribution_list_ref.current.value,
              email_body: email_body_ref.current.value,
              report_name: report_name_ref.current.value,
              number_of_records_for_reporting : 10000//40000
            })
          }
        );
        console.log(`THIS IS THE SERVER RESPONSE:`, report_creation_fetch);

        // Once we receive a response from the server, we remove the waiting overlay no matter what the response is, we will handle that in nest steps.
        setWaitingOverlayContextState( (prev) => {
          return {display_waiting_overlay: false};
        });

        if (report_creation_fetch.status === 200) {
          props.fetchReportsListStateFromParent(prev => {
            return !prev;
          });
          showNewReportFormHandler();
          setConfirmOverlayContextState(prev => {
            return {
              display_confirm_overlay: true,
              confirm_overlay_class_name: "close-app",
              purpose: "success",
              confirm_overlay_message_title: "Success",
              confirm_overlay_message: "The report was created successfully.",
              confirm_overlay_title_bar_text: "Successful request",
              origin: "create-report",
              hide_cancel: true
            };
          });
          console.log("Works!");          
        } else {         
          showNewReportFormHandler();
          setConfirmOverlayContextState(prev => {
            return {
              display_confirm_overlay: true,
              confirm_overlay_class_name: "close-app",
              purpose: "warning",
              confirm_overlay_message_title: "Error",
              confirm_overlay_message: "The report could not be created, please verify the schedule time, it sould not be a past date",
              confirm_overlay_title_bar_text: "Error",
              origin: "create-report",
              hide_cancel: true
            };
          });
        }
      } catch (error) {
        console.log(error);
        // First we change the from handler to the opposite state so the button for creating a new report is there again.
        showNewReportFormHandler();
        // As when the API restarts it hangs, the page kept the loding page, this way we remove it.
        setWaitingOverlayContextState( (prev) => {
          return {display_waiting_overlay: false};
        });
        // Next we inform the user that there was an error
        setConfirmOverlayContextState(prev => {
          return {
            display_confirm_overlay: true,
            confirm_overlay_class_name: "close-app",
            purpose: "warning",
            confirm_overlay_message_title: "Error",
            confirm_overlay_message: "The report could not be created, please verify the schedule time, it sould not be a past date",
            confirm_overlay_title_bar_text: "Error",
            origin: "create-report",
            hide_cancel: true
          };
        });
      }
    })(); //*/
  };




  const showNewReportFormHandler = e => {    

    // We identify if the form is open or closed
    if(create_report_form_state){
      console.log("Form closed");         
    }else{
      console.log("Form open");
    }

    // As this was mainly triggered by a button, we need to add a condition so when it comes from within another function can execute too:
    if (e) {
      e.preventDefault();
      setCreateReportFormState(prev => {
        return !prev;
      });
    } else {
      setCreateReportFormState(prev => {
        return !prev;
      });
    }  
    
  };


  const clearFieldandToggleForm = () => { 
    setUnoValueState ( (prev) => {
      return "" ;
    })
    showNewReportFormHandler();
  }

  const dateOnChangeHandler = e => {
    setCurrentDateForPickerState(e.target.value);
  };

  useEffect( () => {
    if(completely_rendered_component_state){ 
      setUnoValueState ( (prev) => {
        return "Algo que llenar" ;
      }) 
      showNewReportFormHandler();
    }    
  }, [props.edit_question_state_from_parent]);

  // On component mounted useEffect
  useEffect( () => {
    setCompletelyRenderedComponentState( (prev) => {
      return true;
    });
  }, []);

  const formFieldsChange = (e) =>{
    setUnoValueState(e.target.value) ;
  }

  return (
    <Fragment>
      {create_report_form_state && (
        <form id="create-report-form">
          <label htmlFor="report_name">Report name</label>
          <br />
          <input
            id="report_name"
            type="text"
            ref={report_name_ref}
            placeholder='Example: "Monthly Production Report"'
            value={uno_value_state}
            onChange={formFieldsChange}
          />
          <p>&nbsp;</p>
          <label htmlFor="distribution_list">Distribution list (enter comma sepparated addresses)</label>
          <br />

          <textarea
            name="distribution_list"
            id="distribution_list"
            placeholder="Example: user1@company.com, user2@company.com"
            cols="106"
            rows="1"
            ref={distribution_list_ref}
          ></textarea>




          <p>&nbsp;</p>
          <label
            htmlFor="message-text"
            placeholder="Entere the description of this report"
          >
            Message
          </label>
          <br />
          <textarea
            name="message-text"
            id="message-text"
            placeholder="This will be the email body"
            cols="106"
            rows="2"
            ref={email_body_ref}
          ></textarea>
          <br />
          <br />
         
         
        
       
          <br />
          <button className="new-report-button" onClick={scheduleJobHandler}>Schedule Report</button>
          <button onClick={showNewReportFormHandler} id="close">&#128473;</button>
        </form>
      )}
      {!create_report_form_state && (
        <button className="new-report-button" onClick={clearFieldandToggleForm}>
          + Create new question
        </button>
      )}
    </Fragment>
  );
};

export default CreateQuestionFormComponent;
