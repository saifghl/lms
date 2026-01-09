import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddTenant.css';

const AddTenant = () => {
    const navigate = useNavigate();

    // 🔹 added
    const [form, setForm] = useState({
        company_name: '',
        company_registration_number: '',
        industry: '',
        tax_id: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone: '',
        website: '',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
    });

    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [unitId, setUnitId] = useState(null);
    const [loadingUnits, setLoadingUnits] = useState(false);

    const [subTenants, setSubTenants] = useState([]);

    // Fetch projects on component mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/projects', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };
        fetchProjects();
    }, []);

    // Fetch units when project is selected
    useEffect(() => {
        if (projectId) {
            setLoadingUnits(true);
            const fetchUnits = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/projects/${projectId}/units`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUnits(data);
                    } else {
                        setUnits([]);
                    }
                } catch (err) {
                    console.error('Failed to fetch units:', err);
                    setUnits([]);
                } finally {
                    setLoadingUnits(false);
                }
            };
            fetchUnits();
        } else {
            setUnits([]);
            setUnitId(null);
        }
    }, [projectId]);

    const handleCancel = () => {
        navigate('/admin/tenant');
    };

    // 🔹 added
    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
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

    // 🔹 added
    

            
       const handleSubmit = async () => {
    try {
        const payload = {
            ...form,
            unit_ids: unitId ? [unitId] : [],
            subtenants: subTenants.map(st => ({
                company_name: st.companyName,
                registration_number: st.regNo,
                allotted_area_sqft: st.allottedArea,
                contact_person_name: st.contactPerson,
                contact_person_email: st.email,
                contact_person_phone: st.phone
            }))
        };

        const res = await fetch('http://localhost:5000/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) throw new Error(data?.message || 'Failed to create tenant');

        alert('Tenant created successfully');
        navigate('/admin/tenant');

    } catch (err) {
        console.error(err);
        alert('Error creating tenant');
    }
};


    return (
        <div className="add-tenant-container">
            <Sidebar />
            <main className="add-tenant-content">
                <div className="breadcrumb">
                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/tenant" style={{ textDecoration: 'none', color: 'inherit' }}>TENANT LIST</Link> &gt; ADD NEW
                </div>

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
                            <input type="text" placeholder="e.g. abc"
                                onChange={e => handleChange('company_name', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Company Registration No.</label>
                            <input type="text" placeholder="e.g. 123456789"
                                onChange={e => handleChange('company_registration_number', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Industry</label>
                            <select onChange={e => handleChange('industry', e.target.value)}>
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
                            <input type="text" placeholder="e.g. 123456789"
                                onChange={e => handleChange('tax_id', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Contact person name</label>
                            <input type="text" placeholder="e.g. John"
                                onChange={e => handleChange('contact_person_name', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Contact person Email</label>
                            <input type="email" placeholder="e.g. jabc@gmail.com"
                                onChange={e => handleChange('contact_person_email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Contact Person Phone</label>
                            <input type="text" placeholder="e.g. 123456789"
                                onChange={e => handleChange('contact_person_phone', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Website( optional)</label>
                            <input type="text" placeholder="e.g. #//www.compony.com"
                                onChange={e => handleChange('website', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Registered Address */}
                <section className="form-card">
                    <h3>Registered Address</h3>
                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <label>Street Address</label>
                        <input type="text" placeholder="e.g. street address"
                            onChange={e => handleChange('street_address', e.target.value)}
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>City</label>
                            <input type="text" placeholder="e.g. city"
                                onChange={e => handleChange('city', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>State</label>
                            <input type="text" placeholder="e.g. State"
                                onChange={e => handleChange('state', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-field">
                            <label>Zip/ portal code</label>
                            <input type="text" placeholder="e.g. zip code"
                                onChange={e => handleChange('zip_code', e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Country</label>
                            <select onChange={e => handleChange('country', e.target.value)}>
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

                    <div className="form-field" style={{ maxWidth: '300px', marginBottom: '20px' }}>
                        <label>Project</label>
                        <select 
                            value={projectId} 
                            onChange={e => setProjectId(e.target.value)}
                        >
                            <option value="">Select project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.project_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loadingUnits && <p style={{ padding: '10px' }}>Loading units...</p>}

                    {!loadingUnits && units.length === 0 && projectId && (
                        <p style={{ padding: '10px', color: '#718096' }}>No available units in this project</p>
                    )}

                    <div className="unit-list">
                        {units.map(unit => (
                            <label key={unit.id} className="unit-card">
                                <div className="unit-info">
                                    <input 
                                        type="radio" 
                                        name="unit" 
                                        checked={unitId === unit.id}
                                        onChange={() => setUnitId(unit.id)} 
                                    />
                                    <div className="unit-details">
                                        <h4>Unit {unit.unit_number}</h4>
                                        <span>{unit.super_area || 0} sqft • Floor {unit.floor_number || 'N/A'}</span>
                                    </div>
                                </div>
                                <span className="status-tag available">Available</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Subtenant Information — EXACT COPY */}
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
                    <button className="btn-create" onClick={handleSubmit}>Create tenant</button>
                </div>
            </main>
        </div>
    );
};

export default AddTenant;
