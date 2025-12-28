import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddTenant.css';

const AddTenant = () => {
    const navigate = useNavigate();
    const [subTenants, setSubTenants] = useState([]);

    const handleCancel = () => {
        navigate('/admin/tenant');
    };

    const addSubTenant = () => {
        setSubTenants([
            ...subTenants,
            {
                companyName: '',
                regNo: '',
                industry: '',
                contactPerson: '',
                email: '',
                phone: '',
                allottedArea: ''
            }
        ]);
    };

    const removeSubTenant = (index) => {
        const updated = subTenants.filter((_, i) => i !== index);
        setSubTenants(updated);
    };

    const updateSubTenant = (index, field, value) => {
        const updated = [...subTenants];
        updated[index][field] = value;
        setSubTenants(updated);
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

                        </label>

                        <label className="unit-card">
                            <div className="unit-info">
                                <input type="radio" name="unit" />
                                <div className="unit-details">
                                    <h4>Unit 201-B</h4>
                                    <span>1,200 sqft • floor 1</span>
                                </div>
                            </div>

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

                {/* Subtenant Information */}
                <section className="form-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Subtenant Management</h3>
                        <button className="add-tenant-btn" style={{ fontSize: '0.85rem', padding: '6px 12px' }} onClick={addSubTenant}>
                            + Add Subtenant
                        </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>
                        Add subtenants if the main tenant plans to sublease parts of the property.
                    </p>

                    {subTenants.map((st, index) => (
                        <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <h4 style={{ margin: 0, color: '#3182ce' }}>Subtenant #{index + 1}</h4>
                                <button
                                    onClick={() => removeSubTenant(index)}
                                    style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="form-grid-3">
                                <div className="form-field">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sub Co."
                                        value={st.companyName}
                                        onChange={(e) => updateSubTenant(index, 'companyName', e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Registration No.</label>
                                    <input
                                        type="text"
                                        placeholder="Reg No."
                                        value={st.regNo}
                                        onChange={(e) => updateSubTenant(index, 'regNo', e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Allotted Area (sqft)</label>
                                    <input
                                        type="number"
                                        placeholder="Area"
                                        value={st.allottedArea}
                                        onChange={(e) => updateSubTenant(index, 'allottedArea', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-grid-3">
                                <div className="form-field">
                                    <label>Contact Person</label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={st.contactPerson}
                                        onChange={(e) => updateSubTenant(index, 'contactPerson', e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={st.email}
                                        onChange={(e) => updateSubTenant(index, 'email', e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={st.phone}
                                        onChange={(e) => updateSubTenant(index, 'phone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {subTenants.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #cbd5e0', borderRadius: '8px', color: '#718096' }}>
                            No subtenants added yet. Click &quot;Add Subtenant&quot; to begin.
                        </div>
                    )}
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
