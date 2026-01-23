import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../admin/Sidebar.css';

const DataEntrySidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="sidebar open">
            <div className="sidebar-header">
                <div className="logo-area">
                    <div className="logo-icon-container">
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#E8F1FF" />
                            <path d="M20 10L10 18V30H16V22H24V30H30V18L20 10Z" fill="#2E66FF" />
                        </svg>
                    </div>
                    <span className="logo-text">Cusec Consulting LLP</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/data-entry/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    </span>
                    Dashboard
                </NavLink>

                <NavLink to="/data-entry/add-data" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </span>
                    Add New Data
                </NavLink>

                <NavLink to="/data-entry/past-entries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </span>
                    Past Entries
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="nav-item logout" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span className="icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </span>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default DataEntrySidebar;
