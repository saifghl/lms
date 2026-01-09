import React, { useEffect, useState } from "react";
import RepSidebar from "./RepSidebar";
import { getNotifications } from "../../services/managementApi";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data));
  }, []);

  return (
    <div className="notifications-container">
      <RepSidebar />
      <main className="notifications-content">
        <h2>Notifications</h2>

        <div className="notifications-list">
          {notifications.map((item) => (
            <div className="notification-item" key={item.id}>
              <span>{item.text}</span>
              {!item.read && <span className="unread-badge">Unread</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
