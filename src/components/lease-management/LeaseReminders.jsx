import React, { useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "../management-rep/RepSidebar.css";
import "./leaseManagement.css";

const LeaseReminders = () => {
    // State for tabs
    const [activeTab, setActiveTab] = useState("All");

    // Notification Data (Hardcoded to match image)
    const notifications = [
        { id: "#P-1024", text: "Escalation by finance Q3 rent is 45 days overdue", time: "2h ago" },
        { id: "#P-1024", text: "Escalation by finance Q3 rent is 45 days overdue", time: "2h ago" },
        { id: "#P-1024", text: "Escalation by finance Q3 rent is 45 days overdue", time: "2h ago" },
        { id: "#P-1024", text: "Escalation by finance Q3 rent is 45 days overdue", time: "2h ago" },
    ];

    return (
        <div className="dashboard-layout">
            <RepSidebar />

            <div className="lease-dashboard-content">
                {/* Page Header */}
                <div className="dashboard-header" style={{ marginBottom: "20px" }}>
                    <div>
                        <h2>Notification</h2>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="notification-tabs">
                    {["All", "Expiry alearts", "Escalation", "Pending", "History"].map((tab) => (
                        <div
                            key={tab}
                            className={`notification-tab-item ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Notification List */}
                <div className="notification-list">
                    {notifications.map((item, index) => (
                        <div key={index} className="notification-card">
                            <div className="notification-info">
                                <h4 className="notif-id">ID: {item.id}</h4>
                                <p className="notif-text">{item.text}</p>
                            </div>
                            <span className="notif-time">{item.time}</span>
                        </div>
                    ))}
                </div>

                <div className="show-more-container" style={{ marginTop: '20px' }}>
                    <button className="show-more-btn" style={{ textTransform: 'none', fontSize: '14px' }}>See all</button>
                </div>

            </div>
        </div>
    );
};

export default LeaseReminders;
