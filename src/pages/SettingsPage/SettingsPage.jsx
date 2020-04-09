import React from "react";
import RefreshButtonComponent from '../../layout_components/NavigationComponent/RefreshButtonComponent';

const SettingsPage = () => {
  return <main className="internal-pages" id="settings">
    <div id="transparent-title-tile" className="tiles-row">Settings <RefreshButtonComponent /></div>
    <p>Alerts</p>
    <p>Distribution lists</p>
    <p>Sensor names</p>
    <p>Language</p>
    <p>user duty: Management</p>
  </main>;
};

export default SettingsPage;