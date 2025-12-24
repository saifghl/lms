import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddLease.css';
import './dashboard.css'; // Ensure dashboard styles are available

const AddLease = () => {
    const navigate = useNavigate();
    const [escalationSteps, setEscalationSteps] = useState([
        { effectiveDate: '', increaseType: 'Percentage (%)', value: '5' }
    ]);

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
                    {/* Section 1: Property & Parties */}
                    <div className="form-section">
                        <h3>Property & Parties</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Project</label>
                                <select defaultValue="">
                                    <option value="" disabled>Select Project</option>
                                    <option>Sunrise Apartments</option>
                                    <option>Oakwood Residency</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit</label>
                                <select defaultValue="">
                                    <option value="" disabled>Select Unit</option>
                                    <option>Unit 101</option>
                                    <option>Unit 102</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tenant</label>
                                <select defaultValue="">
                                    <option value="" disabled>Select Tenant</option>
                                    <option>John Smith</option>
                                    <option>TechCorp Inc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Owner (Landlord)</label>
                                <select defaultValue="">
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
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Lease End Date</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Rent Commencement Date</label>
                                <input type="date" />
                                <small style={{ color: '#718096', fontSize: '0.8rem' }}>Fit-out period ends</small>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (Months)</label>
                                <input type="text" placeholder="Calculated automatically" readOnly style={{ backgroundColor: '#f7fafc' }} />
                            </div>
                            <div className="form-group">
                                <label>Lockin Period (Months)</label>
                                <input type="number" placeholder="e.g. 12" />
                            </div>
                            <div className="form-group">
                                <label>Notice Period (Months)</label>
                                <input type="number" placeholder="e.g. 3" />
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
                                    <input type="number" placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Min. Guaranteed Rent (MGR)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>CAM Charges (Monthly)</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Payment Due Day</label>
                                <select>
                                    <option>1st of Month</option>
                                    <option>5th of Month</option>
                                    <option>10th of Month</option>
                                    <option>End of Month</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Billing Frequency</label>
                                <select>
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Half-Yearly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Late Payment Fee (%)</label>
                                <input type="number" placeholder="e.g. 5%" />
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.95rem', margin: '16px 0 12px 0', color: '#4a5568', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Revenue Share Details</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Revenue Share Percentage (%)</label>
                                <input type="number" placeholder="e.g. 10%" />
                            </div>
                            <div className="form-group">
                                <label>Applicable On</label>
                                <select>
                                    <option>Net Sales</option>
                                    <option>Gross Sales</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Reporting Frequency</label>
                                <select>
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
                                    <input type="number" placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Utility Deposit</label>
                                <div className="currency-input">
                                    <span className="currency-symbol">₹</span>
                                    <input type="number" placeholder="0.00" />
                                    <span className="currency-code">INR</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deposit Type</label>
                                <select>
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
                        <button className="create-btn" onClick={() => navigate('/admin/leases')}>Create Lease</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddLease;
