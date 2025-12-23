import React from "react";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Logo / Title */}
      <div className="sidebar-header">
        <h3>Management Portal</h3>
      </div>

      {/* Navigation */}
      <ul className="sidebar-menu">
        <li className="menu-item">
          Dashboard
        </li>

        <li className="menu-item">
          Reports
        </li>

        <li className="menu-item active">
          Document Repository
        </li>

        <li className="menu-item">
          Notifications
        </li>

        <li className="menu-item">
          Search & Filters
        </li>

        <li className="menu-item">
          Settings
        </li>
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        <span>Log Out</span>
      </div>
    </div>
  );
}

export default Sidebar;
