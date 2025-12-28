import React from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";

import { useNavigate } from "react-router-dom";

const LeaseDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      <RepSidebar />

      <div className="lease-dashboard-content">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back</p>
          </div>
          <button className="primary-btn" onClick={() => navigate('/admin/add-lease')}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create new lease
          </button>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h4>Pending Approvals</h4>
            </div>
            <div className="stat-value-row">
              <h3>12</h3>
              <span className="stat-change positive">+2 today</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill yellow" style={{ width: "60%" }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Lease Expiries</h4>
              <span className="badge-urgent">urgent</span>
            </div>
            <div className="stat-value-row">
              <h3>4</h3>
            </div>
            <p className="stat-subtext">Expires within 30 days</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Rental escalation</h4>
            </div>
            <div className="stat-value-row">
              <h3>15</h3>
              <span className="stat-change approved">Approved</span>
            </div>
            <p className="stat-subtext">effective next cycle</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Renewals Due</h4>
            </div>
            <div className="stat-value-row">
              <h3>8</h3>
            </div>
            <p className="stat-subtext">for next month</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h4>Total Active</h4>
            </div>
            <div className="stat-value-row">
              <h3>145</h3>
            </div>
            <span className="stat-change positive-trend">5% vs last month ↗</span>
          </div>
        </div>

        {/* Need Attention Section */}
        <div className="section-container">
          <h3>Need Attention</h3>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>ID</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar-placeholder img-1"></div>
                      <div className="tenant-info">
                        <span className="tenant-name">Sunset Apartments</span>
                        <span className="tenant-id">ID: #P-1024</span>
                      </div>
                    </div>
                  </td>
                  <td>11des2025</td>
                  <td>new lease</td>
                  <td>#1080</td>

                  <td>
                    <button className="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar-placeholder img-2"></div>
                      <div className="tenant-info">
                        <span className="tenant-name">Lakeside Commercial</span>
                        <span className="tenant-id">ID: #P-1045</span>
                      </div>
                    </div>
                  </td>
                  <td>11des2025</td>
                  <td>new lease</td>
                  <td>#1080</td>

                  <td>
                    <button className="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar-placeholder img-3"></div>
                      <div className="tenant-info">
                        <span className="tenant-name">Downtown Lofts</span>
                        <span className="tenant-id">ID: #P-1102</span>
                      </div>
                    </div>
                  </td>
                  <td>11des2025</td>
                  <td>escalation</td>
                  <td>#1080</td>

                  <td>
                    <button className="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar-placeholder img-4"></div>
                      <div className="tenant-info">
                        <span className="tenant-name">Oakwood Residence</span>
                        <span className="tenant-id">ID: #P-1120</span>
                      </div>
                    </div>
                  </td>
                  <td>11des2025</td>
                  <td>escalation</td>
                  <td>#1080</td>

                  <td>
                    <button className="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="tenant-cell">
                      <div className="avatar-placeholder img-5"></div>
                      <div className="tenant-info">
                        <span className="tenant-name">Miami Bay Villa</span>
                        <span className="tenant-id">ID: #P-1155</span>
                      </div>
                    </div>
                  </td>
                  <td>11des2025</td>
                  <td>escalation</td>
                  <td>#1080</td>

                  <td>
                    <button className="icon-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="show-more-container">
              <button className="show-more-btn">SHOW MORE ITEM</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-container quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">

            <button className="quick-action-card">
              <div className="qa-icon-circle red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </div>
              <span>NEW LEASE</span>
            </button>

            <button className="quick-action-card">
              <div className="qa-icon-circle green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span>APPROVE</span>
            </button>

            <button className="quick-action-card">
              <div className="qa-icon-circle purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <span>NEW LEASE</span>
            </button>

            <button className="quick-action-card">
              <div className="qa-icon-circle orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <span>EMAIL TENANT</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseDashboard;
