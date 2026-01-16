import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ownerAPI } from '../../services/api';
import './OwnerList.css';

const OwnerList = () => {
  // const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOwners();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setLoading(true);
      const params = {};
      if (search) params.search = search;

      const res = await ownerAPI.getOwners(params);
      setOwners(res.data.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch owners", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <div className="header-left">
            <div className="breadcrumb">
              <Link to="/admin/dashboard">HOME</Link> &gt; <span className="active">OWNERS</span>
            </div>
            <h1>Owner Management</h1>
            <p>Manage property owners and their details.</p>
          </div>
          <Link to="/admin/owner/add" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Owner
          </Link>
        </header>

        <div className="content-card">
          {/* Filters Bar */}
          <div className="filters-bar" style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
            <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '12px', color: '#64748b' }}
              >
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search owners by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div className="owner-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Contact Info</th>
                  <th>Owned Area</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan="5" className="empty-state">Loading owners...</td></tr>
                )}
                {!loading && owners.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No owners found. Click "Add Owner" to create one.
                    </td>
                  </tr>
                )}
                {!loading && owners.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <div className="owner-info-col">
                        <div className="owner-avatar">
                          {owner.name.charAt(0)}
                        </div>
                        <div className="owner-details">
                          <span className="owner-name">{owner.name}</span>
                          <span className="owner-id">ID: {owner.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="owner-details">
                        <span className="owner-email">{owner.email}</span>
                        <span style={{ fontSize: '0.85rem', color: '#718096' }}>{owner.phone}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {owner.total_owned_area || 0} sqft
                    </td>
                    <td>
                      <span className="status-badge active">Active</span>
                      {/* Assuming all fetched are active for now, or add owner.status logic */}
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/admin/owner/${owner.id}`} className="action-btn view" title="View Details">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </Link>
                        <Link to={`/admin/owner/edit/${owner.id}`} className="action-btn edit" title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerList;
