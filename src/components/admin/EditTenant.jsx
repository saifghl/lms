import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddTenant.css'; // Reuse existing styles

const EditTenant = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock State - In a real app, this would be fetched based on {id}
    const [subTenants, setSubTenants] = useState([
        {
            companyName: 'Creative Solutions Ltd.',
            regNo: '987654321',
            industry: 'Technology',
            contactPerson: 'Sarah Jenkins',
            email: 'sarah@creative.com',
            phone: '+1 (555) 123-4567',
            allottedArea: '450'
        }
    ]);

    // Mock initial form data
    const [formData, setFormData] = useState({
        companyName: 'Acme Corp',
        regNo: '123456789',
        industry: 'Technology',
        taxId: 'TAX-998877',
        contactName: 'John Doe',
        contactEmail: 'john@acme.com',
        contactPhone: '+1 (555) 000-1111',
        website: 'www.acme.com',
        street: '123 Business Rd',
        city: 'Metropolis',
        state: 'NY',
        zip: '10001',
        country: 'United States'
    });

    const handleCancel = () => {
        navigate(-1); // Go back
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="add-tenant-container">
            <Sidebar />
            <main className="add-tenant-content">
                <div className="breadcrumb">
                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/tenant" style={{ textDecoration: 'none', color: 'inherit' }}>TENANT LIST</Link> &gt; EDIT
                </div>

                <header className="add-tenant-header">
                    <h2>Edit Tenant</h2>
                    <p>Update tenant details, manage units, and configure subtenants.</p>
                </header>

                {/* Corporate Information */}
                <section className="form-card">
                    <h3>Corporate Information</h3>
                    <div className="form-grid-3">
                        <div className="form-field">
                            <label>Company Name</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Company Registration No.</label>
                            <input type="text" name="regNo" value={formData.regNo} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Industry</label>
                            <select name="industry" value={formData.industry} onChange={handleInputChange}>
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
                            <input type="text" name="taxId" value={formData.taxId} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Contact person name</label>
                            <input type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Contact person Email</label>
                            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Contact Person Phone</label>
                            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Website( optional)</label>
                            <input type="text" name="website" value={formData.website} onChange={handleInputChange} />
                        </div>
                    </div>
                </section>

                {/* Registered Address */}
                <section className="form-card">
                    <h3>Registered Address</h3>
                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <label>Street Address</label>
                        <input type="text" name="street" value={formData.street} onChange={handleInputChange} />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Zip/ portal code</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} />
                        </div>
                        <div className="form-field">
                            <label>Country</label>
                            <select name="country" value={formData.country} onChange={handleInputChange}>
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
                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>Manage assigned units.</p>

                    <div className="form-field" style={{ maxWidth: '300px', marginBottom: '20px' }}>
                        <label>Project</label>
                        <select>
                            <option>Downtown Plaza</option>
                        </select>
                    </div>

                    <div className="unit-list">
                        <label className="unit-card" style={{ borderColor: '#3b82f6', background: '#eff6ff' }}>
                            <div className="unit-info">
                                <input type="radio" name="unit" checked readOnly />
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
                        Manage corporate subtenants.
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
                    <button className="btn-create">Update Tenant</button>
                </div>
            </main>
        </div>
    );
};

export default EditTenant;
