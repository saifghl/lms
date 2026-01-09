import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddTenant.css'; // Reuse existing styles

const EditTenant = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    // Subtenants
    const [subTenants, setSubTenants] = useState([]);

    // Form data
    const [formData, setFormData] = useState({
        companyName: '',
        regNo: '',
        industry: '',
        taxId: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });

    /* ============================
       FETCH TENANT BY ID
    ============================ */
    useEffect(() => {
        if (!id) return;
        
        fetch(`http://localhost:5000/api/tenants/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch tenant');
                return res.json();
            })
            .then(data => {
                setFormData({
                    companyName: data.company_name || '',
                    regNo: data.company_registration_number || '',
                    industry: data.industry || '',
                    taxId: data.tax_id || '',
                    contactName: data.contact_person_name || '',
                    contactEmail: data.contact_person_email || '',
                    contactPhone: data.contact_person_phone || '',
                    website: data.website || '',
                    street: data.street_address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zip: data.zip_code || '',
                    country: data.country || ''
                });

                setSubTenants(
                    data.subtenants?.map(st => ({
                        companyName: st.company_name || '',
                        regNo: st.registration_number || '',
                        industry: st.industry || '',
                        contactPerson: st.contact_person_name || '',
                        email: st.contact_person_email || '',
                        phone: st.contact_person_phone || '',
                        allottedArea: st.allotted_area_sqft || ''
                    })) || []
                );

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load tenant details');
                setLoading(false);
            });
    }, [id]);

    const handleCancel = () => {
        navigate(-1);
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

    /* ============================
       UPDATE TENANT
    ============================ */
    const handleUpdateTenant = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/tenants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    company_name: formData.companyName,
                    company_registration_number: formData.regNo,
                    industry: formData.industry,
                    tax_id: formData.taxId,
                    contact_person_name: formData.contactName,
                    contact_person_email: formData.contactEmail,
                    contact_person_phone: formData.contactPhone,
                    website: formData.website,
                    street_address: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zip,
                    country: formData.country,
                    subtenants: subTenants.map(st => ({
                        company_name: st.companyName,
                        registration_number: st.regNo,
                        allotted_area_sqft: st.allottedArea,
                        contact_person_name: st.contactPerson,
                        contact_person_email: st.email,
                        contact_person_phone: st.phone
                    }))
                })
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || 'Update failed');
            }

            alert('Tenant updated successfully');
            navigate('/admin/tenant');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to update tenant');
        }
    };

    if (loading) {
        return <p style={{ padding: 20 }}>Loading tenant details...</p>;
    }

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

                {/* Subtenant Information */}
                <section className="form-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Subtenant Management</h3>
                        <button className="add-tenant-btn" style={{ fontSize: '0.85rem', padding: '6px 12px' }} onClick={addSubTenant}>
                            + Add Subtenant
                        </button>
                    </div>

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
                    <button className="btn-create" onClick={handleUpdateTenant}>
                        Update Tenant
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EditTenant;
