import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './LeaseDetails.css';
import './dashboard.css';

const LeaseDetails = () => {
    const { id } = useParams();
    const [lease, setLease] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchLease();
        }
    }, [id]);

    const fetchLease = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/leases/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (res.ok) {
                const data = await res.json();
                setLease(data);
            } else {
                setLease(null);
            }
        } catch (err) {
            console.error('Failed to fetch lease:', err);
            setLease(null);
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

    if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
    if (!lease) return <div style={{ padding: 20 }}>Lease not found</div>;

    const leaseType = lease.lease_type === 'Subtenant lease' ? 'sub_lease' : 'direct';
    const rentModel = lease.rent_model === 'RevenueShare' ? 'revenue_share' : 'fixed';

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="breadcrumb" style={{ marginBottom: '16px' }}>
                    <Link to="/admin/dashboard" className="text-muted">HOME</Link> &gt;
                    <Link to="/admin/leases" className="text-muted"> LEASES</Link> &gt;
                    <span className="active"> {id || 'LSE-8921'}</span>
                </div>

                <div className="details-header">
                    <div className="header-title-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1>
                                Lease #{id || 'LSE-8921'}
                            </h1>
                            <span className="status-badge active">Active</span>
                            {leaseType === 'sub_lease' && <span className="status-badge" style={{ background: '#ebf8ff', color: '#2b6cb0' }}>Sub Lease</span>}
                        </div>
                        <p className="header-subtitle">Commercial Lease Agreement • Sunrise Apartments</p>
                    </div>
                    <div className="header-actions">
                        <Link to={`/admin/edit-lease/${encodeURIComponent(id)}`} className="edit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit
                        </Link>
                        <button className="renew-btn">Renew Lease</button>
                    </div>
                </div>

                <div className="info-grid">
                    {/* Tenant Information */}
                    <div className="info-card">
                        <h3>{leaseType === 'sub_lease' ? 'Sub Tenant Information' : 'Tenant Information'}</h3>
                        <div className="tenant-info">
                            <div className="avatar-placeholder" style={{ backgroundColor: '#ebf8ff', color: '#3182ce' }}>AC</div>
                            <div className="info-text">
                                <h4>Acme Corp.</h4>
                                <p>Tech Solutions Provider</p>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-item">
                                <label>Primary Contact</label>
                                <span>John Smith</span>
                            </div>
                            <div className="detail-item">
                                <label>Phone</label>
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>

                    {/* Unit Details */}
                    <div className="info-card">
                        <h3>Unit Details</h3>
                        <div className="unit-info">
                            <div className="unit-img-placeholder">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9"></path></svg>
                            </div>
                            <div className="info-text">
                                <h4>Unit 402</h4>
                                <p>Sunrise Apartments, Block B</p>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-item">
                                <label>Type</label>
                                <span>Commercial Office</span>
                            </div>
                            <div className="detail-item">
                                <label>Size</label>
                                <span>1,250 sq ft</span>
                            </div>
                        </div>
                    </div>

                    {/* Expiry Status */}
                    <div className="info-card">
                        <h3>Expiry Status</h3>
                        <div className="expiry-stat">
                            <div className="expiry-days">312</div>
                            <span className="expiry-label">Days Remaining</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '42%' }}></div>
                        </div>
                        <div className="detail-row" style={{ marginTop: '8px' }}>
                            <div className="detail-item">
                                <label>Started</label>
                                <span>Jan 1, 2023</span>
                            </div>
                            <div className="detail-item">
                                <label>Ends</label>
                                <span>Dec 31, 2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="timeline-section">
                    <h3>Lease Timeline</h3>
                    <div className="timeline-track">
                        <div className="timeline-point start">
                            <div className="timeline-label">
                                <span className="date-text">Jan 1, 2023</span>
                                <span className="desc-text">Lease Start</span>
                            </div>
                        </div>
                        <div className="timeline-point current">
                            <div className="current-label-badge">Today</div>
                        </div>
                        <div className="timeline-point end">
                            <div className="timeline-label">
                                <span className="date-text">Dec 31, 2025</span>
                                <span className="desc-text">Expiration</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="financials-row">
                    {/* Rent Breakdown */}
                    <div className="rent-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#2d3748', textTransform: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Rent Breakdown</h3>
                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>Monthly</span>
                        </div>

                        <div className="rent-breakdown">
                            <div className="rent-item">
                                <label>{rentModel === 'revenue_share' ? 'Minimum Guarantee (MGR)' : 'Base Rent'}</label>
                                <span className="amount">₹4,000.00</span>
                            </div>
                            {rentModel === 'revenue_share' && (
                                <div className="rent-item">
                                    <label>Revenue Share</label>
                                    <span className="amount">10% of Net Sales</span>
                                </div>
                            )}
                            <div className="rent-item">
                                <label>CAM / Service</label>
                                <span className="amount">₹350.00</span>
                            </div>
                            <div className="rent-item">
                                <label>Tax (VAT 5%)</label>
                                <span className="amount">₹217.50</span>
                            </div>
                        </div>

                        <div className="total-row">
                            <span style={{ color: '#718096', fontWeight: 500 }}>Total Monthly Payable:</span>
                            <span className="total-amount">₹4,567.50</span>
                        </div>
                    </div>

                    {/* Security Deposit */}
                    <div className="deposit-card">
                        <h3 style={{ margin: 0, color: '#2d3748', textTransform: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Security Deposit</h3>

                        <div className="deposit-highlight">
                            <label style={{ fontSize: '0.8rem', color: '#3182ce', fontWeight: 600 }}>Amount Held</label>
                            <span className="deposit-amount">₹12,000.00</span>
                            <span style={{ fontSize: '0.75rem', color: '#718096' }}>Paid on Dec 20, 2022</span>
                        </div>

                        <div className="deposit-details">
                            <div className="deposit-row" style={{ marginBottom: '8px' }}>
                                <span>Reference No:</span>
                                <span>REF-99281-D</span>
                            </div>
                            <div className="deposit-row" style={{ marginBottom: '8px' }}>
                                <span>Payment Method:</span>
                                <span>Bank Transfer</span>
                            </div>
                            <div className="deposit-row">
                                <span>Refund Status:</span>
                                <span>Pending Expiry</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main >
        </div >
    );
};

export default LeaseDetails;
