import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EditUnit.css';
import { unitAPI } from '../../services/api';

const EditUnit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        unit_number: '',
        status: '',
        super_area: '',
        monthly_rent: '',
        security_deposit: '',
        floor_number: '',
        project_id: '' // Assuming display readonly or select ??
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const res = await unitAPI.getUnitById(id);
                const data = res.data;
                setFormData({
                    unit_number: data.unit_number || '',
                    status: data.status || 'Vacant',
                    super_area: data.super_area || '',
                    monthly_rent: data.monthly_rent || '',
                    security_deposit: data.security_deposit || '',
                    floor_number: data.floor_number || ''
                });
            } catch (err) {
                console.error("Error fetching unit:", err);
                setError("Failed to load unit details");
            }
        };
        fetchUnit();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await unitAPI.updateUnit(id, formData);

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
                                    <span className="active">UNIT {formData.unit_number}</span>
                                </div>
                                <div className="title-row">
                                    <h2>Edit Unit: {formData.unit_number}</h2>
                                    <button className="view-history-btn">View History</button>
                                </div>
                                <p className="subtitle">
                                    Update current lease details, status, pricing, and amenities for this unit.
                                </p>
                            </div>
                        </div>

                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}

                        <form className="unit-form" onSubmit={handleUpdate}>

                            {/* Unit Identification */}
                            <section className="form-section">
                                <h3>Unit Identification</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input
                                            type="text"
                                            name="unit_number"
                                            value={formData.unit_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input
                                            type="text"
                                            name="floor_number"
                                            value={formData.floor_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="Vacant">Vacant</option>
                                                <option value="Occupied">Occupied</option>
                                                <option value="Reserved">Reserved</option>
                                                <option value="Under Maintenance">Under Maintenance</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Square Footage</label>
                                        <div className="input-with-suffix">
                                            <input
                                                type="text"
                                                name="super_area"
                                                value={formData.super_area}
                                                onChange={handleChange}
                                            />
                                            <span className="suffix">sq ft</span>
                                        </div>
                                    </div>
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
