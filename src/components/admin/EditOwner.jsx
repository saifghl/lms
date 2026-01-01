import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddOwner.css'; // Reuse existing styles

const EditOwner = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock initial data - in a real app this would come from an API based on ID
    const [formData, setFormData] = useState({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 000-0000',
        repName: 'Michael Scott',
        repPhone: '+1 (555) 999-9999',
        repEmail: 'michael.s@example.com',
        altContact: '',
        units: ['u1'], // Mock selected units
        streetAddress: '123 Main St, Apt 4B'
    });

    const handleCancel = () => {
        navigate(-1); // Go back
    };

    const handleUpdate = () => {
        // Logic to update owner would go here
        navigate('/admin/owner');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="add-owner-container">
            <Sidebar />
            <main className="add-owner-content">
                <div className="breadcrumb">
                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/owner" style={{ textDecoration: 'none', color: 'inherit' }}>OWNER</Link> &gt; EDIT
                </div>

                <header className="add-owner-header">
                    <h2>Edit Property Owner</h2>
                    <p>Update property owner details, contact information, and assigned units.</p>
                </header>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name<span className="required">*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Email Address<span className="required">*</span></label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Owner Phone Number<span className="required">*</span></label>
                            <div className="phone-input-wrapper">
                                <input
                                    type="tel"
                                    className="form-input"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Representative Name<span className="required">*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                name="repName"
                                value={formData.repName}
                                onChange={handleChange}
                                placeholder="Name of authorized Rep"
                            />
                            <span className="helper-text">Authorized Person to contact if owner is unavailable.</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Representative Phone<span className="required">*</span></label>
                            <input
                                type="tel"
                                className="form-input"
                                name="repPhone"
                                value={formData.repPhone}
                                onChange={handleChange}
                                placeholder="+1 (555) 999-9999"
                            />
                        </div>
                        <div className="form-group">
                            <label>Representative Email</label>
                            <input
                                type="email"
                                className="form-input"
                                name="repEmail"
                                value={formData.repEmail}
                                onChange={handleChange}
                                placeholder="rep@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Alternative Contact</label>
                            <input
                                type="text"
                                className="form-input"
                                name="altContact"
                                value={formData.altContact}
                                onChange={handleChange}
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Property Units</h3>
                        <span className="total-area-badge">Total Owned Area : 2,400 sqft</span>
                    </div>

                    <div className="form-group">
                        <label>Select Units<span className="required">*</span></label>
                        <div className="unit-selection-box" style={{ color: '#333', background: '#f8fafc', fontWeight: '500' }}>
                            U-101, U-102 selected
                        </div>
                        <span className="helper-text">Select All units owned by this individual.</span>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Correspondence Address</h3>
                    </div>

                    <div className="form-group">
                        <label>Street Address</label>
                        <input
                            type="text"
                            className="form-input"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            placeholder="123 Main St, Apt 4B"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-submit" onClick={handleUpdate}>Update Owner</button>
                </div>
            </main>
        </div>
    );
};

export default EditOwner;
