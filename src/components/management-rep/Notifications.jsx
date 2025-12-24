import React, { useState } from 'react';
import RepSidebar from './RepSidebar';
import './Notifications.css';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Lease alerts', 'Escalations', 'Expiries', 'System alerts'];

    // Mock Notifications Data
    const notifications = [
        { id: 1, text: 'Manage your alearts and updates for lease operations.', read: false },
        { id: 2, text: 'Manage your alearts and updates for lease operations.', read: false },
        { id: 3, text: 'Manage your alearts and updates for lease operations.', read: false },
        { id: 4, text: 'Manage your alearts and updates for lease operations.', read: true },
        { id: 5, text: 'Manage your alearts and updates for lease operations.', read: true },
        { id: 6, text: 'Manage your alearts and updates for lease operations.', read: true },
    ];

    return (
        <div className="notifications-container">
            <RepSidebar />
            <main className="notifications-content">
                <div className="notifications-header">
                    <div className="header-text">
                        <h2>Notifications</h2>
                        <p>Manage your alearts and updates for lease operations.</p>
                    </div>
                    <button className="btn-mark-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Mark all as read
                    </button>
                </div>

                <div className="notifications-tabs">
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="notifications-list">
                    {notifications.map(item => (
                        <div className="notification-item" key={item.id}>
                            <div className="notification-text">
                                {item.text}
                            </div>
                            <div className="notification-actions">
                                {!item.read && (
                                    <span className="unread-badge">Unread</span>
                                )}
                                <button className="more-btn">
                                    •••
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Notifications;
