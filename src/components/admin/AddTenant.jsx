import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { tenantAPI, getProjects, unitAPI } from '../../services/api';
import './AddTenant.css';

const AddTenant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dropdown Data
    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
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
        country: '',
        unit_ids: [] // Although backend supports array, frontend will use radio for single selection primarily, but kept as array for compatibility
    });

    // Subtenants State
    const [subTenants, setSubTenants] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    // When Project changes, fetch units
    useEffect(() => {
        if (selectedProjectId) {
            fetchUnits(selectedProjectId);
        } else {
            setUnits([]);
        }
    }, [selectedProjectId]);

    const fetchProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data?.projects || res.data || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const fetchUnits = async (pid) => {
        try {
            setLoadingUnits(true);
            const res = await unitAPI.getUnitsByProject(pid);
            setUnits(res.data?.units || res.data || []);
        } catch (err) {
            console.error("Error fetching units:", err);
            setUnits([]);
        } finally {
            setLoadingUnits(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUnitSelect = (unitId) => {
        const idInt = parseInt(unitId);
        // Radio behavior: Set as single item array
        setFormData({ ...formData, unit_ids: [idInt] });
    };

    // Subtenant Handlers
    const addSubTenant = () => {
        setSubTenants([...subTenants, {
            company_name: '',
            registration_number: '',
            allotted_area_sqft: '',
            contact_person_name: '',
            contact_person_email: '',
            contact_person_phone: ''
        }]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate
            // Validate
            // if (formData.unit_ids.length === 0) {
            //     throw new Error("At least one unit is required.");
            // }

            const payload = {
                ...formData,
                subtenants: subTenants
            };
            await tenantAPI.createTenant(payload);
            navigate('/admin/tenant');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create tenant.');
            window.scrollTo(0, 0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="add-tenant-page">
                    {/* BREADCRUMB */}
                    <div className="breadcrumb">
                        HOME &gt; TENANT LIST &gt; <span>ADD NEW</span>
                    </div>

                    <div className="page-header">
                        <h1>Add New Tenant</h1>
                        <p>Register a new corporate tenant, assign units, and set contact details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="tenant-form">
                        {error && (
                            <div className="error-banner">
                                {error}
                            </div>
                        )}

                        {/* 1. CORPORATE INFORMATION */}
                        <section className="form-section">
                            <h3>Corporate Information</h3>
                            <div className="form-grid three-col">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input type="text" name="company_name" placeholder="e.g. Acme Corp" value={formData.company_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Company Registration No.</label>
                                    <input type="text" name="company_registration_number" placeholder="e.g. 123456789" value={formData.company_registration_number} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Industry</label>
                                    <select name="industry" value={formData.industry} onChange={handleChange}>
                                        <option value="">Select Industry</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-grid three-col">
                                <div className="form-group">
                                    <label>Tax ID/ VAT Number</label>
                                    <input type="text" name="tax_id" placeholder="e.g. TAX-998877" value={formData.tax_id} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Contact person name</label>
                                    <input type="text" name="contact_person_name" placeholder="e.g. John Doe" value={formData.contact_person_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Contact person Email</label>
                                    <input type="email" name="contact_person_email" placeholder="e.g. john@acme.com" value={formData.contact_person_email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-grid two-col">
                                <div className="form-group">
                                    <label>Contact Person Phone</label>
                                    <input type="text" name="contact_person_phone" placeholder="+1 (555) 000-1111" value={formData.contact_person_phone} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Website( optional)</label>
                                    <input type="text" name="website" placeholder="www.acme.com" value={formData.website} onChange={handleChange} />
                                </div>
                            </div>
                        </section>

                        {/* 2. REGISTERED ADDRESS */}
                        <section className="form-section">
                            <h3>Registered Address</h3>
                            <div className="form-group">
                                <label>Street Address</label>
                                <input type="text" name="street_address" placeholder="e.g. 123 Business Rd" value={formData.street_address} onChange={handleChange} />
                            </div>
                            <div className="form-grid two-col">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" placeholder="e.g. Metropolis" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" name="state" placeholder="e.g. NY" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-grid two-col">
                                <div className="form-group">
                                    <label>Zip/ portal code</label>
                                    <input type="text" name="zip_code" placeholder="e.g. 10001" value={formData.zip_code} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <select name="country" value={formData.country} onChange={handleChange}>
                                        <option value="">Select Country</option>
                                        <option value="UAE">UAE</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 3. UNIT SELECTION */}
                        <section className="form-section">
                            <div className="section-header-row">
                                <h3>Unit Selection</h3>
                            </div>
                            <p className="section-subtitle">Select the unit(s) to assign to this corporate tenant. (Optional)</p>

                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label>Project</label>
                                <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                                    <option value="">Select project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
                                </select>
                            </div>

                            <div className="unit-selection-list">
                                {loadingUnits ? (
                                    <p>Loading units...</p>
                                ) : units.length > 0 ? (
                                    units.map(unit => {
                                        const isSelected = formData.unit_ids.includes(unit.id);
                                        const isUnavailable = unit.status !== 'vacant' && !isSelected; // Allow selecting if already selected (for edit case later)
                                        return (
                                            <div
                                                key={unit.id}
                                                className={`unit-item ${isSelected ? 'selected' : ''} ${isUnavailable ? 'disabled' : ''}`}
                                                onClick={() => !isUnavailable && handleUnitSelect(unit.id)}
                                            >
                                                <div className="unit-radio">
                                                    <div className={`radio-circle ${isSelected ? 'checked' : ''}`}></div>
                                                </div>
                                                <div className="unit-info">
                                                    <strong>Unit {unit.unit_number || `10${unit.id}-A`}</strong>
                                                    <span>{unit.super_area || '1,200'} sqft • floor {unit.floor_number || '1'}</span>
                                                </div>
                                                {isUnavailable && <span className="status-badge occupied">{unit.status}</span>}
                                            </div>
                                        );
                                    })
                                ) : (
                                    selectedProjectId ? <p className="no-data">No units available in this project.</p> : null
                                )}
                            </div>
                        </section>

                        {/* 4. SUBTENANT MANAGEMENT */}
                        <section className="form-section">
                            <div className="section-header-row">
                                <h3>Subtenant Management</h3>
                                <button type="button" className="add-subtenant-btn" onClick={addSubTenant}>
                                    + Add Subtenant
                                </button>
                            </div>
                            <p className="section-subtitle">Manage corporate subtenants.</p>

                            {subTenants.length === 0 ? (
                                <div className="empty-subtenants">
                                    No subtenants added yet. Click "Add Subtenant" to begin.
                                </div>
                            ) : (
                                <div className="subtenants-list">
                                    {subTenants.map((st, index) => (
                                        <div key={index} className="subtenant-card">
                                            <div className="subtenant-header">
                                                <h4>Subtenant #{index + 1}</h4>
                                                <button type="button" className="remove-btn" onClick={() => removeSubTenant(index)}>Remove</button>
                                            </div>
                                            <div className="form-grid three-col">
                                                <div className="form-group">
                                                    <label>Company Name</label>
                                                    <input type="text" value={st.company_name} onChange={(e) => updateSubTenant(index, 'company_name', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Registration No.</label>
                                                    <input type="text" value={st.registration_number} onChange={(e) => updateSubTenant(index, 'registration_number', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Allotted Area (sqft)</label>
                                                    <input type="number" value={st.allotted_area_sqft} onChange={(e) => updateSubTenant(index, 'allotted_area_sqft', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="form-grid three-col">
                                                <div className="form-group">
                                                    <label>Contact Person</label>
                                                    <input type="text" value={st.contact_person_name} onChange={(e) => updateSubTenant(index, 'contact_person_name', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input type="text" value={st.contact_person_email} onChange={(e) => updateSubTenant(index, 'contact_person_email', e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone</label>
                                                    <input type="text" value={st.contact_person_phone} onChange={(e) => updateSubTenant(index, 'contact_person_phone', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ACTIONS */}
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => navigate('/admin/tenant')}>Cancel</button>
                            <button type="submit" className="create-btn" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Tenant'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddTenant;
