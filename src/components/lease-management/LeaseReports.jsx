import React, { useEffect, useState } from "react";
import Sidebar from "../admin/Sidebar";
import "./leaseManagement.css";
import { leaseAPI } from "../../services/api";

const LeaseReports = () => {
  const [stats, setStats] = useState({
    expiring_30_days: 0,
    expiring_60_days: 0,
    total_value_risk: 0,
    notice_pending: 0
  });
  const [leases, setLeases] = useState([]);
  const [filters, setFilters] = useState({ project: '', search: '', range: '10oct2025 to 20 nov 2025' });

  useEffect(() => {
    // Fetch stats
    leaseAPI.getLeaseReportStats().then(res => setStats(res.data)).catch(console.error);
    // Fetch specific expiring leases list
    leaseAPI.getExpiringLeases().then(res => setLeases(res.data)).catch(console.error);
  }, []);

  const formatCurrency = (val) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content lease-reports">
        <header className="page-header">
          <div>
            <h1>Lease Report</h1>
            <p>Generate and export detailed insights for lease expiring, upcoming renewable, and rent escalations.</p>
          </div>
          <div className="header-actions">
            <button className="white-btn">Export pdf</button>
            <button className="white-btn">Export excel</button>
          </div>
        </header>

        <div className="tabs-nav">
          <button className="tab active">Lease expiry</button>
          <button className="tab">Lease renewal</button>
          <button className="tab">Escalation</button>
          <button className="tab">Active summary</button>
        </div>

        {/* Filters Box */}
        <div className="filters-box">
          <div className="filter-group">
            <label>Project Scope</label>
            <input type="text" placeholder="Project wise." />
          </div>
          <div className="filter-group">
            <label>Entities search</label>
            <input type="text" placeholder="search" />
          </div>
          <div className="filter-group">
            <label>Expiry range</label>
            <input type="text" defaultValue="10oct2025 to 20 nov 2025" />
          </div>
          <div className="filter-actions">
            <button className="primary-btn">Apply filters</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="report-stats">
          <div className="report-card blue">
            <h3>Expiring in 30 days</h3>
            <div className="value">{stats.expiring_30_days}</div>
          </div>
          <div className="report-card">
            <h3>Expiring in 60 days</h3>
            <div className="value">{stats.expiring_60_days}</div>
          </div>
          <div className="report-card">
            <h3>Total value at risk</h3>
            <div className="value">{formatCurrency(stats.total_value_risk)}</div>
          </div>
          <div className="report-card">
            <h3>Notice pending</h3>
            <div className="value">{stats.notice_pending}</div>
          </div>
        </div>

        {/* Details Table */}
        <section className="report-details">
          <h3>Lease expiry details</h3>
          <table className="styled-table plain">
            <thead>
              <tr>
                <th>Tenant Name and unit</th>
                <th>Rent amount</th>
                <th>ID</th>
                <th>Status</th>
                <th>Expiry date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((lease, i) => (
                <tr key={i}>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar small">{lease.company_name ? lease.company_name[0] : 'T'}</div>
                      <div>
                        <div className="name">{lease.company_name}</div>
                        <div className="sub-id">ID: #P-{1000 + lease.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>₹{lease.monthly_rent?.toLocaleString()}</td>
                  <td>#{1000 + lease.id}</td>
                  <td>
                    <span className={`status-pill ${lease.status === 'active' ? 'success' : 'warning'}`}>
                      {lease.status === 'active' ? 'notice due' : lease.status}
                    </span>
                  </td>
                  <td>{new Date(lease.lease_end).toLocaleDateString()}</td>
                  <td>...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default LeaseReports;
