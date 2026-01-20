import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RepSidebar from '../management-rep/RepSidebar';
import { leaseAPI } from '../../services/api';
import './leaseManagement.css';

const LeaseDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending_approvals: 0,
    lease_expiries: 0,
    rental_escalation: 0,
    renewals_due: 0,
    active_leases: 0,
    growth: "0% vs last month"
  });
  const [attentionItems, setAttentionItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, attentionRes] = await Promise.all([
          leaseAPI.getLeaseDashboardStats(),
          leaseAPI.getNeedAttentionLeases()
        ]);
        setStats(statsRes.data);
        setAttentionItems(attentionRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <RepSidebar />
      <main className="main-content lease-dashboard">
        <header className="page-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back</p>
          </div>
          <button className="primary-btn" onClick={() => navigate('/admin/add-lease')}>
            <span className="plus-icon">+</span> Create new lease
          </button>
        </header>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-header">Pending Approvals</div>
            <div className="stat-body">
              <span className="stat-value">{stats.pending_approvals}</span>
              <span className="stat-trend positive">+2 today</span>
            </div>
            <div className="progress-bar"><div className="fill warning" style={{ width: '40%' }}></div></div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Lease Expiries</div>
            <div className="stat-body">
              <span className="stat-value">{stats.lease_expiries}</span>
              <span className="stat-badge urgent">urgent</span>
            </div>
            <div className="stat-footer">Expires within 30 days</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Rental escalation</div>
            <div className="stat-body">
              <span className="stat-value">{stats.rental_escalation}</span>
              <span className="stat-badge success">Approved</span>
            </div>
            <div className="stat-footer">effective next cycle</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Renewals Due</div>
            <div className="stat-body">
              <span className="stat-value">{stats.renewals_due}</span>
            </div>
            <div className="stat-footer">for next month</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Total Active</div>
            <div className="stat-body">
              <span className="stat-value">{stats.active_leases}</span>
              <span className="stat-trend positive">{stats.growth} <img src="/trend-up.svg" alt="" /></span>
            </div>
          </div>
        </div>

        {/* Need Attention Section */}
        <section className="attention-section">
          <h3>Need Attention</h3>
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attentionItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="tenant-cell">
                        <div className="avatar">{item.tenant_name ? item.tenant_name[0] : 'T'}</div>
                        <div>
                          <div className="name">{item.tenant_name}</div>
                          <div className="sub-id">ID: #P-{1000 + item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(item.date || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{item.type}</td>
                    <td>#{1000 + item.id}</td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status === 'draft' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn"><i className="edit-icon">✎</i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="show-more-btn">SHOW MORE ITEM</button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/admin/add-lease')}>
              <div className="icon warning">+</div>
              <div className="label">NEW LEASE</div>
            </button>
            <button className="action-card">
              <div className="icon success">✔</div>
              <div className="label">APPROVE</div>
            </button>
            <button className="action-card">
              <div className="icon purple">📄</div>
              <div className="label">NEW LEASE</div>
            </button>
            <button className="action-card">
              <div className="icon danger">✉</div>
              <div className="label">EMAIL TENANT</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LeaseDashboard;
