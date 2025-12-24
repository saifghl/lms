import React from "react";
<<<<<<< Updated upstream:src/components/management-rep/sidebar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Helper to determine active state
  const isActive = (routeKey) => {
    if (routeKey === 'dashboard' && path.includes('/admin/dashboard')) return true;
    if (routeKey === 'lease' && (path.includes('/lease/dashboard') || path.includes('/lease/validation'))) return true;
    if (routeKey === 'review' && path.includes('/lease/lifecycle')) return true;
    if (routeKey === 'tracker' && path.includes('/lease/reports')) return true; // Mapping Analytics to Tracker
    if (routeKey === 'notification' && path.includes('/lease/reminders')) return true; // Mapping Reminders to Notification
    if (routeKey === 'settings' && path.includes('/settings')) return true; // Assuming a settings route
    return false;
  };

=======
import { NavLink } from "react-router-dom";
import "./RepSidebar.css";

function RepSidebar() {
>>>>>>> Stashed changes:src/components/management-rep/RepSidebar.jsx
  return (
    <div className="sidebar">
      {/* Logo / Company Name */}
      <div className="sidebar-header">
        <div className="logo-area">
          {/* Placeholder for logo icon */}
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8.5a2.5 2.5 0 0 0-5 0V21" /></svg>
          </div>
          <h3>Cusec Consulting LLP</h3>
        </div>
      </div>

      {/* Navigation */}
      <ul className="sidebar-menu">
<<<<<<< Updated upstream:src/components/management-rep/sidebar.jsx
        <li
          className={`menu-item ${isActive('dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/admin/dashboard')}
        >
=======
        <NavLink to="/management/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
>>>>>>> Stashed changes:src/components/management-rep/RepSidebar.jsx
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </span>
          Dashboard
        </NavLink>

        <li
          className={`menu-item ${isActive('lease') ? 'active' : ''}`}
          onClick={() => navigate('/lease/dashboard')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </span>
          Reports
        </li>

        <li
          className={`menu-item ${isActive('review') ? 'active' : ''}`}
          onClick={() => navigate('/lease/lifecycle')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </span>
          Document repository
        </li>

        <li
          className={`menu-item ${isActive('notification') ? 'active' : ''}`}
          onClick={() => navigate('/lease/reminders')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </span>
          Notification
        </li>

        <li
          className={`menu-item ${isActive('tracker') ? 'active' : ''}`}
          onClick={() => navigate('/lease/reports')}
        >
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </span>
          Search and Filter
        </li>

        <li className="menu-item">
          <span className="menu-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </span>
          Settings
        </li>
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="footer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </span>
        <span>Log Out</span>
      </div>
    </div>
  );
}

export default RepSidebar;
