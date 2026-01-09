import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ownerAPI } from '../../services/api'; // Ensure this path is correct
import './OwnerDetails.css';

const OwnerDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                if (!id) throw new Error("No ID provided");

                // Use getById as defined in the provided api.js
                const response = await ownerAPI.getById(id);
                console.log("Full API Response:", response);

                // Try to find the actual data object
                let data = response.data || response;

                // If data is wrapped in a 'data' or 'user' or 'owner' property, unwrap it
                if (data && data.data) data = data.data;
                else if (data && data.owner) data = data.owner;
                else if (data && data.user) data = data.user;

                console.log("Resolved Owner Data:", data);

                if (!data) throw new Error("No data received");

                setOwner(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching owner:", err);
                setError(err.message || "Failed to load owner");
                setLoading(false);
            }
        };

        fetchOwnerData();
    }, [id]);

    if (loading) return <div className="owner-details-container">Loading...</div>;

    if (error) {
        return (
            <div className="owner-details-container">
                <div style={{ padding: '20px', color: 'red' }}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate('/admin/owner')}>Back to List</button>
                </div>
            </div>
        );
    }

    if (!owner) return <div className="owner-details-container">Owner not found</div>;

    // Helper to safely get name
    const displayName = owner.name || 'Unknown Owner';
    const displayId = owner.id || id;
    const joinedDate = owner.created_at ? new Date(owner.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A';
    const email = owner.email || 'N/A';
    const phone = owner.phone || 'N/A';
    const address = owner.address || 'N/A';
    const profileImage = owner.profile_image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop";

    // Representative Details
    const repName = owner.representative_name || 'N/A';
    const repPhone = owner.representative_phone || 'N/A';
    // const repEmail = owner.representative_email || 'N/A'; // Available if needed

    return (
        <div className="owner-details-container">
            <Sidebar />
            <main className="owner-details-content">
                <div className="breadcrumb">
                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/owner" style={{ textDecoration: 'none', color: 'inherit' }}>OWNER</Link> &gt; {displayName.toUpperCase()}
                </div>

                {/* Profile Header */}
                <header className="owner-profile-header">
                    <div className="profile-main">
                        <img
                            src={profileImage}
                            alt={displayName}
                            className="profile-avatar-large"
                        />
                        <div className="profile-info">
                            <h2>{displayName}</h2>
                            <p>ID: #OWN-{displayId} | Owner since {joinedDate}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn-message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Message
                        </button>
                        <button className="btn-edit" onClick={() => navigate(`/admin/owner/edit/${displayId}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit
                        </button>
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
                                    <p>{email}</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div className="contact-text">
                                    <label>Owner Phone Number</label>
                                    <p>{phone}</p>
                                </div>
                            </div>

                            <div className="contact-separator" style={{ height: '1px', background: '#eaeaea', margin: '16px 0' }}></div>

                            <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>Representative Contact</h4>
                            <div className="contact-item">
                                <div className="contact-icon" style={{ background: '#e6fffa', color: '#319795' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div className="contact-text">
                                    <label>Rep. Name</label>
                                    <p>{repName}</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon" style={{ background: '#e6fffa', color: '#319795' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </div>
                                <div className="contact-text">
                                    <label>Rep. Phone</label>
                                    <p>{repPhone}</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div className="contact-text">
                                    <label>Primary Address</label>
                                    <p>{address}</p>
                                </div>
                            </div>

                            <div className="map-placeholder">
                                <div className="map-overlay">View Map</div>
                            </div>
                        </div>

                        {/* Personal Information Card */}
                        <div className="side-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3>Personal Information</h3>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            </div>

                            <div className="personal-info-row">
                                <div className="info-label">
                                    <div className="info-icon-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                    <div className="info-content">
                                        <label>Full Name<span>*</span></label>
                                        <p>{displayName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="personal-info-row">
                                <div className="info-label">
                                    <div className="info-icon-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8H7v8" /><line x1="22" y1="0" x2="22" y2="0" /></svg>
                                    </div>
                                    <div className="info-content">
                                        <label>100% Ownership</label>
                                    </div>
                                </div>
                                <span className="badge-verified">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        {/* Status Row */}
                        {!loading && owner && (
                            <div style={{ marginBottom: '20px', display: 'none' }}>
                                {/* Hidden debug block placeholder */}
                            </div>
                        )}
                        {/* Stats Row */}
                        <div className="stats-row">
                            <div className="stat-widget">
                                <span className="stat-label">Total Units</span>
                                <span className="stat-number">12%</span>
                                <span className="stat-change">+2 this year</span>
                            </div>
                            <div className="stat-widget">
                                <span className="stat-label">Occupancy Rate</span>
                                <span className="stat-number">92%</span>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: '92%' }}></div>
                                </div>
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
                                <div className="units-controls">
                                    <div className="unit-search">
                                        <svg className="search-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <input type="text" placeholder="Search units..." />
                                    </div>
                                    <button className="btn-add-units">
                                        + Add Units
                                    </button>
                                </div>
                            </div>

                            <table className="units-table">
                                <thead>
                                    <tr>
                                        <th>Unit ID</th>
                                        <th>Address</th>

                                        <th>Rent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="unit-id-cell">
                                                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop" className="unit-thumb" alt="unit" />
                                                U-101
                                            </div>
                                        </td>
                                        <td>
                                            <div className="unit-address">
                                                <p>123 Maple Ave, Apt 4B</p>
                                                <span>Springfield, IL</span>
                                            </div>
                                        </td>

                                        <td className="rent-val">₹2,450</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="unit-id-cell">
                                                <img src="https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=2797&auto=format&fit=crop" className="unit-thumb" alt="unit" />
                                                U-102
                                            </div>
                                        </td>
                                        <td>
                                            <div className="unit-address">
                                                <p>123 Maple Ave, Apt 5A</p>
                                                <span>Springfield, IL</span>
                                            </div>
                                        </td>

                                        <td className="rent-val">₹1,800</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="unit-id-cell">
                                                <img src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=2665&auto=format&fit=crop" className="unit-thumb" alt="unit" />
                                                U-205
                                            </div>
                                        </td>
                                        <td>
                                            <div className="unit-address">
                                                <p>45 Pine St, Unit B</p>
                                                <span>Springfield, IL</span>
                                            </div>
                                        </td>

                                        <td className="rent-val">₹1,200</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>View all 12 units →</button>
                        </div>

                        {/* Documents Section */}
                        <div className="kyc-header">
                            <h3>KYC & Documents</h3>
                            <button className="view-all-docs" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>

                        <div className="docs-grid">
                            <div className="doc-card">
                                <div className="doc-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                </div>
                                <div className="doc-info">
                                    <h4 className="doc-name">Passport_ID_Scan...</h4>
                                    <span className="doc-date">Uploaded Jan 12, 2024</span>
                                    <div className="doc-meta">
                                        <span className="verified-tag">Verified</span>
                                        <span className="doc-size">2.4 MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="doc-card">
                                <div className="doc-icon blue">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </div>
                                <div className="doc-info">
                                    <h4 className="doc-name">Property_Deed_Sign...</h4>
                                    <span className="doc-date">Uploaded Mar 04, 2024</span>
                                    <div className="doc-meta">
                                        <span className="verified-tag">Verified</span>
                                        <span className="doc-size">4.1 MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="upload-card">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>Upload Document</span>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default OwnerDetails;
