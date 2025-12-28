import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddOwner.css';

const AddOwner = () => {
    const navigate = useNavigate();



    const handleCancel = () => {
        navigate('/admin/owner');
    };

    const handleSave = () => {
        // Logic to save owner would go here
        navigate('/admin/owner');
    };

    return (
        <div className="add-owner-container">
            <Sidebar />
            <main className="add-owner-content">
                <div className="breadcrumb">HOME &gt; OWNER &gt; ADD NEW</div>

                <header className="add-owner-header">
                    <h2>Add New Property Owner</h2>
                    <p>Register a new property owner by filling out the details below. Ensure all KYC documents are verified before submission.</p>
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
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label>Owner Email Address<span className="required">*</span></label>
                            <input
                                type="email"
                                className="form-input"
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
                                placeholder="+1 (555) 999-9999"
                            />
                        </div>
                        <div className="form-group">
                            <label>Representative Email</label>
                            <input
                                type="email"
                                className="form-input"
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
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Property Units</h3>
                        <span className="total-area-badge">Total Owned Area : 0 sqft</span>
                    </div>

                    <div className="form-group">
                        <label>Select Units<span className="required">*</span></label>
                        <div className="unit-selection-box">
                            Select at least one unit
                        </div>
                        <span className="helper-text">Select All unites owned by this individual.</span>
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
                            placeholder="123 Main St, Apt 4B"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-submit" onClick={handleSave}>Create Owner</button>
                </div>
            </main>
        </div>
    );
};

export default AddOwner;
