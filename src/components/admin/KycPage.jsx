import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './KycPage.css';
import { ownerAPI } from '../../services/api'; // Adapting import to match known structure

const KycPage = () => {
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching owners. Ideally we'd fetch tenants too if a tenantAPI exists.
                // Assuming ownerAPI.getAll() exists and returns an array of owners.
                const response = await ownerAPI.getAll();
                const owners = response.data || response; // Handle { data: [...] } or [...]

                if (!Array.isArray(owners)) {
                    throw new Error("Invalid API response format");
                }

                // Map API data to UI structure
                const mappedRequests = owners.map(owner => ({
                    id: owner.id,
                    name: owner.name || owner.first_name + ' ' + owner.last_name || 'Unknown',
                    type: 'Owner', // Currently hardcoded as we are only fetching owners
                    documentType: owner.kyc_document_type || 'Aadhar Card', // Fallback or real field
                    status: mapStatus(owner.kyc_status || owner.status), // Map DB status to UI
                    date: owner.created_at ? new Date(owner.created_at).toLocaleDateString() : 'N/A',
                    avatar: owner.id % 10 // Deterministic avatar for demo
                }));

                setKycRequests(mappedRequests);
                setLoading(false);
            } catch (err) {
                console.error("KYC Fetch Error:", err);
                setError("Failed to load KYC requests.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const mapStatus = (dbStatus) => {
        if (!dbStatus) return 'Pending';
        const s = dbStatus.toLowerCase();
        if (s.includes('verified') || s === 'active') return 'Verified';
        if (s.includes('reject')) return 'Rejected';
        return 'Pending';
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'verified': return 'status-verified';
            case 'rejected': return 'status-rejected';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            // Optimistic Update
            setKycRequests(prev => prev.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            ));

            // API Call
            // Assuming ownerAPI.update exists
            const kycStatus = newStatus === 'Verified' ? 'verified' : 'rejected';
            await ownerAPI.update(id, { kyc_status: kycStatus });

        } catch (err) {
            console.error("Update Status Error:", err);
            // Revert on failure (could add complex revert logic here)
            alert("Failed to update status");
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

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading requests...</div>
                    ) : error ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
                    ) : (
                        kycRequests.map(item => (
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
                                            <button
                                                className="icon-action-btn approve"
                                                title="Approve"
                                                onClick={() => handleUpdateStatus(item.id, 'Verified')}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </button>
                                            <button
                                                className="icon-action-btn reject"
                                                title="Reject"
                                                onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </section>

                <footer className="table-footer">
                    <span>Showing {kycRequests.length} requests</span>
                </footer>
            </main>
        </div>
    );
};

export default KycPage;
