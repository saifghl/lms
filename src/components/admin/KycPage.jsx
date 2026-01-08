import React from 'react';
import Sidebar from './Sidebar';
import './KycPage.css';

const KycPage = () => {
    // Mock Data for KYC
    const kycRequests = [
        {
            id: 1,
            name: 'John Doe',
            type: 'Tenant',
            documentType: 'Aadhar Card',
            status: 'Pending',
            date: '2024-01-15',
            avatar: '1'
        },
        {
            id: 2,
            name: 'Jane Smith',
            type: 'Owner',
            documentType: 'PAN Card',
            status: 'Verified',
            date: '2024-01-14',
            avatar: '2'
        },
        {
            id: 3,
            name: 'Robert Brown',
            type: 'Tenant',
            documentType: 'Passport',
            status: 'Rejected',
            date: '2024-01-12',
            avatar: '3'
        },
        {
            id: 4,
            name: 'Alice Johnson',
            type: 'Owner',
            documentType: 'Driving License',
            status: 'Pending',
            date: '2024-01-10',
            avatar: '4'
        },
        {
            id: 5,
            name: 'Michael Chen',
            type: 'Tenant',
            documentType: 'Aadhar Card',
            status: 'Verified',
            date: '2024-01-08',
            avatar: '5'
        }
    ];

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'verified': return 'status-verified';
            case 'rejected': return 'status-rejected';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    return (
        <div className="kyc-page-container">
            <Sidebar />

            {/* Top Search Bar */}
            <div className="top-search-bar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search by name, type or status..." />
                </div>
            </div>

            <main className="kyc-content">
                <header className="kyc-header">
                    <div className="kyc-title">
                        <h2>KYC Verification</h2>
                        <p>Manage and verify tenant and owner documents.</p>
                    </div>
                    <button className="export-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export Report
                    </button>
                </header>

                {/* Stats Cards */}
                <section className="stats-grid">
                    <div className="stats-card">
                        <h3>Total Requests</h3>
                        <div className="stat-value">{kycRequests.length}</div>
                    </div>
                    <div className="stats-card">
                        <h3>Pending Verification</h3>
                        <div className="stat-value">{kycRequests.filter(r => r.status === 'Pending').length}</div>
                    </div>
                    <div className="stats-card">
                        <h3>Verified Users</h3>
                        <div className="stat-value">{kycRequests.filter(r => r.status === 'Verified').length}</div>
                    </div>
                    <div className="stats-card">
                        <h3>Rejected</h3>
                        <div className="stat-value">{kycRequests.filter(r => r.status === 'Rejected').length}</div>
                    </div>
                </section>

                {/* KYC Table */}
                <section className="kyc-table-container">
                    <div className="kyc-table-header">
                        <div className="checkbox-wrapper"></div>
                        <div>User Info</div>
                        <div>User Type</div>
                        <div>Document</div>
                        <div>Date</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>

                    {kycRequests.map(item => (
                        <div className="kyc-row" key={item.id}>
                            <div className="checkbox-wrapper">
                                <label className="check-container">
                                    <input type="checkbox" />
                                </label>
                            </div>

                            <div className="user-info">
                                <img
                                    src={`https://i.pravatar.cc/150?u=${item.avatar}`}
                                    alt={item.name}
                                    className="user-avatar"
                                />
                                <div className="user-details">
                                    <h4>{item.name}</h4>
                                    <span>ID: KYC-{item.id.toString().padStart(4, '0')}</span>
                                </div>
                            </div>

                            <div>
                                <span className={`type-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                            </div>

                            <div className="document-info">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="doc-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                {item.documentType}
                            </div>

                            <div className="date-info">
                                {item.date}
                            </div>

                            <div>
                                <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                            </div>

                            <div className="actions">
                                <button className="icon-action-btn view" title="View">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                                {item.status === 'Pending' && (
                                    <>
                                        <button className="icon-action-btn approve" title="Approve">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </button>
                                        <button className="icon-action-btn reject" title="Reject">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                <footer className="table-footer">
                    <span>Showing 1–{kycRequests.length} of {kycRequests.length} requests</span>
                    <div className="pagination">
                        <span className="page-arrow">&lt;</span>
                        <span className="page-item active">1</span>
                        <span className="page-arrow">&gt;</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default KycPage;
