import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';
import './leases.css';

const Leases = () => {
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchLeases();
    }, [statusFilter]);

    const fetchLeases = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const url = statusFilter 
                ? `http://localhost:5000/api/leases?status=${statusFilter}`
                : 'http://localhost:5000/api/leases';
            
            const res = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
                const data = await res.json();
                setLeases(data);
            } else {
                setLeases([]);
            }
        } catch (err) {
            console.error('Failed to fetch leases:', err);
            setLeases([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

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
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="">All Statuses</option>
                                        <option value="draft">Draft</option>
                                        <option value="approved">Approved</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="terminated">Terminated</option>
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
                                {loading && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                                    </tr>
                                )}
                                {!loading && leases.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No leases found</td>
                                    </tr>
                                )}
                                {!loading && leases.map((lease) => (
                                    <tr key={lease.id}>
                                        <td className="id-cell">
                                            <Link to={`/admin/view-lease/${lease.id}`} style={{ textDecoration: 'none', color: '#4299e1', fontWeight: 500 }}>
                                                L-{lease.id}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{lease.project_name || 'N/A'}</span>
                                                <span className="secondary-text">{lease.unit_number || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>{lease.tenant_name || lease.sub_tenant_name || 'N/A'}</td>
                                        <td>{formatCurrency(lease.monthly_rent)}</td>
                                        <td>{formatCurrency(lease.security_deposit)}</td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{formatDate(lease.lease_start)}</span>
                                                <span className="secondary-text">to {formatDate(lease.lease_end)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Link to={`/admin/edit-lease/${lease.id}`} className="action-btn" title="Edit">
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
