import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';
import './leases.css';

const Leases = () => {
    // TODO: Backend - Fetch leases list from API with pagination
    // useEffect(() => {
    //   fetch('/api/leases?page=1&limit=10').then(...)
    // }, []);

    // Mock Data based on the design image
    const leases = [
        {
            id: '#L-2023-001',
            project: 'Sunrise Apartments',
            unit: 'Unit A-101',
            tenant: 'John Smith',
            rent: '₹1,200.00',
            deposit: '₹2,400.00',
            termStart: 'Jan 01, 2023',
            termEnd: 'Dec 31, 2023'
        },
        {
            id: '#L-2023-045',
            project: 'Oakwood Residency',
            unit: 'Unit D-304',
            tenant: 'Emma Wilson',
            rent: '₹1,850.00',
            deposit: '₹3,700.00',
            termStart: 'Mar 15, 2023',
            termEnd: 'Mar 14, 2024'
        },
        {
            id: '#L-2022-892',
            project: 'Marina Heights',
            unit: 'Unit P-501',
            tenant: 'Robert Johnson',
            rent: '₹2,500.00',
            deposit: '₹5,000.00',
            termStart: 'Jun 01, 2022',
            termEnd: 'May 31, 2023'
        },
        {
            id: '#L-2023-112',
            project: 'Sunrise Apartments',
            unit: 'Unit C-202',
            tenant: 'Maria Lopez',
            rent: '₹1,350.00',
            deposit: '₹2,700.00',
            termStart: 'Aug 01, 2023',
            termEnd: 'Jul 31, 2024'
        }
    ];

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <span className="active">LEASE LIST</span>
                        </div>
                        <h1>Lease Management</h1>
                        <p>View and manage all active lease agreements and contracts.</p>
                    </div>
                    {/* TODO: Link to Create Lease page when created */}
                    <Link to="/admin/add-lease" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>+ Create Lease</Link>
                </header>

                <div className="content-card">
                    {/* Filters Bar */}
                    <div className="filters-bar">
                        <div className="leases-filter-group">
                            <div className="filter-item">
                                <label>Status Filter</label>
                                <div className="select-wrapper">
                                    <select defaultValue="All Statuses">
                                        <option>All Statuses</option>
                                        <option>Active</option>
                                        <option>Expiring</option>
                                        <option>Terminated</option>
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                            <div className="filter-item">
                                <label>Upcoming Events</label>
                                <div className="select-wrapper">
                                    <select defaultValue="All Events">
                                        <option>All Events</option>
                                        <option>Renewal</option>
                                        <option>Expiry</option>
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                            <div className="filter-item">
                                <label>Project</label>
                                <div className="select-wrapper">
                                    <select defaultValue="All Projects">
                                        <option>All Projects</option>
                                        <option>Sunrise Apartments</option>
                                        <option>Oakwood Residency</option>
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                            <div className="filter-item">
                                <button className="more-filters-btn">
                                    More Filters
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                </button>
                            </div>
                        </div>
                        <div className="view-actions">
                            <button className="view-btn list active">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                            <button className="view-btn grid">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                    </div>

                    {/* Leases Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Lease ID</th>
                                    <th>Project / Unit</th>
                                    <th>Tenant</th>
                                    <th>Monthly Rent</th>
                                    <th>Deposit</th>
                                    <th>Term</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leases.map((lease, index) => (
                                    <tr key={index}>
                                        <td className="id-cell">
                                            <Link to={`/admin/view-lease/${encodeURIComponent(lease.id)}`} style={{ textDecoration: 'none', color: '#4299e1', fontWeight: 500 }}>
                                                {lease.id}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{lease.project}</span>
                                                <span className="secondary-text">{lease.unit}</span>
                                            </div>
                                        </td>
                                        <td>{lease.tenant}</td>
                                        <td>{lease.rent}</td>
                                        <td>{lease.deposit}</td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{lease.termStart}</span>
                                                <span className="secondary-text">to {lease.termEnd}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Link to={`/admin/edit-lease/${encodeURIComponent(lease.id)}`} className="action-btn" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>Showing 1 to 10 of 45 results</span>
                        <div className="page-nav">
                            <button disabled>&lt;</button>
                            <span>1</span>
                            <button>2</button>
                            <button>3</button>
                            <button>4</button>
                            <span>...</span>
                            <button>45</button>
                            <button>&gt;</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Leases;
