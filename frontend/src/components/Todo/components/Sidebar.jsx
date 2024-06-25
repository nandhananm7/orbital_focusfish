import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>FocusFish</h2>
      <ul>
        <li><a href="#section1">Back to Dashboard</a></li>
        <li><a href="#section2">Important</a></li>
        <li><a href="#section3">Assigned to me</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
