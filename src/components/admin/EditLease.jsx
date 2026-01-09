import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getLeaseById, updateLease, getProjects, getUnits, getTenants, getOwners } from '../../services/api';
import './EditLease.css';
import './dashboard.css';

const EditLease = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [owners, setOwners] = useState([]);
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
        status: 'active'
    });
    const [escalationSteps, setEscalationSteps] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaseRes, projectsRes, tenantsRes, ownersRes] = await Promise.all([
                    getLeaseById(id),
                    getProjects(),
                    getTenants(),
                    getOwners()
                ]);
                
                const lease = leaseRes.data;
                setFormData({
                    lease_type: lease.lease_type || 'direct',
                    rent_model: lease.rent_model || 'fixed',
                    project_id: lease.project_id || '',
                    unit_id: lease.unit_id || '',
                    tenant_id: lease.tenant_id || '',
                    owner_id: lease.owner_id || '',
                    sub_lease_area: lease.sub_lease_area || '',
                    lease_start_date: lease.lease_start_date || '',
                    lease_end_date: lease.lease_end_date || '',
                    rent_commencement_date: lease.rent_commencement_date || '',
                    duration_months: lease.duration_months || '',
                    lockin_period_months: lease.lockin_period_months || '',
                    notice_period_months: lease.notice_period_months || '',
                    monthly_rent: lease.monthly_rent || '',
                    mgr: lease.mgr || '',
                    revenue_share_percentage: lease.revenue_share_percentage || '',
                    applicable_on: lease.applicable_on || 'Net Sales',
                    payment_due_day: lease.payment_due_day?.toString() || '1',
                    billing_frequency: lease.billing_frequency || 'Monthly',
                    cam_charges: lease.cam_charges || '',
                    security_deposit: lease.security_deposit || '',
                    deposit_type: lease.deposit_type || 'Cash / Check',
                    currency: lease.currency || 'INR',
                    status: lease.status || 'active'
                });
                
                if (lease.escalations) {
                    setEscalationSteps(lease.escalations.map(esc => ({
                        effectiveDate: esc.effective_date,
                        increaseType: esc.increase_type,
                        value: esc.value.toString()
                    })));
                }
                
                setProjects(projectsRes.data);
                setTenants(tenantsRes.data);
                setOwners(ownersRes.data);
                
                if (lease.project_id) {
                    const unitsRes = await getUnits();
                    setUnits(unitsRes.data.filter(unit => unit.project_id == lease.project_id));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'project_id') {
            setFormData(prev => ({ ...prev, project_id: value, unit_id: '' }));
            const fetchUnits = async () => {
                try {
                    const response = await getUnits();
                    setUnits(response.data.filter(unit => unit.project_id == value));
                } catch (error) {
                    console.error("Error fetching units:", error);
                }
            };
            if (value) fetchUnits();
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addEscalationStep = () => {
        setEscalationSteps([...escalationSteps, { effectiveDate: '', increaseType: 'Percentage (%)', value: '' }]);
    };

    const removeEscalationStep = (index) => {
        setEscalationSteps(escalationSteps.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
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
            await updateLease(id, updateData);
            alert("Lease Updated Successfully");
            navigate('/admin/leases');
        } catch (error) {
            console.error("Error updating lease:", error);
            alert("Failed to update lease");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div>Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <Link to="/admin/dashboard" className="text-muted">HOME</Link> &gt;
                            <Link to="/admin/leases" className="text-muted"> LEASES</Link> &gt;
                            <span className="active"> EDIT LEASE</span>
                        </div>
                        <h1>Edit Lease: {id}</h1>
                        <p>Update lease agreement details, terms, and financials.</p>
                    </div>
                </header>

                <form className="form-layout" onSubmit={handleSubmit}>
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
                                <select name="unit_id" value={formData.unit_id} onChange={handleChange} required>
                                    <option value="">Select Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tenant</label>
                                <select name="tenant_id" value={formData.tenant_id} onChange={handleChange} required>
                                    <option value="">Select Tenant</option>
                                    {tenants.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Owner (Landlord)</label>
                                <select name="owner_id" value={formData.owner_id} onChange={handleChange} required>
                                    <option value="">Select Owner</option>
                                    {owners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

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
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (Months)</label>
                                <input type="text" value={formData.duration_months} readOnly style={{ backgroundColor: '#f7fafc' }} />
                            </div>
                            <div className="form-group">
                                <label>Lockin Period (Months)</label>
                                <input type="number" name="lockin_period_months" value={formData.lockin_period_months} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Notice Period (Months)</label>
                                <input type="number" name="notice_period_months" value={formData.notice_period_months} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Rent & Financials</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Base Monthly Rent</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Min. Guaranteed Rent (MGR)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="mgr" value={formData.mgr} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>CAM Charges (Monthly)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="cam_charges" value={formData.cam_charges} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                        </div>

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
                                <label>Revenue Share Percentage (%)</label>
                                <input type="number" name="revenue_share_percentage" value={formData.revenue_share_percentage} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Security Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} />
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
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="terminated">Terminated</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Rent Escalations</h3>
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
                        <button type="submit" className="create-btn">Update Lease</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditLease;
