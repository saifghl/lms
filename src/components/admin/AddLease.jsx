import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { addLease, getProjects, getUnits, getTenants, getOwners } from '../../services/api';
import './AddLease.css';
import './dashboard.css';

const AddLease = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [owners, setOwners] = useState([]);
    const [rentModel, setRentModel] = useState('fixed');
    const [isSubLease, setIsSubLease] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [escalationSteps, setEscalationSteps] = useState([
        { effectiveDate: '', increaseType: 'Percentage (%)', value: '5' }
    ]);
    const [formData, setFormData] = useState({
        lease_type: 'direct',
        rent_model: 'fixed',
        project_id: '',
        unit_id: '',
        tenant_id: '',
        owner_id: '',
        sub_lease_area: '',
        lease_start_date: '',
        lease_end_date: '',
        rent_commencement_date: '',
        duration_months: '',
        lockin_period_months: '',
        notice_period_months: '',
        monthly_rent: '',
        mgr: '',
        revenue_share_percentage: '',
        applicable_on: 'Net Sales',
        payment_due_day: '1',
        billing_frequency: 'Monthly',
        cam_charges: '',
        security_deposit: '',
        deposit_type: 'Cash / Check',
        currency: 'INR',
        parent_lease_id: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, tenantsRes, ownersRes] = await Promise.all([
                    getProjects(),
                    getTenants(),
                    getOwners()
                ]);
                setProjects(projectsRes.data);
                setTenants(tenantsRes.data);
                setOwners(ownersRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            const fetchUnits = async () => {
                try {
                    const response = await getUnits();
                    const filteredUnits = response.data.filter(unit => unit.project_id == selectedProject);
                    setUnits(filteredUnits);
                } catch (error) {
                    console.error("Error fetching units:", error);
                }
            };
            fetchUnits();
        } else {
            setUnits([]);
        }
    }, [selectedProject]);

    const handleLeaseTypeChange = (e) => {
        const isSub = e.target.value === 'sub_lease';
        setIsSubLease(isSub);
        setFormData(prev => ({
            ...prev,
            lease_type: e.target.value
        }));
        if (isSub) {
            setRentModel('fixed');
            setFormData(prev => ({ ...prev, rent_model: 'fixed' }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'project_id') {
            setSelectedProject(value);
            setFormData(prev => ({ ...prev, project_id: value, unit_id: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const calculateDuration = () => {
        if (formData.lease_start_date && formData.lease_end_date) {
            const start = new Date(formData.lease_start_date);
            const end = new Date(formData.lease_end_date);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            setFormData(prev => ({ ...prev, duration_months: months }));
        }
    };

    useEffect(() => {
        calculateDuration();
    }, [formData.lease_start_date, formData.lease_end_date]);

    const addEscalationStep = () => {
        setEscalationSteps([...escalationSteps, { effectiveDate: '', increaseType: 'Percentage (%)', value: '' }]);
    };

    const removeEscalationStep = (index) => {
        setEscalationSteps(escalationSteps.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                project_id: parseInt(formData.project_id),
                unit_id: parseInt(formData.unit_id),
                tenant_id: parseInt(formData.tenant_id),
                owner_id: parseInt(formData.owner_id),
                sub_lease_area: formData.sub_lease_area ? parseFloat(formData.sub_lease_area) : null,
                duration_months: parseInt(formData.duration_months) || null,
                lockin_period_months: parseInt(formData.lockin_period_months) || null,
                notice_period_months: parseInt(formData.notice_period_months) || null,
                monthly_rent: parseFloat(formData.monthly_rent) || 0,
                mgr: parseFloat(formData.mgr) || 0,
                revenue_share_percentage: parseFloat(formData.revenue_share_percentage) || 0,
                payment_due_day: parseInt(formData.payment_due_day) || 1,
                cam_charges: parseFloat(formData.cam_charges) || 0,
                security_deposit: parseFloat(formData.security_deposit) || 0,
                escalations: escalationSteps
            };
            await addLease(submitData);
            alert("Lease Created Successfully");
            navigate('/admin/leases');
        } catch (error) {
            console.error("Error creating lease:", error);
            alert("Failed to create lease: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <Link to="/admin/dashboard" className="text-muted">HOME</Link> &gt;
                            <Link to="/admin/leases" className="text-muted"> LEASES</Link> &gt;
                            <span className="active"> ADD NEW</span>
                        </div>
                        <h1>Add New Lease</h1>
                        <p>Create a new lease agreement, map unit to tenant, and set financial terms.</p>
                    </div>
                </header>

                <form className="form-layout" onSubmit={handleSubmit}>
                    {/* Section: Lease Type Selection */}
                    <div className="form-section">
                        <h3>Lease Configuration</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Lease Type</label>
                                <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="lease_type"
                                            value="direct"
                                            checked={formData.lease_type === 'direct'}
                                            onChange={handleLeaseTypeChange}
                                        />
                                        Direct Lease
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="lease_type"
                                            value="sub_lease"
                                            checked={formData.lease_type === 'sub_lease'}
                                            onChange={handleLeaseTypeChange}
                                        />
                                        Sub Lease
                                    </label>
                                </div>
                            </div>

                            <div className="form-group" style={{ opacity: isSubLease ? 0.5 : 1, pointerEvents: isSubLease ? 'none' : 'auto' }}>
                                <label>Rent Model</label>
                                <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="rent_model"
                                            value="fixed"
                                            checked={formData.rent_model === 'fixed'}
                                            onChange={(e) => {
                                                setRentModel('fixed');
                                                setFormData(prev => ({ ...prev, rent_model: 'fixed' }));
                                            }}
                                        />
                                        Fixed Rent
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="rent_model"
                                            value="revenue_share"
                                            checked={formData.rent_model === 'revenue_share'}
                                            onChange={(e) => {
                                                setRentModel('revenue_share');
                                                setFormData(prev => ({ ...prev, rent_model: 'revenue_share' }));
                                            }}
                                        />
                                        Revenue Share
                                    </label>
                                </div>
                                {isSubLease && <small style={{ color: '#e53e3e' }}>Sublease supports Fixed Rent only.</small>}
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Property & Parties */}
                    <div className="form-section">
                        <h3>Property & Parties</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Project</label>
                                <select name="project_id" value={formData.project_id} onChange={handleChange} required>
                                    <option value="">Select Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.project_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select name="unit_id" value={formData.unit_id} onChange={handleChange} required disabled={!selectedProject}>
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{isSubLease ? 'Sub Tenant' : 'Tenant'}</label>
                                <select name="tenant_id" value={formData.tenant_id} onChange={handleChange} required>
                                    <option value="">Select {isSubLease ? 'Sub Tenant' : 'Tenant'}</option>
                                    {tenants.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{isSubLease ? 'Tenant (Lessor)' : 'Owner (Landlord)'}</label>
                                <select name="owner_id" value={formData.owner_id} onChange={handleChange} required>
                                    <option value="">Select {isSubLease ? 'Tenant' : 'Owner'}</option>
                                    {owners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {isSubLease && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sub Lease Area (sq ft)</label>
                                    <input type="number" name="sub_lease_area" value={formData.sub_lease_area} onChange={handleChange} placeholder="e.g. 500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Lease Period & Lockin */}
                    <div className="form-section">
                        <h3>Lease Period & Lockin</h3>
                        <div className="form-row date-row">
                            <div className="form-group">
                                <label>Lease Start Date</label>
                                <input type="date" name="lease_start_date" value={formData.lease_start_date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Lease End Date</label>
                                <input type="date" name="lease_end_date" value={formData.lease_end_date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Rent Commencement Date</label>
                                <input type="date" name="rent_commencement_date" value={formData.rent_commencement_date} onChange={handleChange} />
                                <small style={{ color: '#718096', fontSize: '0.8rem' }}>Fit-out period ends</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (Months)</label>
                                <input type="text" value={formData.duration_months || ''} readOnly style={{ backgroundColor: '#f7fafc' }} />
                            </div>
                            <div className="form-group">
                                <label>Lockin Period (Months)</label>
                                <input type="number" name="lockin_period_months" value={formData.lockin_period_months} onChange={handleChange} placeholder="e.g. 12" />
                            </div>
                            <div className="form-group">
                                <label>Notice Period (Months)</label>
                                <input type="number" name="notice_period_months" value={formData.notice_period_months} onChange={handleChange} placeholder="e.g. 3" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Rent & Financials */}
                    <div className="form-section">
                        <h3>Rent & Financials</h3>

                        <div className="form-row">
                            {formData.rent_model === 'fixed' ? (
                                <div className="form-group">
                                    <label>Fixed Rent Amount (Monthly)</label>
                                    <div className="currency-input">
                                        <span className="currency-symbol">₹</span>
                                        <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} placeholder="0.00" required />
                                        <span className="currency-code">INR</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Minimum Guarantee (MGR)</label>
                                    <div className="currency-input">
                                        <span className="currency-symbol">₹</span>
                                        <input type="number" name="mgr" value={formData.mgr} onChange={handleChange} placeholder="0.00" required />
                                        <span className="currency-code">INR</span>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Using Currency</label>
                                <input type="text" value="INR" readOnly className="bg-input" />
                            </div>
                        </div>

                        {formData.rent_model === 'revenue_share' && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Revenue Share Percentage (%)</label>
                                    <input type="number" name="revenue_share_percentage" value={formData.revenue_share_percentage} onChange={handleChange} placeholder="e.g. 10" />
                                </div>
                                <div className="form-group">
                                    <label>Applicable On</label>
                                    <select name="applicable_on" value={formData.applicable_on} onChange={handleChange}>
                                        <option>Net Sales</option>
                                        <option>Gross Sales</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Payment Due Day</label>
                                <select name="payment_due_day" value={formData.payment_due_day} onChange={handleChange}>
                                    <option value="1">1st of Month</option>
                                    <option value="5">5th of Month</option>
                                    <option value="10">10th of Month</option>
                                    <option value="31">End of Month</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Billing Frequency</label>
                                <select name="billing_frequency" value={formData.billing_frequency} onChange={handleChange}>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Half-Yearly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>CAM Charges (Monthly)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="cam_charges" value={formData.cam_charges} onChange={handleChange} placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.95rem', margin: '16px 0 12px 0', color: '#4a5568', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Security Deposits</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Security Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deposit Type</label>
                                <select name="deposit_type" value={formData.deposit_type} onChange={handleChange}>
                                    <option>Cash / Check</option>
                                    <option>Bank Guarantee</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Rent Escalations */}
                    <div className="form-section">
                        <h3>Rent Escalations</h3>
                        <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '16px' }}>Define specific dates for rent increases instead of a fixed cycle.</p>

                        {escalationSteps.map((step, index) => (
                            <div className="escalation-row" key={index}>
                                <div className="form-group">
                                    <label>Effective From Date</label>
                                    <input type="date" value={step.effectiveDate} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].effectiveDate = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }} />
                                </div>
                                <div className="form-group">
                                    <label>Increase Type</label>
                                    <select value={step.increaseType} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].increaseType = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }}>
                                        <option>Percentage (%)</option>
                                        <option>Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value</label>
                                    <input type="number" value={step.value} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].value = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }} />
                                </div>
                                <button type="button" className="remove-step-btn" onClick={() => removeEscalationStep(index)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))}

                        <button type="button" className="add-step-btn" onClick={addEscalationStep}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Escalation Step
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/admin/leases')}>Cancel</button>
                        <button type="submit" className="create-btn">Create Lease</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddLease;
