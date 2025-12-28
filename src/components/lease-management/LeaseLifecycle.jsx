import React from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "../management-rep/RepSidebar.css";
import "./leaseManagement.css";

const LeaseLifecycle = () => {
    return (
        <div className="dashboard-layout">
            <RepSidebar />

            <div className="lease-dashboard-content">
                {/* Page Header */}
                <div className="dashboard-header">
                    <div>
                        <h2>Review center</h2>
                        <p>
                            Manage and approve pending submission from data entry. you
                            have 27 atems pending
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="review-stats-grid">
                    <div className="review-stat-card">
                        <span className="review-stat-label">Projects</span>
                        <span className="review-stat-value">3</span>
                    </div>
                    <div className="review-stat-card">
                        <span className="review-stat-label">Units</span>
                        <span className="review-stat-value">12</span>
                    </div>
                    <div className="review-stat-card">
                        <span className="review-stat-label">Owners</span>
                        <span className="review-stat-value">1</span>
                    </div>
                    <div className="review-stat-card">
                        <span className="review-stat-label">Tenant</span>
                        <span className="review-stat-value">4</span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="nav-tabs">
                    <div className="nav-item">Project</div>
                    <div className="nav-item">Units</div>
                    <div className="nav-item">Owners</div>
                    <div className="nav-item">Tenant</div>
                    <div className="nav-item active">Lease</div>
                </div>

                {/* Pending Approvals Section */}
                <div className="section-container">
                    <h3>Pending lease approvals</h3>

                    <div className="approval-list">

                        {/* Card 1 */}
                        <div className="approval-card">
                            <div className="approval-header">
                                <div className="approval-title">
                                    <h4>ID: #P-1024</h4>
                                    <span className="approval-subtitle">Sunset Apartments</span>
                                </div>
                                <div className="approval-actions">
                                    <button className="btn-reject">REJECT</button>
                                    <button className="btn-approve">Approve</button>
                                </div>
                            </div>

                            <div className="approval-body">
                                <div>
                                    <div className="approval-details-grid">
                                        <div className="detail-item">
                                            <label>TENANT</label>
                                            <p>Raj Pawar</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>TERM</label>
                                            <p>12 month</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>RENT / MGR</label>
                                            <p>₹12,000</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>START DATE</label>
                                            <p>1 Nov 2023</p>
                                        </div>
                                    </div>
                                    <div className="submission-info">
                                        submitted by john jou on 12 nov 2023
                                    </div>
                                </div>

                                <div className="note-section">
                                    <textarea className="note-input" placeholder="Add Note"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 (Duplicate for visual density) */}
                        <div className="approval-card">
                            <div className="approval-header">
                                <div className="approval-title">
                                    <h4>ID: #P-1024</h4>
                                    <span className="approval-subtitle">Sunset Apartments</span>
                                </div>
                                <div className="approval-actions">
                                    <button className="btn-reject">REJECT</button>
                                    <button className="btn-approve">Approve</button>
                                </div>
                            </div>

                            <div className="approval-body">
                                <div>
                                    <div className="approval-details-grid">
                                        <div className="detail-item">
                                            <label>TENANT</label>
                                            <p>Raj Pawar</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>TERM</label>
                                            <p>12 month</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>RENT / MGR</label>
                                            <p>₹12,000</p>
                                        </div>
                                        <div className="detail-item">
                                            <label>START DATE</label>
                                            <p>1 Nov 2023</p>
                                        </div>
                                    </div>
                                    <div className="submission-info">
                                        submitted by john jou on 12 nov 2023
                                    </div>
                                </div>

                                <div className="note-section">
                                    <textarea className="note-input" placeholder="Add Note"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="show-more-container">
                        <button className="show-more-btn" style={{ textTransform: 'none', fontSize: '14px' }}>See all</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseLifecycle;
