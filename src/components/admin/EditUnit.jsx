import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EditUnit.css';
import { unitAPI } from '../../services/api';

const EditUnit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const unitId = id || "104-B";

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
        await unitAPI.update(id, {
            unit_number: unitId,     // ✅ REQUIRED
            status: "vacant",        // optional
            super_area: 1150         // optional
        });

        setMessage("✅ Unit updated successfully");

        setTimeout(() => {
            navigate("/admin/units");
        }, 1500);

    } catch (err) {
        console.error(err);
        setError("❌ Failed to update unit");
    }
};

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="edit-unit-container">
                    <div className="unit-form-card">

                        {/* Header */}
                        <div className="edit-header">
                            <div className="header-content">
                                <div className="breadcrumb">
                                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt;{' '}
                                    <Link to="/admin/units" style={{ textDecoration: 'none', color: 'inherit' }}>UNITS</Link> &gt;{' '}
                                    <span className="active">UNIT {unitId}</span>
                                </div>
                                <div className="title-row">
                                    <h2>Edit Unit: {unitId}</h2>
                                    <button className="view-history-btn">View History</button>
                                </div>
                                <p className="subtitle">
                                    Update current lease details, status, pricing, and amenities for this unit.
                                </p>
                            </div>
                        </div>

                        {/* ✅ MESSAGE (NO DESIGN CHANGE) */}
                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}

                        <form className="unit-form" onSubmit={handleUpdate}>

                            {/* Unit Identification */}
                            <section className="form-section">
                                <h3>Unit Identification</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input type="text" defaultValue={unitId} />
                                    </div>
                                    <div className="form-group">
                                        <label>Property Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Sunset Apartments (locked)"
                                            disabled
                                            className="locked-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select defaultValue="2_bed_deluxe">
                                                <option value="2_bed_deluxe">2 Bed / 2 Bath - Deluxe</option>
                                                <option value="1_bed">1 Bed / 1 Bath</option>
                                                <option value="studio">Studio</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Square Footage</label>
                                        <div className="input-with-suffix">
                                            <input type="text" defaultValue="1150" />
                                            <span className="suffix">sq ft</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Rent & Tenant */}
                            <section className="form-section">
                                <h3>Rent & Tenant</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Monthly Base Rent</label>
                                        <input type="text" defaultValue="₹2,400.00" className="blue-text-input" />
                                    </div>
                                    <div className="form-group">
                                        <label>Security Deposit</label>
                                        <input type="text" defaultValue="₹2,400.00" className="blue-text-input" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Current Status</label>
                                        <div className="select-wrapper">
                                            <select defaultValue="Vacant" className="status-select vacant">
                                                <option value="Vacant">Vacant</option>
                                                <option value="Leased">Leased</option>
                                                <option value="Reserved">Reserved</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Available From</label>
                                        <input type="date" defaultValue="2023-11-01" />
                                    </div>
                                </div>
                            </section>

                            {/* Specifications */}
                            <section className="form-section">
                                <h3>Specifications & Dimensions</h3>
                                <div className="specs-grid">
                                    <label className="checkbox-item"><input type="checkbox" defaultChecked /><span>Front facing</span></label>
                                    <label className="checkbox-item"><input type="checkbox" defaultChecked /><span>corner shop</span></label>
                                    <label className="checkbox-item"><input type="checkbox" /><span>double hight</span></label>
                                    <label className="checkbox-item"><input type="checkbox" defaultChecked /><span>boulevard facing</span></label>
                                    <label className="checkbox-item"><input type="checkbox" defaultChecked /><span>Central AC</span></label>
                                    <label className="checkbox-item"><input type="checkbox" /><span>assigned Parking</span></label>
                                </div>
                            </section>

                            <div className="form-footer">
                                <Link to="/admin/units" className="cancel-btn">Cancel</Link>
                                <button type="submit" className="update-btn">
                                    Update Unit
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditUnit;
