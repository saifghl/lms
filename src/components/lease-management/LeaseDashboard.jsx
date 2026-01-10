import React, { useEffect, useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";
import { useNavigate } from "react-router-dom";
import { getLeaseStats } from "../../services/api";

const LeaseDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    expiring: 0,
  });

  useEffect(() => {
    getLeaseStats()
      .then((res) => setStats(res.data))
      .catch(() => alert("Failed to load dashboard stats"));
  }, []);

  return (
    <div className="dashboard-layout">
      <RepSidebar />

      <div className="lease-dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back</p>
          </div>
          <button
            className="primary-btn"
            onClick={() => navigate("/admin/add-lease")}
          >
            ➕ Create new lease
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Pending Approvals</h4>
            <h3>{stats.pending}</h3>
          </div>

          <div className="stat-card">
            <h4>Lease Expiries (30 Days)</h4>
            <h3>{stats.expiring}</h3>
          </div>

          <div className="stat-card">
            <h4>Total Active Leases</h4>
            <h3>{stats.active}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseDashboard;
