import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TenantDetails.css';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data based on the provided screenshot
    const tenant = {
        id: id || 'T-2023-894',
        name: 'Elena Drago',
        email: 'elena.drago@example.com',
        phone: '+1 (555) 012-3456',
        dob: 'March 15, 1988',
        occupation: 'Software Engineer',
        emergencyContact: 'Marco Drago (Spouse) +1 (555) 987-6543',
        status: 'Active Tenant',
        initials: 'ED',
        avatarColor: '#e91e63'
    };

    const leaseData = {
        propertyName: 'Sunrise Apartments – Unit A-101',
        address: '123 Market St, San Francisco, CA 94103',
        leaseStart: 'Jan 01, 2023',
        leaseEnd: 'Dec 31, 2024',
        image: 'https://images.unsplash.com/photo-1600596542815-2a4d04799295?q=80&w=2675&auto=format&fit=crop'
    };

    const keyTerms = {
        monthlyRent: '2,450.00',
        revenueShare: '+ 5% Revenue Share > ₹50K',
        dateOfLease: 'Jan 01, 24',
        lockinDate: 'Jan 01, 24',
        areaOccupied: '1,250'
    };

    return (
        <div className="tenant-details-container">
            <Sidebar />
            <main className="tenant-details-content">
                <div className="breadcrumb">TENANT &gt; LIST &gt; DETAILS</div>

                {/* Header Card */}
                <div className="tenant-header-card">
                    <div className="tenant-identity">
                        <div className="tenant-avatar-large">
                            {tenant.initials}
                        </div>
                        <div className="tenant-identity-info">
                            <h2>{tenant.name}</h2>
                            <div className="tenant-meta">
                                <span className="status-badge-active">{tenant.status}</span>
                                <span>ID: #{tenant.id}</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn-edit-tenant">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                    </button>
                </div>

                <div className="details-grid">
                    {/* Left Column */}
                    <div className="details-left">
                        {/* Personal Information */}
                        <section className="info-card">
                            <h3 className="card-title">Personal Information</h3>
                            <div className="personal-info-grid">
                                <div className="info-item">
                                    <label>Full Name</label>
                                    <p>{tenant.name}</p>
                                </div>
                                <div className="info-item">
                                    <label>Email Address</label>
                                    <p>{tenant.email}</p>
                                </div>
                                <div className="info-item">
                                    <label>Phone Number</label>
                                    <p>{tenant.phone}</p>
                                </div>
                                <div className="info-item">
                                    <label>Date of Birth</label>
                                    <p>{tenant.dob}</p>
                                </div>
                                <div className="info-item">
                                    <label>Occupation</label>
                                    <p>{tenant.occupation}</p>
                                </div>
                                <div className="info-item">
                                    <label>Emergency Contact</label>
                                    <p>{tenant.emergencyContact}</p>
                                </div>
                            </div>
                        </section>

                        {/* Current Lease */}
                        <section className="info-card">
                            <div className="card-title">
                                <h3>Current Lease</h3>
                                <span className="view-contract-link">View Contract</span>
                            </div>
                            <div className="lease-card-content">
                                <img src={leaseData.image} alt="Property" className="property-image" />
                                <div className="lease-details">
                                    <h4>{leaseData.propertyName}</h4>
                                    <span className="property-address">{leaseData.address}</span>

                                    <div className="lease-dates">
                                        <div className="date-item">
                                            <label>Lease Start:</label>
                                            <span>{leaseData.leaseStart}</span>
                                        </div>
                                        <div className="date-item">
                                            <label>Lease End:</label>
                                            <span>{leaseData.leaseEnd}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Key Terms */}
                    <div className="details-right">
                        <div className="key-terms-card">
                            <h4 className="key-terms-title">Key Terms</h4>

                            <div className="rent-section">
                                <label className="rent-label">Monthly Rent</label>
                                <div className="rent-amount">
                                    ₹{keyTerms.monthlyRent} <span className="rent-period">(Fixed)</span>
                                </div>
                                <span className="revenue-share">{keyTerms.revenueShare}</span>
                            </div>

                            <div className="terms-grid">
                                <div className="term-item">
                                    <label>Date of Lease</label>
                                    <span>{keyTerms.dateOfLease}</span>
                                </div>
                                <div className="term-item">
                                    <label>Lockin Date</label>
                                    <span>{keyTerms.lockinDate}</span>
                                </div>
                                <div className="term-item">
                                    <label>Area Occupied</label>
                                    <span>{keyTerms.areaOccupied} Sq. ft</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TenantDetails;
