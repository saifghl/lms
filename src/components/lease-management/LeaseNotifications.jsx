import React, { useEffect, useState } from "react";
import Sidebar from "../admin/Sidebar";
import "./leaseManagement.css";
import { leaseAPI } from "../../services/api";

const LeaseNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        leaseAPI.getLeaseNotifications().then(res => setNotifications(res.data || [])).catch(console.error);
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content notifications-page">
                <header className="page-header">
                    <div>
                        <h1>Notifications</h1>
                        <p>Stay updated with alerts and system messages.</p>
                    </div>
                </header>

                <div className="tabs-nav">
                    {['All', 'Expiry alerts', 'Escalation', 'Pending', 'History'].map(tab => (
                        <button
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="notifications-list">
                    {notifications.length > 0 ? notifications.map((n, i) => (
                        <div className="notification-item" key={i}>
                            <div className="icon-box info">
                                <span>i</span>
                            </div>
                            <div className="content">
                                <h4>{n.title || "Lease System Alert"}</h4>
                                <p>{n.message}</p>
                                <span className="time">{new Date(n.created_at).toLocaleString()}</span>
                            </div>
                            <button className="close-btn">×</button>
                        </div>
                    )) : (
                        <div className="empty-state">No notifications found.</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LeaseNotifications;
