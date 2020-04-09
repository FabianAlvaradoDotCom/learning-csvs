import React from "react";
import { NavLink } from "react-router-dom";

const NavigationComponent = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active-link-nav">
            <i className="material-icons">home</i> <span>Home</span>
          </NavLink>
        </li>       
        <li>
          <NavLink to="/quiz" exact activeClassName="active-link-nav">
            <i className="material-icons">outlined_flag</i> <span>Start quiz</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-question" exact activeClassName="active-link-nav" style={{pointerEvents: "none", color: "#555", textDecoration:"line-through"}}>
            <i className="material-icons">control_point</i> <span>Create</span>
          </NavLink>
        </li>
      </ul>


      {/* Settings menu */}
      <ul id="settings-button">
        <li>
            <NavLink to="/settings" exact activeClassName="active-link-nav" style={{pointerEvents: "none", color: "#555", textDecoration:"line-through"}}>
              <i className="material-icons">settings_applications</i>{" "}
              <span>Settings</span>
            </NavLink>
          </li>
      </ul>
    </nav>
  );
};

export default NavigationComponent;
