import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { leaseAPI } from '../../services/api';
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
            const res = await leaseAPI.getLeaseById(id);
            setLease(res.data);
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
                    <span className="active"> LEASE #{lease.id}</span>
                </div>

                <div className="details-header">
                    <div className="header-title-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1>
                                Lease #{lease.id}
                            </h1>
                            <span className={`status-badge ${lease.status?.toLowerCase() || 'pending'}`}>
                                {lease.status || 'Unknown'}
                            </span>
                            {leaseType === 'sub_lease' && <span className="status-badge" style={{ background: '#ebf8ff', color: '#2b6cb0' }}>Sub Lease</span>}
                        </div>
                        <p className="header-subtitle">Commercial Lease Agreement • {lease.project_name || 'N/A'}</p>
                    </div>
                    <div className="header-actions">
                        <Link to={`/admin/edit-lease/${lease.id}`} className="edit-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit
                        </Link>
                        {/* Renew button logic could be added here later */}
                        {lease.status === 'Active' && <button className="renew-btn">Renew Lease</button>}
                    </div>
                </div>

                <div className="info-grid">
                    {/* Tenant Information */}
                    <div className="info-card">
                        <h3>{leaseType === 'sub_lease' ? 'Sub Tenant Information' : 'Tenant Information'}</h3>
                        <div className="tenant-info">
                            <div className="avatar-placeholder" style={{ backgroundColor: '#ebf8ff', color: '#3182ce' }}>
                                {(lease.tenant_name || 'T')[0]}
                            </div>
                            <div className="info-text">
                                {/* Use tenant_name or determine if mapped from backend */}
                                <h4>{lease.tenant_name || lease.sub_tenant_name || 'Unknown Tenant'}</h4>
                                <p>Tenant ID: {lease.tenant_id}</p>
                            </div>
                        </div>
                        {/* Assuming we might not have deep tenant details joined, we show what we have or placeholders if needed, 
                            but optimally backend should join this. For now, showing basic available info. */}
                        <div className="detail-row">
                            <div className="detail-item">
                                <label>Agreement Type</label>
                                <span>{lease.lease_type || 'Standard'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Rent Model</label>
                                <span>{lease.rent_model || 'Fixed'}</span>
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
                                <h4>{lease.unit_number || 'N/A'}</h4>
                                <p>{lease.project_name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-item">
                                <label>Unit ID</label>
                                <span>{lease.unit_id}</span>
                            </div>
                            {lease.sub_lease_area_sqft && (
                                <div className="detail-item">
                                    <label>Sub-Lease Area</label>
                                    <span>{lease.sub_lease_area_sqft} sq ft</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expiry Status */}
                    <div className="info-card">
                        <h3>Expiry Status</h3>
                        <div className="expiry-stat">
                            {/* Calculate days remaining roughly */}
                            <div className="expiry-days">
                                {lease.lease_end ? Math.ceil((new Date(lease.lease_end) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                            </div>
                            <span className="expiry-label">Days Remaining</span>
                        </div>
                        {/* Progress Bar Calculation */}
                        <div className="progress-bar">
                            <div className="progress-fill" style={{
                                width: lease.lease_start && lease.lease_end
                                    ? `${Math.min(100, Math.max(0, ((new Date() - new Date(lease.lease_start)) / (new Date(lease.lease_end) - new Date(lease.lease_start))) * 100))}%`
                                    : '0%'
                            }}></div>
                        </div>
                        <div className="detail-row" style={{ marginTop: '8px' }}>
                            <div className="detail-item">
                                <label>Started</label>
                                <span>{formatDate(lease.lease_start)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Ends</label>
                                <span>{formatDate(lease.lease_end)}</span>
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
                                <span className="date-text">{formatDate(lease.lease_start)}</span>
                                <span className="desc-text">Lease Start</span>
                            </div>
                        </div>
                        {/* We could calculate position dynamically, but for simplicity center 'Today' or adjust logic */}
                        <div className="timeline-point current" style={{
                            left: lease.lease_start && lease.lease_end
                                ? `${Math.min(100, Math.max(0, ((new Date() - new Date(lease.lease_start)) / (new Date(lease.lease_end) - new Date(lease.lease_start))) * 100))}%`
                                : '50%'
                        }}>
                            <div className="current-label-badge">Today</div>
                        </div>
                        <div className="timeline-point end">
                            <div className="timeline-label">
                                <span className="date-text">{formatDate(lease.lease_end)}</span>
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
                            <span style={{ fontSize: '0.85rem', color: '#718096' }}>{lease.billing_frequency || 'Monthly'}</span>
                        </div>

                        <div className="rent-breakdown">
                            <div className="rent-item">
                                <label>{rentModel === 'revenue_share' ? 'Minimum Guarantee (MGR)' : 'Base Rent'}</label>
                                <span className="amount">{formatCurrency(lease.monthly_rent)}</span>
                            </div>
                            {rentModel === 'revenue_share' && (
                                <div className="rent-item">
                                    <label>Revenue Share</label>
                                    <span className="amount">{lease.revenue_share_percentage}% of {lease.revenue_share_applicable_on}</span>
                                </div>
                            )}
                            <div className="rent-item">
                                <label>CAM / Service</label>
                                <span className="amount">{formatCurrency(lease.cam_charges)}</span>
                            </div>
                            {/* Assuming Tax is calculated or stored? For now, we only show what we have. If tax isn't in DB, omit or calculate example */}
                            {/* <div className="rent-item">
                                <label>Tax (Example 5%)</label>
                                <span className="amount">{formatCurrency((parseFloat(lease.monthly_rent || 0) + parseFloat(lease.cam_charges || 0)) * 0.05)}</span>
                            </div> */}
                        </div>

                        <div className="total-row">
                            <span style={{ color: '#718096', fontWeight: 500 }}>Total Base Payable ({lease.billing_frequency}):</span>
                            {/* Simple sum, real calc might be complex (tax etc) */}
                            <span className="total-amount">
                                {formatCurrency(parseFloat(lease.monthly_rent || 0) + parseFloat(lease.cam_charges || 0))}
                            </span>
                        </div>
                    </div>

                    {/* Security Deposit */}
                    <div className="deposit-card">
                        <h3 style={{ margin: 0, color: '#2d3748', textTransform: 'none', fontWeight: 600, fontSize: '1.1rem' }}>Security Deposit</h3>

                        <div className="deposit-highlight">
                            <label style={{ fontSize: '0.8rem', color: '#3182ce', fontWeight: 600 }}>Amount Held</label>
                            <span className="deposit-amount">{formatCurrency(lease.security_deposit)}</span>
                            <span style={{ fontSize: '0.75rem', color: '#718096' }}>Type: {lease.deposit_type}</span>
                        </div>

                        <div className="deposit-details">
                            <div className="deposit-row" style={{ marginBottom: '8px' }}>
                                <span>Utility Deposit:</span>
                                <span>{formatCurrency(lease.utility_deposit)}</span>
                            </div>
                            {/* <div className="deposit-row">
                                <span>Refund Status:</span>
                                <span>Pending Expiry</span>
                            </div> */}
                        </div>
                    </div>
                </div>

            </main >
        </div >
    );
};

export default LeaseDetails;
