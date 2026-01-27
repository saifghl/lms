import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';
import './leases.css';
import { leaseAPI, getProjects, getProjectLocations } from '../../services/api';

const Leases = () => {
    const [searchParams] = useSearchParams();
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [search, setSearch] = useState('');
    const [projects, setProjects] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetchFilters();

        // Handle URL params
        const filterParam = searchParams.get('filter');
        if (filterParam === 'renewals') setEventFilter('90'); // Matches Dashboard (Upcoming Renewals - 90 days)
        if (filterParam === 'expiries') setEventFilter('60'); // Matches Dashboard (Upcoming Expiries - 60 days)
        if (filterParam === 'escalations') setEventFilter('escalation');
    }, [searchParams]);

    useEffect(() => {
        fetchLeases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, projectFilter, locationFilter, eventFilter]);

    const fetchFilters = async () => {
        try {
            const [projectsRes, locationsRes] = await Promise.all([
                getProjects(),
                getProjectLocations()
            ]);
            setProjects(projectsRes.data?.data || []);
            setLocations(locationsRes.data || []);
        } catch (err) {
            console.error('Failed to fetch filter data:', err);
        }
    };

    const fetchLeases = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (projectFilter) params.project_id = projectFilter;
            if (locationFilter) params.location = locationFilter;
            if (eventFilter) {
                if (eventFilter === 'escalation') {
                    params.upcoming_escalations = true;
                } else {
                    params.expires_in = eventFilter;
                }
            }
            if (search) params.search = search;

            const res = await leaseAPI.getAllLeases(params);
            setLeases(res.data);
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
                            <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <span className="active">LEASES</span>
                        </div>
                        <h1>Lease Management</h1>
                        <p>View and manage all active lease agreements and contracts.</p>
                    </div>
                    {/* Link to Create Lease page */}
                    <Link to="/admin/add-lease" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Lease
                    </Link>
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
                                    <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
                                        <option value="">All Events</option>
                                        <option value="30">Expiring in 30 Days</option>
                                        <option value="60">Expiring in 60 Days</option>
                                        <option value="90">Expiring in 90 Days</option>
                                        <option value="escalation">Rent Escalations Due</option>
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>


                            <div className="filter-item">
                                <label>Project</label>
                                <div className="select-wrapper">
                                    <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
                                        <option value="">All Projects</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.project_name}</option>
                                        ))}
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>

                            <div className="filter-item">
                                <label>Location</label>
                                <div className="select-wrapper">
                                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                                        <option value="">All Locations</option>
                                        {locations.map((loc, index) => (
                                            <option key={index} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <svg className="chevron-down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>

                            <div className="filter-item header-search" style={{ flex: 1.5, minWidth: '200px' }}>
                                <div className="search-wrapper" style={{ width: '100%' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input
                                        type="text"
                                        placeholder="Search leases..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && fetchLeases()}
                                    />
                                </div>
                            </div>



                        </div>
                    </div>


                    {/* Leases Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Lease ID</th>
                                    <th>Unit</th>
                                    <th>Tenant</th>
                                    <th>Duration</th>
                                    <th>Rent / Month</th>
                                    <th>Deposit</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>Loading leases...</td>
                                    </tr>
                                )}
                                {!loading && leases.length === 0 && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>No leases found.</td>
                                    </tr>
                                )}
                                {!loading && leases.map((lease) => (
                                    <tr key={lease.id}>
                                        <td className="id-cell">
                                            <Link to={`/admin/view-lease/${lease.id}`} style={{ textDecoration: 'none', color: '#2e66ff', fontWeight: 600 }}>
                                                L-{lease.id}
                                            </Link>
                                        </td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{lease.unit_number || 'N/A'}</span>
                                                <span className="secondary-text">{lease.project_name || 'Project'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>
                                                    {(lease.tenant_name || 'T')[0]}
                                                </div>
                                                {lease.tenant_name || lease.sub_tenant_name || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-stacked">
                                                <span className="primary-text">{formatDate(lease.lease_start)}</span>
                                                <span className="secondary-text">to {formatDate(lease.lease_end)}</span>
                                            </div>
                                        </td>
                                        <td>{formatCurrency(lease.monthly_rent)}</td>
                                        <td>{formatCurrency(lease.security_deposit)}</td>
                                        <td>
                                            <span className={`status-badge ${lease.status ? lease.status.toLowerCase() : 'draft'}`}>
                                                {lease.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                                <Link to={`/admin/view-lease/${lease.id}`} className="action-btn" title="View Details">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </Link>
                                                <Link to={`/admin/edit-lease/${lease.id}`} className="action-btn" title="Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>Showing {leases.length} results</span>
                        <div className="page-nav">
                            <button disabled>&lt;</button>
                            <span>1</span>
                            <button>&gt;</button>
                        </div>
                    </div>

                </div>
            </main >
        </div >
    );
};

export default Leases;
