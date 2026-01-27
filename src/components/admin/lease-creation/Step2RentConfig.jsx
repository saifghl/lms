import React from 'react';

const Step2RentConfig = ({
    rentModel,
    formData,
    setFormData,
    escalationSteps,
    setEscalationSteps,
    addEscalationStep,
    removeEscalationStep
}) => {

    return (
        <div className="form-section">
            <h3>Step 2: Rent Configuration - {rentModel} Model</h3>

            {/* FIXED RENT CONFIGURATION */}
            {(rentModel === 'Fixed' || rentModel === 'Hybrid') && (
                <div className="rent-block">
                    <h4>Fixed Rent Details</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Fixed Rent Amount (Monthly)</label>
                            <div className="currency-input">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.monthly_rent}
                                    onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                                />
                                <span className="currency-code">INR</span>
                            </div>
                        </div>
                    </div>

                    {/* ESCALATIONS */}
                    <div className="escalations-section" style={{ marginTop: '20px' }}>
                        <h5>Rent Escalations</h5>
                        <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '10px' }}>
                            Define effective dates for rent increases.
                        </p>

                        {escalationSteps.map((step, index) => (
                            <div className="escalation-row" key={index} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'flex-end' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Effective Date</label>
                                    <input type="date" className="form-control" value={step.effectiveDate} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].effectiveDate = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Effective To (Optional)</label>
                                    <input type="date" className="form-control" value={step.effectiveToDate} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].effectiveToDate = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Type</label>
                                    <select className="form-control" value={step.increaseType} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].increaseType = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }}>
                                        <option>Percentage (%)</option>
                                        <option>Fixed Amount</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Value</label>
                                    <input type="number" className="form-control" value={step.value} onChange={(e) => {
                                        const newSteps = [...escalationSteps];
                                        newSteps[index].value = e.target.value;
                                        setEscalationSteps(newSteps);
                                    }} />
                                </div>
                                <button type="button" className="remove-btn" onClick={() => removeEscalationStep(index)} style={{ marginBottom: '5px', padding: '8px', background: '#ffe4e6', color: '#e11d48', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    X
                                </button>
                            </div>
                        ))}

                        <button type="button" className="add-btn" onClick={addEscalationStep} style={{ marginTop: '10px', padding: '8px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                            + Add Escalation Step
                        </button>
                    </div>
                </div>
            )}

            {/* SEPARATOR FOR HYBRID */}
            {rentModel === 'Hybrid' && <hr style={{ margin: '30px 0', border: '0', borderTop: '1px dashed #cbd5e1' }} />}

            {/* REVENUE SHARE CONFIGURATION */}
            {(rentModel === 'RevenueShare' || rentModel === 'Hybrid') && (
                <div className="rent-block">
                    <h4>Revenue Share Details</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Minimum Guarantee (MGR) {rentModel === 'Hybrid' ? '(Optional)' : ''}</label>
                            <div className="currency-input">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={rentModel === 'Hybrid' ? (formData.minimum_guarantee || '') : formData.monthly_rent} // For RevShare, MGR is stored in monthly_rent usually, or use separate field
                                    onChange={(e) => {
                                        if (rentModel === 'Hybrid') {
                                            setFormData({ ...formData, minimum_guarantee: e.target.value })
                                        } else {
                                            setFormData({ ...formData, monthly_rent: e.target.value })
                                        }
                                    }}
                                />
                                <span className="currency-code">INR</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Revenue Share Percentage (%)</label>
                            <input
                                type="number"
                                placeholder="e.g. 10"
                                className="form-control"
                                value={formData.revenue_share_percentage}
                                onChange={(e) => setFormData({ ...formData, revenue_share_percentage: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Applicable On</label>
                            <select
                                className="form-control"
                                value={formData.revenue_share_applicable_on}
                                onChange={(e) => setFormData({ ...formData, revenue_share_applicable_on: e.target.value })}
                            >
                                <option>Net Sales</option>
                                <option>Gross Sales</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step2RentConfig;
