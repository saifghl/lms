import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RepSidebar from "./RepSidebar";
import { managementAPI } from "../../services/api";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await managementAPI.getNotifications();
      const list = res.data.data || res.data || [];
      // Ensure local read status if not provided by backend
      const mappedList = Array.isArray(list) ? list.map(n => ({ ...n, read: n.read || false })) : [];
      setNotifications(mappedList);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    // TODO: Call API to update status when endpoint is available
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // TODO: Call API
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <RepSidebar />
      <main className="main-content">
        <header className="page-header">
          <div className="header-left">
            <div className="breadcrumb">
              <Link to="/management/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <span className="active">NOTIFICATIONS</span>
            </div>
            <h1>Notifications</h1>
            <p>Stay updated with alerts, reminders, and system messages.</p>
          </div>
          <button className="btn-mark-all" onClick={markAllAsRead}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Mark all as read
          </button>
        </header>

        <div className="content-card">
          <div className="notifications-tabs">
            <div
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </div>
            <div
              className={`tab ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </div>
          </div>

          <div className="notifications-list">
            {loading && (
              <div className="empty-state">Loading notifications...</div>
            )}
            {!loading && filteredNotifications.length === 0 && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <p>No notifications found</p>
              </div>
            )}
            {!loading && filteredNotifications.map((item) => (
              <div className={`notification-item ${!item.read ? 'unread' : ''}`} key={item.id}>
                <div className="notification-content">
                  <div className="notification-text">{item.text || item.message}</div>
                  <div className="notification-meta">
                    <span className="notification-time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {getRelativeTime(item.date || item.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{item.type || 'System'}</span>
                  </div>
                </div>
                <div className="notification-actions">
                  {!item.read && (
                    <button className="btn-mark-read" onClick={() => markAsRead(item.id)}>
                      Mark as read
                    </button>
                  )}
                  {item.read && (
                    <span style={{ fontSize: '0.8rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                      Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
