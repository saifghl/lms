import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { unitAPI } from '../../services/api';
import './UnitDetails.css';

const UnitDetails = () => {
    const { id } = useParams();
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // TODO: Ideally, getUnitById should return tenant and owner info if subscribed.
    // For now, we will display what we have.

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const res = await unitAPI.getUnitById(id);
                setUnit(res.data.data || res.data);
            } catch (err) {
                console.error("Error fetching unit:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUnit();
    }, [id]);

    if (loading) return <div className="dashboard-container">Loading...</div>;
    if (!unit) return <div className="dashboard-container">Unit not found</div>;

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="unit-details-container">

                    {/* Header */}
                    <header className="details-header">
                        <div className="header-left">
                            <div className="breadcrumb">
                                <Link to="/admin/projects">PROJECT</Link> &gt;
                                <span>{unit.project_name}</span> &gt;
                                <span className="active">UNIT {unit.unit_number}</span>
                            </div>

                            <div className="title-row">
                                <h1>Unit {unit.unit_number} – {unit.project_name}</h1>
                                <span className={`status-badge ${unit.status}`}>
                                    {unit.status}
                                </span>
                            </div>

                            <p className="subtitle">
                                Project: {unit.project_name}
                                &nbsp;&nbsp; UnitNo:{unit.unit_number}
                                &nbsp;&nbsp; Floor:{unit.floor_number ?? "-"}
                            </p>
                        </div>

                        <Link to={`/admin/edit-unit/${unit.id}`} className="edit-unit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Unit
                        </Link>
                    </header>

                    {/* Content Grid */}
                    <div className="details-content">

                        {/* Profiles Row (UNCHANGED UI) */}
                        <div className="profiles-row">

                            {/* Tenant */}
                            <div className="profile-card tenant">
                                <div className="card-header">
                                    <div className="user-info">
                                        <div className="avatar tenant-avatar">
                                            <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=random" alt="Sarah" />
                                            <img src="https://ui-avatars.com/api/?name=Mike+Ross&background=random" alt="Mike" style={{ marginLeft: '-10px' }} />
                                        </div>
                                        <div>
                                            <h3>Sarah Smith & Mike Ross</h3>
                                            <span className="since">Since Jan 2021</span>
                                        </div>
                                    </div>
                                    <span className="badge active-lease">Active Lease</span>
                                </div>
                                <div className="card-footer">
                                    <span>Lease #: L-9921</span>
                                    <Link to="#" className="details-link">Details →</Link>
                                </div>
                            </div>

                            {/* Owner */}
                            <div className="profile-card owner">
                                <div className="card-header">
                                    <div className="user-info">
                                        <div className="avatar">
                                            <img src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff" alt="John" />
                                        </div>
                                        <div>
                                            <h3>John Doe</h3>
                                            <span className="since">100% Ownership</span>
                                        </div>
                                    </div>
                                    <span className="badge leased">Leased</span>
                                </div>
                                <div className="card-footer">
                                    <span></span>
                                </div>
                            </div>

                        </div>

                        {/* Gallery Section (UNCHANGED) */}
                        <div className="gallery-section">
                            <div className="gallery-grid">
                                <div className="gallery-item main">
                                    <div className="image-placeholder main-placeholder">
                                        <svg width="40" height="40" viewBox="0 0 24 24"
                                            fill="none" stroke="#cbd5e1" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="gallery-side">
                                    <div className="gallery-item">
                                        <div className="image-placeholder"></div>
                                    </div>
                                    <div className="gallery-item">
                                        <div className="image-placeholder">
                                            <button className="view-map-btn">View Map</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar (FROM DB) */}
                        <div className="stats-bar">
                            <div className="stat-item">
                                <label>Area:</label>
                                <div className="stat-values">
                                    <span>Super Area: {unit.super_area ?? "-"} sq ft</span>
                                    <span>Covered Area: {unit.covered_area ?? "-"} sq ft</span>
                                    <span>Carpet Area: {unit.carpet_area ?? "-"} sq ft</span>
                                </div>
                            </div>

                            <div className="stat-item">
                                <label>Fitment Status:</label>
                                <div className="stat-value big">
                                    {unit.unit_condition}
                                </div>
                            </div>

                            <div className="stat-item">
                                <label>Market Rent:</label>
                                <div className="stat-value big">
                                    ₹{unit.projected_rent ?? 0} / month
                                </div>
                            </div>

                            <div className="stat-item">
                                <label>Next Renewal:</label>
                                <div className="stat-values red-text">
                                    <span>Lease Expiry: Dec 31, 2025</span>
                                    <span>Expiring in 30 days</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity (UNCHANGED UI) */}
                        <div className="activity-section">
                            <h3>Recent Activity</h3>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot red"></div>
                                    <div className="timeline-content">
                                        <h4>Maintenance Request Created</h4>
                                        <p>"Kitchen sink is leaking"</p>
                                        <span className="time">2 days ago</span>
                                    </div>
                                </div>
                            </div>
                            <button className="view-all-activity-btn">View All Activity</button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default UnitDetails;
