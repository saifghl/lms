import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { tenantAPI } from '../../services/api';
import './TenantDetails.css';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                setLoading(true);
                const res = await tenantAPI.getTenantById(id);
                setTenant(res.data);
            } catch (err) {
                console.error("Error loading tenant:", err);
                setError("Failed to load tenant details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTenant();
    }, [id]);

    if (loading) return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading tenant details...</div>
            </main>
        </div>
    );

    if (error || !tenant) return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error || "Tenant not found"}</div>
            </main>
        </div>
    );

    // Initial of company name for avatar
    const initial = tenant.company_name ? tenant.company_name.charAt(0).toUpperCase() : 'T';

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="tenant-details-container">

                    {/* Header */}
                    <div className="details-header">
                        <div className="title-row">
                            <div className="back-btn" onClick={() => navigate('/admin/tenant')} style={{ cursor: 'pointer', marginRight: '10px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </div>
                            <div>
                                <h1>{tenant.company_name}</h1>
                                <p className="subtitle">ID: TEN-{tenant.id} • {tenant.industry}</p>
                            </div>
                        </div>
                        <button className="edit-btn" onClick={() => navigate(`/admin/tenant/edit/${tenant.id}`)}>
                            Edit Tenant
                        </button>
                    </div>

                    <div className="details-grid">

                        {/* Left Column: Basic Info & Contact */}
                        <div className="details-column">
                            <div className="info-card">
                                <h3>Corporate Information</h3>
                                <div className="info-row">
                                    <label>Reg. Number</label>
                                    <span>{tenant.company_registration_number || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <label>Tax ID / VAT</label>
                                    <span>{tenant.tax_id || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <label>Website</label>
                                    <span>{tenant.website ? <a href={tenant.website} target="_blank" rel="noreferrer">{tenant.website}</a> : 'N/A'}</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <h3>Primary Contact</h3>
                                <div className="contact-display">
                                    <div className="avatar-circle">{initial}</div>
                                    <div>
                                        <strong>{tenant.contact_person_name}</strong>
                                        <div className="email-text">{tenant.contact_person_email}</div>
                                        <div className="phone-text">{tenant.contact_person_phone}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <h3>Address</h3>
                                <p className="address-text">
                                    {tenant.street_address}<br />
                                    {tenant.city}, {tenant.state} {tenant.zip_code}<br />
                                    {tenant.country}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Units & Subtenants */}
                        <div className="details-column">
                            <div className="info-card">
                                <h3>Leased Units</h3>
                                {tenant.units && tenant.units.length > 0 ? (
                                    <div className="units-grid">
                                        {tenant.units.map(unit => (
                                            <div key={unit.id} className="unit-mini-card">
                                                <div className="unit-icon">🏢</div>
                                                <div>
                                                    <strong>Unit {unit.unit_number}</strong>
                                                    <div>{unit.super_area} sqft</div>
                                                    <div className="floor-text">Floor {unit.floor_number}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-text">No units assigned.</p>
                                )}
                            </div>

                            <div className="info-card">
                                <h3>Subtenants</h3>
                                {tenant.subtenants && tenant.subtenants.length > 0 ? (
                                    <div className="subtenants-list">
                                        {tenant.subtenants.map((st, i) => (
                                            <div key={i} className="subtenant-item">
                                                <div className="st-header">
                                                    <strong>{st.company_name}</strong>
                                                    <span className="area-badge">{st.allotted_area_sqft} sqft</span>
                                                </div>
                                                <div className="st-details">
                                                    <div>Reg: {st.registration_number}</div>
                                                    <div>Contact: {st.contact_person_name}</div>
                                                    <div>{st.contact_person_email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-text">No subtenants registered.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default TenantDetails;
