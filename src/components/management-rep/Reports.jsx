import React from 'react';
import RepSidebar from './RepSidebar';
import './Reports.css';

const Reports = () => {
    return (
        <div className="reports-container">
            <RepSidebar />

            <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}> {/* Content Wrapper */}

                {/* Header */}
                <div className="reports-header">
                    <h1>Reports</h1>
                    <p>Over see lease related operations and generate insights across your managed properties.</p>
                </div>

                {/* Filters & Controls */}
                <div className="reports-filters-card">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>PROJECTS</label>
                            <select className="filter-select">
                                <option>All Projects</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>OWNERS</label>
                            <select className="filter-select">
                                <option>All Owners</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>TENANT</label>
                            <select className="filter-select">
                                <option>All Tenant</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>RANGE</label>
                            <select className="filter-select">
                                <option>All Range</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>DATE</label>
                            <button className="filter-date-btn">
                                📅 Oct 2023-2025
                            </button>
                        </div>
                    </div>

                    <div className="report-tabs">
                        <span className="report-tab active">Lease Reports</span>
                        <span className="report-tab">Payment report</span>
                        <span className="report-tab">Expiry report</span>
                    </div>

                    <div className="report-actions-row">
                        <div className="search-bar-container">
                            <span className="search-icon-inside">🔍</span>
                            <input type="text" className="report-search-input" placeholder="" />
                        </div>
                        <button className="export-report-btn">
                            📥 Export Report
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="reports-table-container">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ReportRow
                                name="Sunset Apartments" id="#P-1024" date="11des2025" type="Monthly lease" status="Ready"
                                img="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=50&h=50&fit=crop"
                            />
                            <ReportRow
                                name="Lakeside Commercial" id="#P-1045" date="11des2025" type="Occupancy" status="Generating"
                                img="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=50&h=50&fit=crop"
                            />
                            <ReportRow
                                name="Downtown Lofts" id="#P-1102" date="11des2025" type="Forecasting" status="Planning"
                                img="https://images.unsplash.com/photo-1460317442991-0ec124380ae4?w=50&h=50&fit=crop"
                            />
                            <ReportRow
                                name="Oakwood Residence" id="#P-1120" date="11des2025" type="Financial" status="Ready"
                                img="https://images.unsplash.com/photo-1448630360428-65456885c650?w=50&h=50&fit=crop"
                            />
                            <ReportRow
                                name="Miami Bay Villa" id="#P-1155" date="11des2025" type="lease mgmt" status="Failed"
                                img="https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=50&h=50&fit=crop"
                            />
                        </tbody>
                    </table>
                    <div className="table-footer">
                        <span>Showing 1 to 5 of 42 results</span>
                        <div className="pagination">
                            <span className="page-num disable">‹</span>
                            <span className="page-num active">1</span>
                            <span className="page-num">2</span>
                            <span className="page-num">3</span>
                            <span className="page-num">4</span>
                            <span className="page-num">5</span>
                            <span>...</span>
                            <span className="page-num">42</span>
                            <span className="page-num">›</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ReportRow = ({ name, id, date, type, status, img }) => {
    const getStatusClass = (s) => s.toLowerCase();

    return (
        <tr>
            <td>
                <div className="project-cell">
                    <div className="project-icon" style={{ backgroundImage: `url(${img})` }}></div>
                    <div className="project-info">
                        <h4>{name}</h4>
                        <span className="project-id">ID: {id}</span>
                    </div>
                </div>
            </td>
            <td><span className="date-text">{date}</span></td>
            <td><span className="type-text">{type}</span></td>
            <td><span className={`status-badge ${getStatusClass(status)}`}>{status}</span></td>
            <td>
                <button className="action-btn">👁️</button>
            </td>
        </tr>
    );
};

export default Reports;
