import React, { Fragment, useContext  } from "react";

import { Route, Redirect } from "react-router-dom";

import ApplicationContext from './context_stores/ApplicationContext';

import TitleBarComponent from "./layout_components/TitleBarComponents/TitleBarComponent";
import HeaderComponent from "./layout_components/HeaderComponent/HeaderComponent";
import NavigationComponent from './layout_components/NavigationComponent/NavigationComponent';
import FooterComponent from "./layout_components/FooterComponent/FooterComponent";
import WaitingOverlayComponent from "./layout_components/WaitingOverlayComponent/WaitingOverlayComponent";
import ConfirmOverlayComponent from "./layout_components/ConfirmOverlayComponent/ConfirmOverlayComponent"

import RefreshPage from './layout_components/NavigationComponent/RefreshPage';

// The functionalities core component
import LicenseValidationPage from "./pages/LicenseValidationPage/LicenseValidationPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import CreateQuestionPage from "./pages/CreateQuestionPage/CreateQuestionPage";
import QuizPage from './pages/QuizPage/QuizPage';
import SettingsPage from "./pages/SettingsPage/SettingsPage";


const Layout = props => {
  //
  // Using global application context to define wheather or not to use the navigation component
  const session_data_context = useContext(ApplicationContext).session_data_getter;

  return (
    <Fragment>
      <TitleBarComponent />
      <HeaderComponent />
      <NavigationComponent />
      <FooterComponent />
      <Route path="" exact render={() => {
          return <Redirect to="/" />;
        }}
      />
      {/* <Route path="/" exact component={LicenseValidationPage} /> */}
      <Route path="/" exact component={HomePage} />
      <Route path="/login" exact component={LoginPage} />
      {/* <Route path="/home" exact component={HomePage} />      */}
      <Route path="/quiz" exact component={QuizPage}/>
      <Route path="/create-question" exact component={CreateQuestionPage}/>
      <Route path="/settings" exact component={SettingsPage}/>
      <Route path="/refresh/:origin" exact component={RefreshPage} />
      <WaitingOverlayComponent />
      <ConfirmOverlayComponent />
    </Fragment>
  );
};

export default Layout;
