import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EditLease.css';
import './dashboard.css';

const EditLease = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [saving, setSaving] = useState(false);

    // Form Fields
    const [formData, setFormData] = useState({
        project: '',
        unit: '',
        tenant: '',
        owner: '',
        startDate: '',
        endDate: '',
        rentCommencementDate: '',
        duration: '',
        lockinPeriod: '',
        noticePeriod: '',
        baseRent: '',
        mgr: '',
        camCharges: '',
        paymentDueDay: '1st of Month',
        billingFrequency: 'Monthly',
        latePaymentFee: '',
        revenueShare: '',
        applicableOn: 'Net Sales',
        reportingFrequency: 'Monthly',
        securityDeposit: '',
        utilityDeposit: '',
        depositType: 'Cash / Check'
    });

    const [escalationSteps, setEscalationSteps] = useState([]);

    useEffect(() => {
        if (!id) return;

        const fetchLease = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/leases/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                if (!res.ok) throw new Error('Failed to fetch lease');

                const data = await res.json();

                setFormData({
                    project: data.project_name || '',
                    unit: data.unit_number || '',
                    tenant: data.tenant_name || '',
                    owner: data.owner_name || '',
                    startDate: data.lease_start ? data.lease_start.substring(0, 10) : '',
                    endDate: data.lease_end ? data.lease_end.substring(0, 10) : '',
                    rentCommencementDate: data.rent_commencement_date ? data.rent_commencement_date.substring(0, 10) : '',
                    duration: data.tenure_months ? `${data.tenure_months} Months` : '',
                    lockinPeriod: data.lockin_period_months || '',
                    noticePeriod: data.notice_period_months || '',
                    baseRent: data.monthly_rent || '',
                    mgr: data.monthly_rent || '',
                    camCharges: data.cam_charges || '',
                    paymentDueDay: data.payment_due_day || '1st of Month',
                    billingFrequency: data.billing_frequency || 'Monthly',
                    latePaymentFee: '',
                    revenueShare: data.revenue_share_percentage || '',
                    applicableOn: data.revenue_share_applicable_on || 'Net Sales',
                    reportingFrequency: 'Monthly',
                    securityDeposit: data.security_deposit || '',
                    utilityDeposit: data.utility_deposit || '',
                    depositType: data.deposit_type || 'Cash / Check'
                });

                setEscalationSteps(
                    (data.escalations || []).map(esc => ({
                        effectiveDate: esc.effective_from ? esc.effective_from.substring(0, 10) : '',
                        increaseType: esc.increase_type === 'Fixed Amount' ? 'Fixed Amount (₹)' : 'Percentage (%)',
                        value: esc.value
                    }))
                );
            } catch (err) {
                console.error(err);
                alert('Failed to load lease details');
            }
        };

        fetchLease();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                            <span className="active"> EDIT LEASE</span>
                        </div>
                        <h1>Edit Lease: {id}</h1>
                        <p>Update lease agreement details, terms, and financials.</p>
                    </div>
                </header>

                <div className="form-layout">
                    {/* Section 1: Property & Parties */}
                    <div className="form-section">
                        <h3>Property & Parties</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Project</label>
                                <select name="project" value={formData.project} onChange={handleChange}>
                                    <option value="" disabled>Select Project</option>
                                    <option>Sunrise Apartments</option>
                                    <option>Oakwood Residency</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select name="unit" value={formData.unit} onChange={handleChange}>
                                    <option value="" disabled>Select Unit</option>
                                    <option>Unit 101</option>
                                    <option>Unit 102</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tenant</label>
                                <select name="tenant" value={formData.tenant} onChange={handleChange}>
                                    <option value="" disabled>Select Tenant</option>
                                    <option>John Smith</option>
                                    <option>TechCorp Inc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Owner (Landlord)</label>
                                <select name="owner" value={formData.owner} onChange={handleChange}>
                                    <option value="" disabled>Select Owner</option>
                                    <option>Cusec Properties</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Lease Period & Lockin */}
                    <div className="form-section">
                        <h3>Lease Period & Lockin</h3>
                        <div className="form-row date-row">
                            <div className="form-group">
                                <label>Lease Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Lease End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Rent Commencement Date</label>
                                <input type="date" name="rentCommencementDate" value={formData.rentCommencementDate} onChange={handleChange} />
                                <small style={{ color: '#718096', fontSize: '0.8rem' }}>Fit-out period ends</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (Months)</label>
                                <input type="text" name="duration" value={formData.duration} readOnly style={{ backgroundColor: '#f7fafc' }} />
                            </div>
                            <div className="form-group">
                                <label>Lockin Period (Months)</label>
                                <input type="number" name="lockinPeriod" value={formData.lockinPeriod} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Notice Period (Months)</label>
                                <input type="number" name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Rent & Financials */}
                    <div className="form-section">
                        <h3>Rent & Financials</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Base Monthly Rent</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="baseRent" value={formData.baseRent} onChange={handleChange} />
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
                                    <input type="number" name="camCharges" value={formData.camCharges} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Payment Due Day</label>
                                <select name="paymentDueDay" value={formData.paymentDueDay} onChange={handleChange}>
                                    <option>1st of Month</option>
                                    <option>5th of Month</option>
                                    <option>10th of Month</option>
                                    <option>End of Month</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Billing Frequency</label>
                                <select name="billingFrequency" value={formData.billingFrequency} onChange={handleChange}>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Half-Yearly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Late Payment Fee (%)</label>
                                <input type="number" name="latePaymentFee" value={formData.latePaymentFee} onChange={handleChange} />
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.95rem', margin: '16px 0 12px 0', color: '#4a5568', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Revenue Share Details</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Revenue Share Percentage (%)</label>
                                <input type="number" name="revenueShare" value={formData.revenueShare} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Applicable On</label>
                                <select name="applicableOn" value={formData.applicableOn} onChange={handleChange}>
                                    <option>Net Sales</option>
                                    <option>Gross Sales</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Reporting Frequency</label>
                                <select name="reportingFrequency" value={formData.reportingFrequency} onChange={handleChange}>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                </select>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.95rem', margin: '16px 0 12px 0', color: '#4a5568', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Security Deposits</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Security Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Utility Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" name="utilityDeposit" value={formData.utilityDeposit} onChange={handleChange} />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deposit Type</label>
                                <select name="depositType" value={formData.depositType} onChange={handleChange}>
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
                        <button
                            className="create-btn"
                            disabled={saving}
                            onClick={async () => {
                                try {
                                    setSaving(true);

                                    const payload = {
                                        lease_start: formData.startDate,
                                        lease_end: formData.endDate,
                                        rent_commencement_date: formData.rentCommencementDate,
                                        lockin_period_months: parseInt(formData.lockinPeriod, 10) || 12,
                                        notice_period_months: parseInt(formData.noticePeriod, 10) || 3,
                                        monthly_rent: parseFloat(formData.baseRent) || 0,
                                        cam_charges: parseFloat(formData.camCharges) || 0,
                                        security_deposit: parseFloat(formData.securityDeposit) || 0,
                                        utility_deposit: parseFloat(formData.utilityDeposit) || 0,
                                        billing_frequency: formData.billingFrequency,
                                        payment_due_day: formData.paymentDueDay,
                                        revenue_share_percentage: formData.revenueShare
                                            ? parseFloat(formData.revenueShare)
                                            : null,
                                        revenue_share_applicable_on: formData.revenueShare
                                            ? formData.applicableOn
                                            : null,
                                        escalations: escalationSteps
                                            .filter(step => step.effectiveDate && step.value)
                                            .map(step => ({
                                                effective_from: step.effectiveDate,
                                                increase_type: step.increaseType.startsWith('Fixed')
                                                    ? 'Fixed Amount'
                                                    : 'Percentage',
                                                value: parseFloat(step.value)
                                            }))
                                    };

                                    const token = localStorage.getItem('token');
                                    const res = await fetch(`http://localhost:5000/api/leases/${id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                                        },
                                        body: JSON.stringify(payload)
                                    });

                                    const data = await res.json().catch(() => null);
                                    if (!res.ok) {
                                        throw new Error(data?.message || 'Failed to update lease');
                                    }

                                    alert('Lease updated successfully');
                                    navigate('/admin/leases');
                                } catch (err) {
                                    console.error(err);
                                    alert(err.message || 'Failed to update lease');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? 'Saving...' : 'Update Lease'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditLease;
