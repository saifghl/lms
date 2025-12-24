import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './units.css';

const Units = () => {
    // Mock Data based on the    // TODO: Backend - Fetch units list from API with pagination
    // useEffect(() => {
    //   fetch('/api/units?page=1&limit=10').then(...)
    // }, []);

    // Mock Data
    const units = [
        {
            id: 'A-101',
            building: 'Sunset Heights',
            area: '1,200',
            status: 'Vacant',
            statusDesc: 'Available for leasing',
            statusType: 'vacant'
        },
        {
            id: 'A-102',
            building: 'Sunset Heights',
            area: '1,200',
            status: 'Leased',
            statusDesc: 'Expiring in 20 days',
            statusType: 'leased-expiring'
        },
        {
            id: 'B-405',
            building: 'Skyline Tower',
            area: '850',
            status: 'Leased',
            statusDesc: 'Active lease',
            statusType: 'leased-active'
        },
        {
            id: 'B-406',
            building: 'Skyline Tower',
            area: '850',
            status: 'Vacant',
            statusDesc: 'Available from 01 Dec 2024',
            statusType: 'vacant'
        },
        {
            id: 'G-001',
            building: 'Mall Plaza',
            area: '2,400',
            status: 'Fitout',
            statusDesc: 'Interior work in progress',
            statusType: 'fitout'
        }
    ];

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <Link to="/admin/dashboard">HOME</Link> &gt; <Link to="/admin/projects">PROJECTS</Link> &gt; <span className="active">UNITS INVENTORY</span>
                        </div>
                        <h1>Unit Management</h1>
                        <p>Manage your property inventory, availability, and unit details.</p>
                    </div>
                    <Link to="/admin/add-unit" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>+ Add Units</Link>
                </header>

                <div className="content-card">
                    {/* Filters Bar */}
                    <div className="filters-bar">
                        <div className="search-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search by Unit No, Tenant, or Building..." />
                        </div>
                        <div className="filter-group">
                            <div className="dropdown-filter">
                                <span>Building: All</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div className="dropdown-filter">
                                <span>Unit Type: All</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div className="dropdown-filter">
                                <span>Status: All</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        <div className="view-actions">
                            <button className="icon-btn active">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                            <button className="icon-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button className="text-btn">Clear filters</button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Unit No</th>
                                    <th>Tower/Building</th>
                                    <th>Area (SQ FT)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit) => (
                                    <tr key={unit.id}>
                                        <td className="unit-id">{unit.id}</td>
                                        <td>{unit.building}</td>
                                        <td>{unit.area}</td>
                                        <td>
                                            <div className="status-cell">
                                                <span className={`badge ${unit.statusType.split('-')[0]}`}>
                                                    <span className="dot"></span>
                                                    {unit.status}
                                                </span>
                                                <span className="status-desc">{unit.statusDesc}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/admin/view-unit/${unit.id}`} className="action-btn view" title="View">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </Link>
                                                <Link to={`/admin/edit-unit/${unit.id}`} className="action-btn edit" title="Edit">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Rows per page: 10 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                        <span>1—5 of 124</span>
                        <div className="page-nav">
                            <button disabled>&lt;</button>
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>...</span>
                            <span>12</span>
                            <button>&gt;</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Units;
