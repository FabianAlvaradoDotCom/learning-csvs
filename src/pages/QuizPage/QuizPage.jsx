import React, { Fragment, useEffect, useState, useContext, useRef } from 'react';

import { server_url } from '../../configs/configs';
import RefreshButtonComponent from '../../layout_components/NavigationComponent/RefreshButtonComponent';
import transformAnswerForComparison from './QuizPageComponents/transform_answer_for_comparison';
import ApplicationContext from '../../context_stores/ApplicationContext';

import { application_cards_path } from '../../configs/configs';
import { application_diagrams_path } from '../../configs/configs';

import GoNextAndShowAnswerComponent from './QuizPageComponents/GoNextAndShowAnswerComponent';

const csvtojson = require('csvtojson');
const { shell, nativeImage } = require('electron');

let fs = require('fs');
let path = require('path');

const QuizPage = () => {

  // Global contexts
  // This contains the fetched question ids in the home
  const questions_ids_list_context_state = useContext(ApplicationContext).questions_ids_list_getter;
  // This will manage the question ids
  const setQuestionsIDsListContextState = useContext(ApplicationContext).questionsIDsListSetter;

  // This is for being able to manage waiting overlay screen, most precisely to remove it later.
  const setWaitingOverlayContextState = useContext(ApplicationContext).waitingOverlaySetter;
  const setConfirmOverlayContextState = useContext(ApplicationContext).confirmOverlaySetter;

  // Local states
  // Creating an initial state for the question to show, so we avoid 'undefined' errors because of missing keys
  const [fetched_question_state, setFetchedQuestionState] = useState({
    subject: "", question: "", question_topic: "", answer: "", comments: "", answer_type: "", rows: 0, type: "", content_type: "", place_holder: "", error_message: "", image_url: "",
    reference_url: "", reference_time: "",
    reference_url2: "", reference_time2: "",
    reference_url3: "", reference_time3: "",
    reference_url4: "", reference_time4: "",
    reference_url5: "", reference_time5: "",
    reference_url6: "", reference_time6: "",
    reference_url7: "", reference_time7: "",
  });


  // State to be able to manage textarea value, else it is read only
  const [entered_answer_state, setEnteredAnsweredState] = useState('');

  // State to save the right answer from the database once it has been converted.
  const [converted_actual_answer_state, setConvertedActualAnswerState] = useState('');

  // State to handle the answer status feedback
  const [answer_ok_state, setAnswerOkState] = useState("no-successful");
  const [show_answer_state, setShowAnswerState] = useState(false);
  const [show_wrong_answer_message_state, setShowWrongAnswerMessageState] = useState(false);

  // To give the answer box focus on a new question
  let $answer_area_ref = useRef(null);

  // Ref to be able to give the "next question" button focus automatically on a correct answer so it can move to next question by hitting enter.
  let $next_question_button_ref = useRef(null); 


  // Fetch question function
  const fetchRandomQuestion = (passed_list) => {


    let copy_of_ids_list;

    if (passed_list) {
      copy_of_ids_list = [...passed_list];
    } else {
      copy_of_ids_list = [...questions_ids_list_context_state];
    }


    let ids_number = copy_of_ids_list.length;

    let question_selected_index = Math.round(Math.random() * (ids_number - 1));

    let selected_isolated_question = copy_of_ids_list.splice(question_selected_index, 1);


    console.log(selected_isolated_question);

    (async () => {

      setWaitingOverlayContextState((prev) => {
        return { display_waiting_overlay: true, waiting_overlay_class_name: 'fetching-dashboard', waiting_overlay_message: 'Fetching data from server...' };
      });

      try {

        const question_file_location = application_cards_path + selected_isolated_question[0].substring(0, selected_isolated_question[0].indexOf("-")) + "/" + selected_isolated_question[0];
        //console.log("QUESTION FILE LOCATION", question_file_location);

        const parsed_question_array = await csvtojson().fromFile(question_file_location);

        const parsed_question = { ...parsed_question_array[0], _id: selected_isolated_question[0] };

        parsed_question.rows = +parsed_question.rows;


        /* AS ELECTRON WAS PREVENTING ME TO USE IMAGES ON "file://", FOR ENTERING AN IMAGE URL EXTERNAL TO THE APPLICATION, I AM USING NATIVE IMAGE ELECTRON MODULE*/
        if(parsed_question.image_url !== ""){

          // First I create a nativeImage from the image given byt the csv
          const imported_image_to_nativeImage = nativeImage.createFromPath(path.join(application_diagrams_path + parsed_question.image_url));

          // Then I convert the nativeImage to dataURL and pass it to the question holder to then be converted into an state
          parsed_question.image_url = imported_image_to_nativeImage.toDataURL();
        }


        // Filling out question details
        setFetchedQuestionState((prev) => {
          return { ...prev, ...parsed_question };
        });

        // Converting answer once
        setConvertedActualAnswerState((prev) => {
          return transformAnswerForComparison(parsed_question.answer, parsed_question.answer_type, "database-entered");
        });

        // Entering the placeholder code into the question
        setEnteredAnsweredState((prev) => {
          return parsed_question.place_holder;
        });

        // // Filling questions array with all the rest
        // setQuestionsIDsListContextState( (prev) => {
        //   return [...copy_of_ids_list];
        // });

        // Removing waiting overlay
        setWaitingOverlayContextState(prev => {
          return {
            display_waiting_overlay: false,
            waiting_overlay_class_name: "",
            waiting_overlay_message: ""
          };
        });

        $answer_area_ref.current.focus();


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
        // Removing waiting overlay
        setWaitingOverlayContextState(prev => {
          return {
            display_waiting_overlay: false,
            waiting_overlay_class_name: "",
            waiting_overlay_message: ""
          };
        });
      }
    })();
  }


  // Function to be able to enter tabs
  const onKeyDownAnswerEntering = (e) => {
    // Adding a tab space if tab key has been pressed
    if (e.keyCode === 9) {
      e.preventDefault();
      let start_pos = e.target.selectionStart; // This takes the selection start position, if no selection it is position of the cursor
      let end_pos = e.target.selectionEnd; // This takes the selection end position, if no selection it is position of the cursor
      e.target.value = e.target.value.substring(0, start_pos) + "\t" + e.target.value.substring(end_pos); // This inserts the 'tab' in the desired position
      e.target.selectionEnd = start_pos + 1; // This puts the cursor right after the tab
    }
  }


  // Function for comparing actual right answer and entered answer
  const compareWordByWord = (splitted_right_answer, entered_answer) => {

    // We transform the entered answer
    let splitted_entered_answer = transformAnswerForComparison(entered_answer, fetched_question_state.answer_type, "user-entered");

    console.log(splitted_right_answer);
    console.log(splitted_entered_answer);//*/

    // We first verify that they have the same number of words
    if (splitted_entered_answer.length !== splitted_right_answer.length) {
      return false;
    }

    // Then we check if both arrays of words are the same
    for (let i = 0; i < splitted_right_answer.length; i++) {
      if (splitted_right_answer[i] != splitted_entered_answer[i]) {
        return false;
      }
    }
    return true;
  }


  // Function that run comparison on field change
  const onChangeAnswerValue = (e) => {
    setEnteredAnsweredState(e.target.value);
    if (compareWordByWord(converted_actual_answer_state, e.target.value)) {

      setAnswerOkState((prev) => {
        return 'successful';
      });

      setShowWrongAnswerMessageState((prev) => {
        return false;
      });

      setShowAnswerState((prev) => {
        return false;
      });

      //$next_question_button_ref.current.focus();

    } else {
      setAnswerOkState((prev) => {
        return 'no-successful';
      });
    }
  }

  // Function for showing the answer as per user request
  const showAnswerHandler = (e) => {
    setShowAnswerState((prev) => {
      return !prev;
    });
  }

  // Function that shows the error message if the user leaves the textarea
  const answerBlurHandler = (e) => {
    if ((entered_answer_state !== "" && e.type === 'blur' && answer_ok_state === 'no-successful') || (e.type === 'mouseleave' && answer_ok_state === 'no-successful' && entered_answer_state !== "")) {
      setShowWrongAnswerMessageState((prev) => {
        return true;
      });
    } else if (e.type === 'focus') {
      setShowWrongAnswerMessageState((prev) => {
        return false;
      });
    }
  }


  // Function for fetching next question if the current question was responded correctly
  const nextQuestion = (e) => {

    let new_list = [...questions_ids_list_context_state];

    new_list = new_list.filter((element) => {
      return element !== fetched_question_state._id;
    });


    // Filling questions array with all the rest
    setQuestionsIDsListContextState((prev) => {
      return [...new_list];
    });


    setEnteredAnsweredState((prev) => {
      return '';
    });

    setAnswerOkState((prev) => {
      return 'no-successful';
    });

    if(e.target.textContent === "Next question"){
      setShowAnswerState((prev) => {
        return false;
      });
    }else{
      setShowAnswerState((prev) => {
        return true;
      });
    }


    

    // Cleaning up question fields
    setFetchedQuestionState((prev) => {
      return {
        subject: "", question: "", question_topic: "", answer: "", comments: "", rows: 0, type: "", content_type: "", place_holder: "", error_message: "", image_url: "",
        reference_url: "", reference_time: "",
        reference_url2: "", reference_time2: "",
        reference_url3: "", reference_time3: "",
        reference_url4: "", reference_time4: "",
        reference_url5: "", reference_time5: "",
        reference_url6: "", reference_time6: "",
        reference_url7: "", reference_time7: ""
      };
    });

    if (new_list.length !== 0) {
      fetchRandomQuestion(new_list);
    }

  };


  const openExternalBrowserPage = (e) => {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }

  // In order to give focus to next button for an easier go to next process, I needed to implement the below, because it was giving an error if I tried to give focus to the button at the same time I showed it, it was not defined (line 202), so I am giving focus only as per the useEffect dependency "answer_ok_state", and making sure that it happens only if it is successful.
  useEffect(() => {

    if (answer_ok_state === "successful") {
      $next_question_button_ref.current.focus();
    }

  }, [answer_ok_state]);


  // Initial useEffect on component mounted
  useEffect(() => {
    if (questions_ids_list_context_state.length > 0) {
      
      fetchRandomQuestion();

    } else {
      // Removing waiting overlay as it is done on the fetch function when there is at least one fetched question
      setWaitingOverlayContextState(prev => {
        return {
          display_waiting_overlay: false,
          waiting_overlay_class_name: "",
          waiting_overlay_message: ""
        };
      });

      return;
    }
  }, []);

  return (
    <main className="internal-pages" id="quiz-page">
      <div id="transparent-title-tile" className="tiles-row">
        Quiz <RefreshButtonComponent />
      </div>

      {(questions_ids_list_context_state.length > 0 || fetched_question_state.question !== "") && <Fragment>
        <div id="question-container">
          <div id="question-header">
            <span id="question-topic">{fetched_question_state.subject + " - " + fetched_question_state.question_topic}</span><span id="remaining-questions">Remaining questions: {questions_ids_list_context_state.length}</span>
            <span id="csv-filename">{fetched_question_state._id}</span>
          </div>
          <br />
          <div dangerouslySetInnerHTML={{ __html: `${fetched_question_state.question}` }} id="question" />
        </div>
        <p>&nbsp;</p>


        {show_answer_state && fetched_question_state.reference_url !== "" && <Fragment><a href={fetched_question_state.reference_url} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url}</a>
          {fetched_question_state.reference_time !== "" && <p>Time of the explanation1: <b>{fetched_question_state.reference_time}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url2 !== "" && <Fragment><a href={fetched_question_state.reference_url2} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url2}</a>
          {fetched_question_state.reference_time2 !== "" && <p>Time of the explanation2: <b>{fetched_question_state.reference_time2}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url3 !== "" && <Fragment><a href={fetched_question_state.reference_url3} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url3}</a>
          {fetched_question_state.reference_time3 !== "" && <p>Time of the explanation3: <b>{fetched_question_state.reference_time3}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url4 !== "" && <Fragment><a href={fetched_question_state.reference_url4} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url4}</a>
          {fetched_question_state.reference_time4 !== "" && <p>Time of the explanation4: <b>{fetched_question_state.reference_time4}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url5 !== "" && <Fragment><a href={fetched_question_state.reference_url5} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url5}</a>
          {fetched_question_state.reference_time5 !== "" && <p>Time of the explanation5: <b>{fetched_question_state.reference_time5}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url6 !== "" && <Fragment><a href={fetched_question_state.reference_url6} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url6}</a>
          {fetched_question_state.reference_time6 !== "" && <p>Time of the explanation6: <b>{fetched_question_state.reference_time6}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        {show_answer_state && fetched_question_state.reference_url7 !== "" && <Fragment><a href={fetched_question_state.reference_url7} onClick={openExternalBrowserPage}>{fetched_question_state.reference_url7}</a>
          {fetched_question_state.reference_time7 !== "" && <p>Time of the explanation7: <b>{fetched_question_state.reference_time7}</b></p>}
          <p>&nbsp;</p>
        </Fragment>}

        <div id="text-editor-container" className={answer_ok_state}>
          <textarea id="line-numbers"
            className={fetched_question_state.answer_type}
            placeholder={[...Array(80)].map((element, index) => `${index + 1}\n`).join('')} disabled></textarea>
          <textarea
            id="answer-area" className={fetched_question_state.answer_type} ref = {$answer_area_ref}
            rows={+fetched_question_state.rows + 2}
            onChange={onChangeAnswerValue} onKeyDown={onKeyDownAnswerEntering} onBlur={answerBlurHandler}
            onMouseLeave={answerBlurHandler} onFocus={answerBlurHandler}
            value={entered_answer_state}            
            placeholder={fetched_question_state.place_holder}
            autoFocus></textarea>
        </div>
        {show_wrong_answer_message_state && <div id="wrong-answer-message">{fetched_question_state.error_message}</div>}
        <br />
        <div id="right-answer-container">
          <button id="show-hide-answer" onClick={showAnswerHandler}>{show_answer_state ? 'Hide answer' : 'Show answer'}</button>&emsp;<GoNextAndShowAnswerComponent goNextShow={nextQuestion} />

          {show_answer_state && <div id="db-answer">
            {fetched_question_state.answer_type === 'code-type' && <pre dangerouslySetInnerHTML={{ __html: `${fetched_question_state.answer}` }}></pre>}
            {fetched_question_state.answer_type !== 'code-type' && <p dangerouslySetInnerHTML={{ __html: `${fetched_question_state.answer}` }}></p>}
            {fetched_question_state.comments !== '' && <Fragment><p id="comments">Comments:</p><pre dangerouslySetInnerHTML={{ __html: `${fetched_question_state.comments}` }}></pre></Fragment>}
            
          
          {/* FOR ENTERING AN IMAGE URL EXTERNAL TO THE APPLICATION, I AM USING NATIVE IMAGE ELECTRON MODULE*/}
            {fetched_question_state.image_url !== "" && <p id="diagram-container"><img src={fetched_question_state.image_url} /></p>}
          </div>}
        </div>
        <br />
        <div id="next-page-button-container">
          {answer_ok_state === "successful" && <button onClick={nextQuestion} className="dark-blue-button" ref = {$next_question_button_ref}>Next question</button>}
        </div>
      </Fragment>}

      {questions_ids_list_context_state.length === 0 && fetched_question_state.question === "" && <Fragment>
        <h1>Congratulations, there are no more questions pending!</h1>
      </Fragment>}
    </main>
  );
}

export default QuizPage;