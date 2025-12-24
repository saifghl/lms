import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddTenant.css';

const AddTenant = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/admin/tenant');
    };

    return (
        <div className="add-tenant-container">
            <Sidebar />
            <main className="add-tenant-content">
                <div className="breadcrumb">HOME &gt; TENANT &gt; ADD NEW</div>

                <header className="add-tenant-header">
                    <h2>Add New Tenant</h2>
                    <p>Register a new corporate tenant, assign units, and set contact details.</p>
                </header>

                {/* Corporate Information */}
                <section className="form-card">
                    <h3>Corporate Information</h3>
                    <div className="form-grid-3">
                        <div className="form-field">
                            <label>Company Name</label>
                            <input type="text" placeholder="e.g. abc" />
                        </div>
                        <div className="form-field">
                            <label>Company Registration No.</label>
                            <input type="text" placeholder="e.g. 123456789" />
                        </div>
                        <div className="form-field">
                            <label>Industry</label>
                            <select>
                                <option>Select Industry</option>
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Retail</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid-3">
                        <div className="form-field">
                            <label>Tax ID/ VAT Number</label>
                            <input type="text" placeholder="e.g. 123456789" />
                        </div>
                        <div className="form-field">
                            <label>Contact person name</label>
                            <input type="text" placeholder="e.g. John" />
                        </div>
                        <div className="form-field">
                            <label>Contact person Email</label>
                            <input type="email" placeholder="e.g. jabc@gmail.com" />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Contact Person Phone</label>
                            <input type="text" placeholder="e.g. 123456789" />
                        </div>
                        <div className="form-field">
                            <label>Website( optional)</label>
                            <input type="text" placeholder="e.g. #//www.compony.com" />
                        </div>
                    </div>
                </section>

                {/* Registered Address */}
                <section className="form-card">
                    <h3>Registered Address</h3>
                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <label>Street Address</label>
                        <input type="text" placeholder="e.g. street address" />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>City</label>
                            <input type="text" placeholder="e.g. city" />
                        </div>
                        <div className="form-field">
                            <label>State</label>
                            <input type="text" placeholder="e.g. State" />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Zip/ portal code</label>
                            <input type="text" placeholder="e.g. zip code" />
                        </div>
                        <div className="form-field">
                            <label>Country</label>
                            <select>
                                <option>e.g. country</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>India</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Unit Selection */}
                <section className="form-card">
                    <h3>Unit Selection</h3>
                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>Select the unit(s) to assign to this corporate tenant. At least one unit is required.</p>

                    <div className="form-field" style={{ maxWidth: '300px', marginBottom: '20px' }}>
                        <label>Project</label>
                        <select>
                            <option>Select project</option>
                        </select>
                    </div>

                    <div className="unit-list">
                        <label className="unit-card">
                            <div className="unit-info">
                                <input type="radio" name="unit" disabled />
                                <div className="unit-details">
                                    <h4>Unit 101-A</h4>
                                    <span>1,200 sqft • floor 1</span>
                                </div>
                            </div>
                            <span className="status-tag occupied">Occupied</span>
                        </label>

                        <label className="unit-card">
                            <div className="unit-info">
                                <input type="radio" name="unit" />
                                <div className="unit-details">
                                    <h4>Unit 201-B</h4>
                                    <span>1,200 sqft • floor 1</span>
                                </div>
                            </div>
                            <span className="status-tag available">Available</span>
                        </label>

                        <label className="unit-card">
                            <div className="unit-info">
                                <input type="radio" name="unit" />
                                <div className="unit-details">
                                    <h4>Unit 301-C</h4>
                                    <span>1,200 sqft • floor 1</span>
                                </div>
                            </div>
                            <span className="status-tag available">Available</span>
                        </label>
                    </div>
                </section>

                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-create">Create tenant</button>
                </div>
            </main>
        </div>
    );
};

export default AddTenant;
