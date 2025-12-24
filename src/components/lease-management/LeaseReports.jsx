import React from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "../management-rep/RepSidebar.css";
import "./leaseManagement.css";

const LeaseReports = () => {
    return (
        <div className="dashboard-layout">
            <RepSidebar />

            <div className="lease-dashboard-content">
                {/* Page Header */}
                <div className="dashboard-header">
                    <h2>Lease Tracker Dashboard</h2>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="date-range-btn">
                            📅 Oct 2023-2025
                        </button>
                        <button className="primary-btn">
                            📥 Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="tracker-stats-grid">
                    <div className="tracker-card">
                        <div className="tracker-card-header">
                            <span>Expiring(90 days)</span>
                        </div>
                        <div className="tracker-card-value">12</div>
                        <div className="tracker-card-footer positive">+2 these week</div>
                    </div>

                    <div className="tracker-card">
                        <div className="tracker-card-header">
                            <span>Renewals pending</span>
                        </div>
                        <div className="tracker-card-value">8</div>
                        <div className="tracker-card-footer urgent">Need Attention</div>
                    </div>

                    <div className="tracker-card">
                        <div className="tracker-card-header">
                            <span>Escalation Due</span>
                        </div>
                        <div className="tracker-card-value">5</div>
                        <div className="tracker-card-footer positive">-1 last week</div>
                    </div>

                    <div className="tracker-card">
                        <div className="tracker-card-header">
                            <span>Lok in ending</span>
                        </div>
                        <div className="tracker-card-value">3</div>
                        <div className="tracker-card-footer neutral">Next 30 days</div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="tracker-filter-row">
                    <div className="tracker-search">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder="" />
                    </div>

                    <button className="filter-pill active">All lease</button>
                    <button className="filter-link">Expiring soon</button>
                    <button className="filter-link">Active</button>
                    <button className="filter-link">Negosiating</button>
                </div>

                {/* List Items */}
                <div className="tracker-list">

                    {/* Item 1 */}
                    <div className="tracker-item">
                        <div className="tracker-info">
                            <h3>Sunset appartment</h3>
                            <span className="tracker-id">ID: #P-1024</span>
                        </div>
                        <div className="tracker-progress-section">
                            <span className="tracker-date-label">Oct 2023-2025</span>
                            <div className="tracker-progress-bar">
                                <div className="progress-fill red" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div className="tracker-action">
                            <button className="btn-view-details">View details</button>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="tracker-item">
                        <div className="tracker-info">
                            <h3>Sunset appartment</h3>
                            <span className="tracker-id">ID: #P-1024</span>
                        </div>
                        <div className="tracker-progress-section">
                            <span className="tracker-date-label">Oct 2023-2025</span>
                            <div className="tracker-progress-bar">
                                <div className="progress-fill red" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div className="tracker-action">
                            <button className="btn-view-details">View details</button>
                        </div>
                    </div>

                </div>

                <div className="show-more-container">
                    <span className="show-more-text">See all</span>
                </div>

            </div>
        </div>
    );
};

export default LeaseReports;
