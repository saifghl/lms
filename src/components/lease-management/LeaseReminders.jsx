import React, { useEffect, useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";
import { getNotifications } from "../../services/api";

const LeaseReminders = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setNotifications(data);
      })
      .catch(() => alert("Failed to load notifications"));
  }, []);

  return (
    <div className="dashboard-layout">
      <RepSidebar />

      <div className="lease-dashboard-content">
        <h2>Notifications</h2>

        {notifications.map((n) => (
          <div className="notification-card" key={n.id}>
            <h4>{n.title || "Lease Alert"}</h4>
            <p>{n.message}</p>
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </div>
        ))}

        {notifications.length === 0 && <p>No notifications</p>}
      </div>
    </div>
  );
};

export default LeaseReminders;
