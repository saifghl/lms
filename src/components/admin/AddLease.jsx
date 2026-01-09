import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddLease.css';
import './dashboard.css'; // Ensure dashboard styles are available

const AddLease = () => {
    const navigate = useNavigate();
    const [rentModel, setRentModel] = useState('Fixed'); // 'Fixed' | 'RevenueShare'
    const [isSubLease, setIsSubLease] = useState(false);
    const [escalationSteps, setEscalationSteps] = useState([
        { effectiveDate: '', increaseType: 'Percentage', value: '' }
    ]);

    // Data for dropdowns
    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [owners, setOwners] = useState([]);
    const [subTenants, setSubTenants] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        project_id: '',
        unit_id: '',
        owner_id: '',
        tenant_id: '',
        sub_tenant_id: '',
        sub_lease_area_sqft: '',
        lease_start: '',
        lease_end: '',
        rent_commencement_date: '',
        fitout_period_end: '',
        lockin_period_months: 12,
        notice_period_months: 3,
        monthly_rent: '',
        cam_charges: '',
        billing_frequency: 'Monthly',
        payment_due_day: '1st of Month',
        currency_code: 'INR',
        security_deposit: '',
        utility_deposit: '',
        deposit_type: 'Cash',
        revenue_share_percentage: '',
        revenue_share_applicable_on: 'Net Sales'
    });

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const [projectsRes, tenantsRes, ownersRes] = await Promise.all([
                    fetch('http://localhost:5000/api/projects', { headers }),
                    fetch('http://localhost:5000/api/tenants', { headers }),
                    fetch('http://localhost:5000/api/owners', { headers })
                ]);

                if (projectsRes.ok) setProjects(await projectsRes.json());
                if (tenantsRes.ok) setTenants(await tenantsRes.json());
                if (ownersRes.ok) setOwners(await ownersRes.json());
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };
        fetchData();
    }, []);

    // Fetch units when project is selected
    useEffect(() => {
        if (formData.project_id) {
            const fetchUnits = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:5000/api/projects/${formData.project_id}/units`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUnits(data);
                    }
                } catch (err) {
                    console.error('Failed to fetch units:', err);
                }
            };
            fetchUnits();
        } else {
            setUnits([]);
        }
    }, [formData.project_id]);

    // Fetch sub-tenants when tenant is selected
    useEffect(() => {
        if (formData.tenant_id && isSubLease) {
            const fetchSubTenants = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:5000/api/tenants/${formData.tenant_id}`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setSubTenants(data.subtenants || []);
                    }
                } catch (err) {
                    console.error('Failed to fetch sub-tenants:', err);
                }
            };
            fetchSubTenants();
        } else {
            setSubTenants([]);
        }
    }, [formData.tenant_id, isSubLease]);

    const handleLeaseTypeChange = (e) => {
        const isSub = e.target.value === 'sub_lease';
        setIsSubLease(isSub);
        if (isSub) {
            setRentModel('Fixed'); // Sublease is always fixed rent per requirement
        }
        setFormData(prev => ({
            ...prev,
            owner_id: isSub ? '' : prev.owner_id,
            sub_tenant_id: isSub ? '' : ''
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.project_id || !formData.unit_id || !formData.tenant_id || 
                !formData.lease_start || !formData.lease_end || !formData.rent_commencement_date) {
                alert('Please fill in all required fields');
                return;
            }

            if (!isSubLease && !formData.owner_id) {
                alert('Owner is required for Direct lease');
                return;
            }

            if (isSubLease && (!formData.sub_tenant_id || !formData.sub_lease_area_sqft)) {
                alert('Sub-tenant and Sub-lease area are required for Sub lease');
                return;
            }

            // Calculate tenure
            const startDate = new Date(formData.lease_start);
            const endDate = new Date(formData.lease_end);
            const tenureMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));

            // Prepare escalations
            const escalations = escalationSteps
                .filter(step => step.effectiveDate && step.value)
                .map(step => ({
                    effective_from: step.effectiveDate,
                    increase_type: step.increaseType === 'Percentage (%)' ? 'Percentage' : 'Fixed Amount',
                    value: parseFloat(step.value)
                }));

            const payload = {
                project_id: parseInt(formData.project_id),
                unit_id: parseInt(formData.unit_id),
                owner_id: isSubLease ? null : parseInt(formData.owner_id),
                tenant_id: parseInt(formData.tenant_id),
                sub_tenant_id: isSubLease ? parseInt(formData.sub_tenant_id) : null,
                lease_type: isSubLease ? 'Subtenant lease' : 'Direct lease',
                rent_model: rentModel,
                sub_lease_area_sqft: isSubLease ? parseFloat(formData.sub_lease_area_sqft) : null,
                lease_start: formData.lease_start,
                lease_end: formData.lease_end,
                rent_commencement_date: formData.rent_commencement_date,
                fitout_period_end: formData.fitout_period_end || null,
                tenure_months: tenureMonths,
                lockin_period_months: parseInt(formData.lockin_period_months) || 12,
                notice_period_months: parseInt(formData.notice_period_months) || 3,
                monthly_rent: parseFloat(formData.monthly_rent) || 0,
                cam_charges: parseFloat(formData.cam_charges) || 0,
                billing_frequency: formData.billing_frequency,
                payment_due_day: formData.payment_due_day,
                currency_code: formData.currency_code,
                security_deposit: parseFloat(formData.security_deposit) || 0,
                utility_deposit: parseFloat(formData.utility_deposit) || 0,
                deposit_type: formData.deposit_type,
                revenue_share_percentage: rentModel === 'RevenueShare' ? parseFloat(formData.revenue_share_percentage) : null,
                revenue_share_applicable_on: rentModel === 'RevenueShare' ? formData.revenue_share_applicable_on : null,
                escalations: escalations
            };

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/leases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || 'Failed to create lease');
            }

            alert('Lease created successfully');
            navigate('/admin/leases');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to create lease');
        }
    };

    const addEscalationStep = () => {
        setEscalationSteps([...escalationSteps, { effectiveDate: '', increaseType: 'Percentage (%)', value: '' }]);
    };

    const removeEscalationStep = (index) => {
        const newSteps = escalationSteps.filter((_, i) => i !== index);
        setEscalationSteps(newSteps);
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

                <div className="form-layout">
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
                                            name="leaseType"
                                            value="direct"
                                            checked={!isSubLease}
                                            onChange={handleLeaseTypeChange}
                                        />
                                        Direct Lease
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="leaseType"
                                            value="sub_lease"
                                            checked={isSubLease}
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
                                            name="rentModel"
                                            value="fixed"
                                            checked={rentModel === 'fixed'}
                                            onChange={(e) => setRentModel(e.target.value)}
                                        />
                                        Fixed Rent
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="rentModel"
                                            value="revenue_share"
                                            checked={rentModel === 'revenue_share'}
                                            onChange={(e) => setRentModel(e.target.value)}
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
                                <label>Project *</label>
                                <select 
                                    value={formData.project_id} 
                                    onChange={(e) => handleInputChange('project_id', e.target.value)}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                            {project.project_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit *</label>
                                <select 
                                    value={formData.unit_id} 
                                    onChange={(e) => handleInputChange('unit_id', e.target.value)}
                                    disabled={!formData.project_id}
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.unit_number} - {unit.super_area} sqft
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>{isSubLease ? 'Sub Tenant *' : 'Tenant *'}</label>
                                {isSubLease ? (
                                    <select 
                                        value={formData.sub_tenant_id} 
                                        onChange={(e) => handleInputChange('sub_tenant_id', e.target.value)}
                                        disabled={!formData.tenant_id}
                                    >
                                        <option value="">Select Sub Tenant</option>
                                        {subTenants.map(st => (
                                            <option key={st.id} value={st.id}>
                                                {st.company_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select 
                                        value={formData.tenant_id} 
                                        onChange={(e) => handleInputChange('tenant_id', e.target.value)}
                                    >
                                        <option value="">Select Tenant</option>
                                        {tenants.map(tenant => (
                                            <option key={tenant.id} value={tenant.id}>
                                                {tenant.company_name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="form-group">
                                <label>{isSubLease ? 'Tenant (Lessor) *' : 'Owner (Landlord) *'}</label>
                                {isSubLease ? (
                                    <select 
                                        value={formData.tenant_id} 
                                        onChange={(e) => handleInputChange('tenant_id', e.target.value)}
                                    >
                                        <option value="">Select Tenant</option>
                                        {tenants.map(tenant => (
                                            <option key={tenant.id} value={tenant.id}>
                                                {tenant.company_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select 
                                        value={formData.owner_id} 
                                        onChange={(e) => handleInputChange('owner_id', e.target.value)}
                                    >
                                        <option value="">Select Owner</option>
                                        {owners.map(owner => (
                                            <option key={owner.id} value={owner.id}>
                                                {owner.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                        {isSubLease && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sub Lease Area (sq ft) *</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 500" 
                                        value={formData.sub_lease_area_sqft}
                                        onChange={(e) => handleInputChange('sub_lease_area_sqft', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Lease Period & Lockin */}
                    <div className="form-section">
                        <h3>Lease Period & Lockin</h3>
                        <div className="form-row date-row">
                            <div className="form-group">
                                <label>Lease Start Date *</label>
                                <input 
                                    type="date" 
                                    value={formData.lease_start}
                                    onChange={(e) => handleInputChange('lease_start', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Lease End Date *</label>
                                <input 
                                    type="date" 
                                    value={formData.lease_end}
                                    onChange={(e) => handleInputChange('lease_end', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Rent Commencement Date *</label>
                                <input 
                                    type="date" 
                                    value={formData.rent_commencement_date}
                                    onChange={(e) => handleInputChange('rent_commencement_date', e.target.value)}
                                />
                                <small style={{ color: '#718096', fontSize: '0.8rem' }}>Fit-out period ends</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Fit-out Period End</label>
                                <input 
                                    type="date" 
                                    value={formData.fitout_period_end}
                                    onChange={(e) => handleInputChange('fitout_period_end', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Lockin Period (Months)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 12" 
                                    value={formData.lockin_period_months}
                                    onChange={(e) => handleInputChange('lockin_period_months', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Notice Period (Months)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 3" 
                                    value={formData.notice_period_months}
                                    onChange={(e) => handleInputChange('notice_period_months', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Rent & Financials */}
                    <div className="form-section">
                        <h3>Rent & Financials</h3>

                        {/* Dynamic Fields based on Rent Model */}
                        <div className="form-row">
                            {rentModel === 'Fixed' ? (
                                <div className="form-group">
                                    <label>Fixed Rent Amount (Monthly)</label>
                                    <div className="currency-input">
                                        <span className="currency-symbol">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="0.00" 
                                            value={formData.monthly_rent}
                                            onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
                                        />
                                        <span className="currency-code">INR</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Minimum Guarantee (MGR)</label>
                                    <div className="currency-input">
                                        <span className="currency-symbol">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="0.00" 
                                            value={formData.monthly_rent}
                                            onChange={(e) => handleInputChange('monthly_rent', e.target.value)}
                                        />
                                        <span className="currency-code">INR</span>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Using Currency</label>
                                <input type="text" value="INR" readOnly className="bg-input" />
                            </div>
                        </div>

                        {rentModel === 'RevenueShare' && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Revenue Share Percentage (%)</label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 10" 
                                        value={formData.revenue_share_percentage}
                                        onChange={(e) => handleInputChange('revenue_share_percentage', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Applicable On</label>
                                    <select 
                                        value={formData.revenue_share_applicable_on}
                                        onChange={(e) => handleInputChange('revenue_share_applicable_on', e.target.value)}
                                    >
                                        <option>Net Sales</option>
                                        <option>Gross Sales</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Payment Due Day</label>
                                <select 
                                    value={formData.payment_due_day}
                                    onChange={(e) => handleInputChange('payment_due_day', e.target.value)}
                                >
                                    <option>1st of Month</option>
                                    <option>5th of Month</option>
                                    <option>10th of Month</option>
                                    <option>End of Month</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Billing Frequency</label>
                                <select 
                                    value={formData.billing_frequency}
                                    onChange={(e) => handleInputChange('billing_frequency', e.target.value)}
                                >
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Annually</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>CAM Charges (Monthly)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={formData.cam_charges}
                                        onChange={(e) => handleInputChange('cam_charges', e.target.value)}
                                    />
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
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={formData.security_deposit}
                                        onChange={(e) => handleInputChange('security_deposit', e.target.value)}
                                    />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Utility Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={formData.utility_deposit}
                                        onChange={(e) => handleInputChange('utility_deposit', e.target.value)}
                                    />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deposit Type</label>
                                <select 
                                    value={formData.deposit_type}
                                    onChange={(e) => handleInputChange('deposit_type', e.target.value)}
                                >
                                    <option>Cash</option>
                                    <option>Check</option>
                                    <option>Bank Transfer</option>
                                    <option>UPI</option>
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
                                        <option>Percentage</option>
                                        <option>Fixed Amount</option>
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
                                <button className="remove-step-btn" onClick={() => removeEscalationStep(index)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))}

                        <button className="add-step-btn" onClick={addEscalationStep}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add Escalation Step
                        </button>
                    </div>

                    <div className="form-actions">
                        <button className="cancel-btn" onClick={() => navigate('/admin/leases')}>Cancel</button>
                        <button className="create-btn" onClick={handleSubmit}>Create Lease</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddLease;
