import React from 'react';
import Sidebar from './Sidebar';
import './ActivityLogs.css';

import { getActivityLogs } from '../../services/api';
import { useEffect, useState } from 'react';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getActivityLogs().then(res => setLogs(res.data)).catch(console.error);
    }, []);

    return (
        <div className="activity-logs-container">
            <Sidebar /> {/* Navigation Sidebar */}
            <main className="activity-logs-content">
                <header className="activity-header">
                    <div className="activity-title">
                        <h2>Activity Logs</h2>
                        <p>Monitor system changes, user actions, and security events in real-time.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-refresh">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            Refresh
                        </button>
                        <button className="btn-export">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Export Report
                        </button>
                    </div>
                </header>

                <div className="filters-container">
                    <div className="filter-group">
                        <div className="filter-dropdown">
                            All Modules
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <div className="filter-dropdown">
                            User Management
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <div className="filter-dropdown">
                            Lease Terms
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <div className="filter-dropdown">
                            Financials
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <button className="btn-add-filter">+ Add Filter</button>
                    </div>

                    <div className="filter-controls">
                        <span className="clear-filters">Clear filters</span>
                        <div className="view-options">
                            <button className="view-btn active">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                            <button className="view-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="activity-table-container">
                    <div className="activity-table-header">
                        <div>Avatar</div>
                        <div>User</div>
                        <div>Action</div>
                        <div>Module</div>
                        <div>Timestamp</div>

                    </div>

                    {logs.map((log, index) => (
                        <div className="activity-row" key={index}>
                            <div className="avatar-col">
                                <img src={log.avatar} alt={log.name} />
                            </div>
                            <div className="user-col">
                                <h4>{log.name}</h4>
                                <span>{log.role}</span>
                            </div>
                            <div className="action-col">
                                <h4>{log.action}</h4>
                                <span>{log.details}</span>
                            </div>
                            <div className="module-col">
                                {log.module}
                            </div>
                            <div className="timestamp-col">
                                <span>{log.date}</span>
                                <span className="time">{log.time}</span>
                            </div>

                        </div>
                    ))}

                    <div className="table-footer">
                        <span>Showing 1 to 4 of 1248 log</span>
                        <div className="pagination">
                            <span className="page-arrow">&lt;</span>
                            <span className="page-item active">1</span>
                            <span className="page-item">2</span>
                            <span className="page-item">3</span>
                            <span className="page-item">4</span>
                            <span className="page-item">5</span>
                            <span>...</span>
                            <span className="page-item">42</span>
                            <span className="page-arrow">&gt;</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActivityLogs;
