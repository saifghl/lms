import React from 'react';

const Step4Escalations = ({
    escalationSteps,
    setEscalationSteps,
    addEscalationStep,
    removeEscalationStep,
    formData,
    rentModel
}) => {
    // Current base rentals
    const currentMGBase = parseFloat(formData.mg_amount_sqft || formData.mg_amount || 0).toFixed(2);
    const currentRevShare = rentModel !== 'Fixed' ? (parseFloat(formData.revenue_share_percentage || 0).toFixed(2) + '%') : 'N/A';
    
    // Auto-calculate effective_from if empty (Rule 16)
    const handleStepChange = (index, field, value) => {
        const newSteps = [...escalationSteps];
        newSteps[index][field] = value;
        setEscalationSteps(newSteps);
    };

    return (
        <div className="form-section">
            <h3>Step 4: Rent Escalations</h3>
            
            {/* Rule 17: Rent Escalation section should start with the Current Rental */}
            <div className="current-rental-info" style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Current Rental Terms (Base)</h4>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#475569' }}>
                    <div><strong>Commencement Date:</strong> {formData.rent_commencement_date || 'Not Set'}</div>
                    <div><strong>MG Rate / Sqft:</strong> ₹{currentMGBase}</div>
                    {rentModel !== 'Fixed' && <div><strong>Revenue Share:</strong> {currentRevShare}</div>}
                </div>
            </div>

            <p className="helper-text">Escalations auto-start from Rent Commencement if no prior escalation exists. Effective To date is mandatory.</p>

            <div className="escalations-section" style={{ marginTop: '20px' }}>
                {escalationSteps.map((step, index) => {
                    // Logic to show "Auto" or actual date
                    // If it's the first step, auto is "Rent Commencement Date"
                    const isFirst = index === 0;
                    
                    return (
                        <div className="escalation-row" key={index} style={{ background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h5 style={{ margin: 0, color: '#334155' }}>Escalation #{index + 1}</h5>
                                <button type="button" onClick={() => removeEscalationStep(index)} style={{ padding: '4px 8px', background: '#ffe4e6', color: '#e11d48', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                    Remove
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                {/* Effective Dates */}
                                <div className="form-group" style={{ flex: '1 1 200px' }}>
                                    <label>Effective From</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={step.effectiveDate || (isFirst ? formData.rent_commencement_date : '')} 
                                        onChange={(e) => handleStepChange(index, 'effectiveDate', e.target.value)} 
                                        readOnly={isFirst && !step.effectiveDate} 
                                        style={isFirst && !step.effectiveDate ? { backgroundColor: '#f1f5f9' } : {}}
                                    />
                                    {isFirst && !step.effectiveDate && <small style={{color: '#64748b'}}>Auto (Rent Comm.)</small>}
                                </div>
                                <div className="form-group" style={{ flex: '1 1 200px' }}>
                                    <label>Effective To *</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={step.effectiveToDate} 
                                        onChange={(e) => handleStepChange(index, 'effectiveToDate', e.target.value)} 
                                        required
                                    />
                                </div>

                                {/* Rule 18: Escalation On */}
                                <div className="form-group" style={{ flex: '1 1 200px' }}>
                                    <label>Escalation Applies To</label>
                                    <select 
                                        className="form-control" 
                                        value={step.escalation_on || 'mg'} 
                                        onChange={(e) => handleStepChange(index, 'escalation_on', e.target.value)}
                                    >
                                        <option value="mg">Minimum Guarantee (MG) / Base</option>
                                        {rentModel !== 'Fixed' && <option value="revenue_share">Revenue Share %</option>}
                                        {rentModel !== 'Fixed' && <option value="both">Both (Convert/Hybrid)</option>}
                                    </select>
                                </div>

                                {/* Rule 22: Added "Rate" option */}
                                <div className="form-group" style={{ flex: '1 1 150px' }}>
                                    <label>Increase Type</label>
                                    <select 
                                        className="form-control" 
                                        value={step.increaseType} 
                                        onChange={(e) => handleStepChange(index, 'increaseType', e.target.value)}
                                    >
                                        <option value="Percentage (%)">Percentage (%)</option>
                                        <option value="Fixed Amount">Fixed Amount Addition</option>
                                        <option value="Rate Per Sqft">New Rate Per Sqft</option>
                                    </select>
                                </div>
                                
                                <div className="form-group" style={{ flex: '1 1 150px' }}>
                                    <label>Value</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="e.g. 5"
                                        value={step.value} 
                                        onChange={(e) => handleStepChange(index, 'value', e.target.value)} 
                                    />
                                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                                        {step.increaseType === 'Percentage (%)' ? '% increase on base' : 
                                         step.increaseType === 'Fixed Amount' ? '+ flat amount to rental' : 
                                         'sets total rental rate'}
                                    </small>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <button type="button" className="add-btn" onClick={addEscalationStep} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px dashed #cbd5e1', color: '#334155', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                    + Add New Escalation Period
                </button>
            </div>
        </div>
    );
};

export default Step4Escalations;
