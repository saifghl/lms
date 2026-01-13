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
        unit_ids: [] // Store selected unit IDs
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
            // expect list of units
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

    const handleUnitToggle = (unitId) => {
        const idInt = parseInt(unitId);
        setFormData(prev => ({
            ...prev,
            unit_ids: prev.unit_ids.includes(idInt)
                ? prev.unit_ids.filter(id => id !== idInt)
                : [...prev.unit_ids, idInt]
        }));
    };

    // Subtenant Handlers
    const addSubTenant = () => {
        setSubTenants([...subTenants, {
            company_name: '',
            registration_number: '',
            contact_person_name: '',
            contact_person_email: '',
            contact_person_phone: '',
            allotted_area_sqft: ''
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
            const payload = {
                ...formData,
                subtenants: subTenants
            };
            await tenantAPI.createTenant(payload);
            navigate('/admin/tenant');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create tenant.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="add-tenant-container">
                    <div className="unit-form-card"> {/* Reusing form card style from AddUnit */}
                        <div className="form-header">
                            <div className="header-titles">
                                <h2>Add New Tenant</h2>
                                <p>Register a new corporate tenant, assign units, and set contact details.</p>
                            </div>
                            <button className="close-btn" onClick={() => navigate('/admin/tenant')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div style={{ color: '#e53e3e', padding: '10px', marginBottom: '15px', background: '#fff5f5', borderRadius: '4px' }}>
                                    {error}
                                </div>
                            )}

                            {/* Section 1: Corporate Info */}
                            <div className="form-section">
                                <h3>Corporate Information</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Registration No.</label>
                                        <input type="text" name="company_registration_number" value={formData.company_registration_number} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Industry</label>
                                        <select name="industry" value={formData.industry} onChange={handleChange}>
                                            <option value="">Select Industry</option>
                                            <option value="IT">IT / Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Retail">Retail</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Tax ID / VAT</label>
                                        <input type="text" name="tax_id" value={formData.tax_id} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Website</label>
                                        <input type="text" name="website" value={formData.website} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Person */}
                            <div className="form-section">
                                <h3>Contact Person</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input type="text" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input type="email" name="contact_person_email" value={formData.contact_person_email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input type="text" name="contact_person_phone" value={formData.contact_person_phone} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Address */}
                            <div className="form-section">
                                <h3>Registered Address</h3>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input type="text" name="country" value={formData.country} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Unit Assignment */}
                            <div className="form-section">
                                <h3>Unit Assignment</h3>
                                <div className="form-group">
                                    <label>Select Project</label>
                                    <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                                        <option value="">Select Project</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
                                    </select>
                                </div>

                                {selectedProjectId && (
                                    <div className="form-group">
                                        <label>Select Units</label>
                                        {loadingUnits ? <p>Loading units...</p> : (
                                            <div className="unit-selection-box" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                                                {units.length === 0 ? <p>No units found for this project.</p> : units.map(u => (
                                                    <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.unit_ids.includes(u.id)}
                                                            onChange={() => handleUnitToggle(u.id)}
                                                        />
                                                        <span>Unit {u.unit_number} ({u.super_area} sqft) - {u.status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Section 5: Subtenants */}
                            <div className="form-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3>Subtenants</h3>
                                    <button type="button" onClick={addSubTenant} style={{ padding: '6px 12px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Subtenant</button>
                                </div>
                                {subTenants.map((st, i) => (
                                    <div key={i} style={{ background: '#f9fafb', padding: '15px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <strong>Subtenant #{i + 1}</strong>
                                            <button type="button" onClick={() => removeSubTenant(i)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                                        </div>
                                        <div className="form-row three-cols">
                                            <div className="form-group"><label>Company Name</label><input type="text" value={st.company_name} onChange={(e) => updateSubTenant(i, 'company_name', e.target.value)} /></div>
                                            <div className="form-group"><label>Reg No</label><input type="text" value={st.registration_number} onChange={(e) => updateSubTenant(i, 'registration_number', e.target.value)} /></div>
                                            <div className="form-group"><label>Allocated Area</label><input type="number" value={st.allotted_area_sqft} onChange={(e) => updateSubTenant(i, 'allotted_area_sqft', e.target.value)} /></div>
                                        </div>
                                        <div className="form-row three-cols">
                                            <div className="form-group"><label>Contact Name</label><input type="text" value={st.contact_person_name} onChange={(e) => updateSubTenant(i, 'contact_person_name', e.target.value)} /></div>
                                            <div className="form-group"><label>Email</label><input type="text" value={st.contact_person_email} onChange={(e) => updateSubTenant(i, 'contact_person_email', e.target.value)} /></div>
                                            <div className="form-group"><label>Phone</label><input type="text" value={st.contact_person_phone} onChange={(e) => updateSubTenant(i, 'contact_person_phone', e.target.value)} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-footer">
                                <button type="button" className="cancel-btn" onClick={() => navigate('/admin/tenant')}>Cancel</button>
                                <button type="submit" className="create-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Tenant'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default AddTenant;
