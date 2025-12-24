import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './UnitDetails.css';

const UnitDetails = () => {
    const { id } = useParams();

    // TODO: Backend - Fetch comprehensive unit details, tenant info, owner info, and activity logs
    // useEffect(() => { fetch(`/api/units/${id}/details`).then(...) }, [id]);

    const unitId = id || "402";

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="unit-details-container">

                    {/* Header */}
                    <header className="details-header">
                        <div className="header-left">
                            <div className="breadcrumb">
                                <Link to="/admin/projects">PROJECT</Link> &gt; <span>SUNSET APARTMENTS</span> &gt; <span className="active">UNIT {unitId}-B</span>
                            </div>
                            <div className="title-row">
                                <h1>Unit {unitId} – The Highland Towers</h1>
                                <span className="status-badge leased">Leased</span>
                            </div>
                            <p className="subtitle">Project: The Highland Towers &nbsp;&nbsp; UnitNo:{unitId} &nbsp;&nbsp; Floor:4</p>
                        </div>
                        <Link to={`/admin/edit-unit/${unitId}`} className="edit-unit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit Unit
                        </Link>
                    </header>

                    {/* Content Grid */}
                    <div className="details-content">

                        {/* Profiles Row */}
                        <div className="profiles-row">
                            {/* Tenant Card */}
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
                                    <Link to="#" className="details-link">Details &rarr;</Link>
                                </div>
                            </div>

                            {/* Owner Card */}
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
                                    <span></span> {/* Spacer */}
                                    {/* <Link to="#" className="details-link">Details &rarr;</Link> */}
                                </div>
                            </div>
                        </div>

                        {/* Gallery Row */}
                        <div className="gallery-section">
                            <div className="gallery-grid">
                                <div className="gallery-item main">
                                    {/* Placeholder for uploaded image */}
                                    <div className="image-placeholder main-placeholder">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                </div>
                                <div className="gallery-side">
                                    <div className="gallery-item">
                                        <div className="image-placeholder">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        </div>
                                    </div>
                                    <div className="gallery-item">
                                        <div className="image-placeholder">
                                            <button className="view-map-btn">View Map</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="stats-bar">
                            <div className="stat-item">
                                <label>Area:</label>
                                <div className="stat-values">
                                    <span>Super Area: 1,500 sq ft</span>
                                    <span>Covered Area: 1,200 sq ft</span>
                                    <span>Carpet Area: 1,000 sq ft</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <label>Fitment Status:</label>
                                <div className="stat-value big">Fully Fitted</div>
                            </div>
                            <div className="stat-item">
                                <label>Market Rent:</label>
                                <div className="stat-value big">$2,200 / month</div>
                            </div>
                            <div className="stat-item">
                                <label>Next Renewal:</label>
                                <div className="stat-values red-text">
                                    <span>Lease Expiry: Dec 31, 2025</span>
                                    <span>Expiring in 30 days</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="activity-section">
                            <h3>Recent Activity</h3>
                            <div className="timeline">

                                <div className="timeline-item">
                                    <div className="timeline-dot red"></div>
                                    <div className="timeline-content">
                                        <h4>Maintenance Request Created</h4>
                                        <p>"Kitchen sink is leaking" reported by tenant.</p>
                                        <span className="time">2 days ago</span>
                                    </div>
                                </div>

                                <div className="timeline-item">
                                    <div className="timeline-dot green"></div>
                                    <div className="timeline-content">
                                        <h4>Rent Payment Received</h4>
                                        <p>Payment of $2,400.00 processed successfully.</p>
                                        <span className="time">5 days ago</span>
                                    </div>
                                </div>

                                <div className="timeline-item">
                                    <div className="timeline-dot blue"></div>
                                    <div className="timeline-content">
                                        <h4>Quarterly Inspection</h4>
                                        <p>Routine inspection completed by Management.</p>
                                        <span className="time">2 weeks ago</span>
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
