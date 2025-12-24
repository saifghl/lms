import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Tenant.css';

const Tenant = () => {
    const navigate = useNavigate();

    const handleAddTenant = () => {
        navigate('/admin/tenant/add');
    };

    const tenants = [
        {
            id: 'TN-2023-001',
            name: 'John Smith',
            contact: '+1 (555) 012-3456',
            email: 'john.smith@example.com',
            area: '48,200',
            status: 'Verified',
            statusClass: 'verified'
        },
        {
            id: 'TN-2023-042',
            name: 'Sarah Connor',
            contact: '+1 (555) 987-6543',
            email: 'sarah.c@skynet.net',
            area: '11,750',
            status: 'Pending',
            statusClass: 'pending'
        },
        {
            id: 'TN-2023-089',
            name: 'Michael Chang',
            contact: '+1 (555) 456-7890',
            email: 'mike.chang@example.com',
            area: '34000',
            status: 'Verified',
            statusClass: 'verified'
        },
        {
            id: 'TN-2023-112',
            name: 'Emily Blunt',
            contact: '+1 (555) 222-3333',
            email: 'emily.b@example.com',
            area: '53200',
            status: 'Rejected',
            statusClass: 'rejected'
        },
        {
            id: 'TN-2023-156',
            name: 'Robert Downey',
            contact: '+1 (555) 777-8888',
            email: 'robert.d@example.com',
            area: '45000',
            status: 'Verified',
            statusClass: 'verified'
        }
    ];

    return (
        <div className="tenant-container">
            <Sidebar />
            <main className="tenant-content">
                <div className="breadcrumb">HOME &gt; TENANT</div>

                <header className="tenant-header">
                    <div className="tenant-title">
                        <h2>Tenant List</h2>
                        <p>Manage and view all registered tenants and their current status.</p>
                    </div>
                    <button className="add-tenant-btn" onClick={handleAddTenant}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Tenants
                    </button>
                </header>

                <div className="filter-bar">
                    <div className="search-area">
                        <svg className="search-icon-input" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search Tenant by name or email..." />
                    </div>

                    <div className="filter-actions">
                        <a href="#" className="clear-filters">Clear filters</a>
                        <div className="view-toggle">
                            <button className="toggle-btn active">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <button className="toggle-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <section className="tenant-table-container">
                    <div className="tenant-table-header">
                        <div>Tenant Name</div>
                        <div>Contact</div>
                        <div>Email</div>
                        <div>Area Occupied</div>
                        <div style={{ textAlign: 'center' }}>KYC Status</div>
                        <div style={{ textAlign: 'center' }}>Actions</div>
                    </div>

                    {tenants.map((tenant, index) => (
                        <div className="tenant-row" key={index}>
                            <div className="tenant-name-col">
                                <h4>{tenant.name}</h4>
                                <span className="tenant-id">ID: {tenant.id}</span>
                            </div>
                            <div className="contact-col">{tenant.contact}</div>
                            <div className="email-col">{tenant.email}</div>
                            <div className="area-col">{tenant.area}</div>
                            <div style={{ textAlign: 'center' }}>
                                <span className={`kyc-badge ${tenant.statusClass}`}>{tenant.status}</span>
                            </div>
                            <div className="actions-col" style={{ justifyContent: 'center' }}>
                                <button className="action-icon-btn" onClick={() => navigate(`/admin/tenant/${tenant.id}`)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                                <button className="action-icon-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                <footer className="table-footer">
                    <span>Showing 1 to 5 of 50 results</span>
                    <div className="pagination">
                        <span className="page-arrow">&lt;</span>
                        <span className="page-item active">1</span>
                        <span className="page-item">2</span>
                        <span className="page-item">3</span>
                        <span className="page-item">4</span>
                        <span className="page-item">5</span>
                        <span>...</span>
                        <span className="page-item">50</span>
                        <span className="page-arrow">&gt;</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Tenant;
