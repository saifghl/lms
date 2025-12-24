import React from 'react';
import Sidebar from './Sidebar';
import './ActivityLogs.css';

const ActivityLogs = () => {
    // Mock Data based on the screenshot
    const logs = [
        {
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
            name: 'Michael Chen',
            role: 'Admin',
            action: 'Deleted Tenant Profile',
            details: 'ID #88291 - John Smith',
            module: 'User Mgmt',
            date: 'Oct 24, 2023',
            time: '12:15:22 PM',
            status: 'Success',
            statusClass: 'success'
        },
        {
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop',
            name: 'Sarah Jenkins',
            role: 'Property Manager',
            action: 'Updated Lease Terms',
            details: 'Modified rent amount for Unit 4B',
            module: 'Lease Mgmt',
            date: 'Oct 24, 2023',
            time: '14:30:05 PM',
            status: 'Warning',
            statusClass: 'warning'
        },
        {
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop',
            name: 'Alex Morgan',
            role: 'Leasing Agent',
            action: 'Created New Property',
            details: 'Downtown Loft #402',
            module: 'Properties',
            date: 'Oct 23, 2023',
            time: '16:20:00 PM',
            status: 'Success',
            statusClass: 'success'
        },
        {
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2588&auto=format&fit=crop',
            name: 'Emily Davis',
            role: 'Financial Analyst',
            action: 'Exported Financial Reports',
            details: 'Q3 2023 Revenue Sheet',
            module: 'Reports',
            date: 'Oct 24, 2023',
            time: '09:00:10 AM',
            status: 'Error',
            statusClass: 'error'
        }
    ];

    return (
        <div className="activity-logs-container">
            <Sidebar />
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
                        <div className="filter-dropdown">All Modules</div>
                        <div className="filter-dropdown">User Management</div>
                        <div className="filter-dropdown">Lease Terms</div>
                        <div className="filter-dropdown">Financials</div>
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
                        <div>Status</div>
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
                            <div className="status-col">
                                <span className={`status-badge ${log.statusClass}`}>{log.status}</span>
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
