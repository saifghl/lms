import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ownerAPI, unitAPI } from '../../services/api';
import './OwnerDetails.css';

const OwnerDetails = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await ownerAPI.getOwnerById(id);
        // The backend getOwnerById returns: { owner: {...}, units: [...] }
        // Check implementation in ownerController.js
        // exports.getOwnerById sends: res.json({ owner, units });

        const data = response.data;
        setOwner(data.owner);
        setUnits(data.units || []);
      } catch (err) {
        console.error("Error fetching owner details:", err);
        setError("Failed to load owner details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) return <div className="owner-details-container"><Sidebar /><div className="owner-details-content">Loading...</div></div>;
  if (error) return <div className="owner-details-container"><Sidebar /><div className="owner-details-content">{error}</div></div>;
  if (!owner) return <div className="owner-details-container"><Sidebar /><div className="owner-details-content">Owner not found.</div></div>;

  return (
    <div className="owner-details-container">
      <Sidebar />
      <main className="owner-details-content">
        <div className="breadcrumb">HOME &gt; OWNER &gt; {owner.name?.toUpperCase()}</div>

        {/* Profile Header */}
        <header className="owner-profile-header">
          <div className="profile-main">
            <div className="profile-avatar-large" style={{ backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff' }}>
              {owner.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{owner.name}</h2>
              <p>ID: #OWN-{owner.id} | Owner since {new Date(owner.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Message
            </button>
            <Link to={`/admin/owner/edit/${owner.id}`} className="btn-edit" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </Link>
            <button className="btn-more">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
        </header>

        <div className="details-layout">
          {/* Left Column */}
          <div className="left-column">
            {/* Contact Details Card */}
            <div className="side-card">
              <h3>Contact Details</h3>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div className="contact-text">
                  <label>Owner Email Address</label>
                  <p>{owner.email}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div className="contact-text">
                  <label>Owner Phone Number</label>
                  <p>{owner.phone}</p>
                </div>
              </div>

              <div className="contact-separator" style={{ height: '1px', background: '#eaeaea', margin: '16px 0' }}></div>

              <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>Representative Contact</h4>
              {owner.representative_name ? (
                <>
                  <div className="contact-item">
                    <div className="contact-icon" style={{ background: '#e6fffa', color: '#319795' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div className="contact-text">
                      <label>Rep. Name</label>
                      <p>{owner.representative_name}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon" style={{ background: '#e6fffa', color: '#319795' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div className="contact-text">
                      <label>Rep. Phone</label>
                      <p>{owner.representative_phone || 'N/A'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>No representative info.</p>
              )}

              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="contact-text">
                  <label>Primary Address</label>
                  <p>{owner.address || "N/A"}</p>
                </div>
              </div>

            </div>

            {/* Personal Information Card */}
            <div className="side-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Personal Information</h3>
              </div>

              <div className="personal-info-row">
                <div className="info-label">
                  <div className="info-content">
                    <label>GST Number</label>
                    <p>{owner.gst_number || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="personal-info-row">
                <div className="info-label">
                  <div className="info-content">
                    <label>KYC Status</label>
                    <p>{owner.kyc_status || "Pending"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-widget">
                <span className="stat-label">Total Units</span>
                <span className="stat-number">{units.length}</span>
              </div>
              <div className="stat-widget">
                <span className="stat-label">Total Area</span>
                <span className="stat-number">{owner.total_owned_area || 0} sqft</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-nav">
              <div className="tab-link active">Overview & Units</div>
              <div className="tab-link">KYC Documents</div>
            </div>

            {/* Mapped Units */}
            <div className="mapped-units-section">
              <div className="mapped-units-header">
                <h3>Mapped Units</h3>
              </div>

              <table className="units-table">
                <thead>
                  <tr>
                    <th>Unit ID</th>
                    <th>Project</th>
                    <th>Area (Sq Ft)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {units.length === 0 ? (
                    <tr><td colSpan="4">No units mapped.</td></tr>
                  ) : (
                    units.map(unit => (
                      <tr key={unit.id}>
                        <td>
                          <div className="unit-id-cell">
                            {unit.unit_number}
                          </div>
                        </td>
                        <td>{unit.project_name || 'N/A'}</td>
                        <td>{unit.super_area}</td>
                        <td>{unit.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDetails;
