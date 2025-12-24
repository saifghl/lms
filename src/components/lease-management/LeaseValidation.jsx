import React from "react";
import Sidebar from "../management-rep/sidebar";
import "./leaseManagement.css";

const LeaseValidation = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="lease-dashboard-content">
                {/* Page Header */}
                <div className="dashboard-header">
                    <div>
                        <h2>Lease Report</h2>
                        <p>
                            Generate and export detailed insights for lease expiring, upcoming
                            renewable , and rent escalations across your portfolio.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            className="primary-btn"
                            style={{
                                backgroundColor: "white",
                                color: "#111827",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                        >
                            Export pdf
                        </button>
                        <button
                            className="primary-btn"
                            style={{
                                backgroundColor: "white",
                                color: "#111827",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                        >
                            Export excel
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="nav-tabs">
                    <div className="nav-item active">Lease expiry</div>
                    <div className="nav-item">Lease renewal</div>
                    <div className="nav-item">Escalation</div>
                    <div className="nav-item">Active summary</div>
                </div>

                {/* Filters */}
                <div className="filter-container">
                    <div className="filter-group">
                        <label>Project Scope</label>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Project wise."
                        />
                    </div>
                    <div className="filter-group">
                        <label>Entities search</label>
                        <input type="text" className="filter-input" placeholder="search" />
                    </div>
                    <div className="filter-group">
                        <label>Expiry range</label>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="10oct2025 to 20 nov 2025"
                        />
                    </div>
                    <button className="apply-filters-btn">Apply filters</button>
                </div>

                {/* Summary Cards */}
                <div className="report-cards-grid">
                    <div className="report-card active">
                        <span className="report-card-title">Expiring in 30 days</span>
                        <span className="report-card-value">12</span>
                    </div>
                    <div className="report-card">
                        <span className="report-card-title">Expiring in 60 days</span>
                        <span className="report-card-value">34</span>
                    </div>
                    <div className="report-card">
                        <span className="report-card-title">Total value at risk</span>
                        <span className="report-card-value">₹442k</span>
                    </div>
                    <div className="report-card">
                        <span className="report-card-title">Notice pending</span>
                        <span className="report-card-value">8</span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="section-container">
                    <h3>Lease expiry details</h3>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tenat Name and unit</th>
                                    <th>Rent amount</th>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Expiry date</th>
                                    <th>Action</th>
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
                                    <td>₹12,500</td>
                                    <td>#1080</td>
                                    <td>
                                        <span className="status-pill notice-due">notice due</span>
                                    </td>
                                    <td>7 may 2025 10.00am</td>
                                    <td>
                                        <button className="icon-btn">...</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="tenant-cell">
                                            <div className="avatar-placeholder img-2"></div>
                                            <div className="tenant-info">
                                                <span className="tenant-name">
                                                    Lakeside Commercial
                                                </span>
                                                <span className="tenant-id">ID: #P-1045</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>₹12,500</td>
                                    <td>#2010</td>
                                    <td>
                                        <span className="status-pill renewed">renewed</span>
                                    </td>
                                    <td>7 may 2025 10.00am</td>
                                    <td>
                                        <button className="icon-btn">...</button>
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
                                    <td>₹12,500</td>
                                    <td>#1050</td>
                                    <td>
                                        <span className="status-pill negotiating">
                                            Negoshiating
                                        </span>
                                    </td>
                                    <td>7 may 2025 10.00am</td>
                                    <td>
                                        <button className="icon-btn">...</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="tenant-cell">
                                            <div className="avatar-placeholder img-4"></div>
                                            <div className="tenant-info">
                                                <span className="tenant-name">
                                                    Oakwood Residence
                                                </span>
                                                <span className="tenant-id">ID: #P-1120</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>₹12,500</td>
                                    <td>#2040</td>
                                    <td>
                                        <span className="status-pill notice-due">notice due</span>
                                    </td>
                                    <td>7 may 2025 10.00am</td>
                                    <td>
                                        <button className="icon-btn">...</button>
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
                                    <td>₹12,500</td>
                                    <td>#1070</td>
                                    <td>
                                        <span className="status-pill terminating">
                                            Terminating
                                        </span>
                                    </td>
                                    <td>7 may 2025 10.00am</td>
                                    <td>
                                        <button className="icon-btn">...</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseValidation;
