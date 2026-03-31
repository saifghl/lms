import React from 'react';

const Step2TermsFinalization = ({
    formData,
    setFormData,
    selectedProject,
    selectedUnit
}) => {
    // Helper to calculate tenure in months
    React.useEffect(() => {
        if (formData.lease_start && formData.lease_end) {
            const start = new Date(formData.lease_start);
            const end = new Date(formData.lease_end);
            
            let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            if (end.getDate() < start.getDate()) {
                months--;
            }
            months = isNaN(months) || months < 0 ? 0 : months;
            
            setFormData(prev => {
                if (prev.tenure_months === months) return prev;
                return { ...prev, tenure_months: months };
            });
        }
    }, [formData.lease_start, formData.lease_end, setFormData]);

    return (
        <div className="form-section">
            <h3>Step 2: Term Finalization</h3>

            <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lease Start Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.lease_start}
                        max={formData.lease_end || undefined}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            if (formData.lease_end && newDate > formData.lease_end) {
                                alert("Lease Start Date cannot be after Lease End Date.");
                                return;
                            }
                            setFormData({ ...formData, lease_start: newDate });
                        }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lease End Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.lease_end}
                        min={formData.lease_start || undefined}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            if (formData.lease_start && newDate < formData.lease_start) {
                                alert("Lease End Date cannot be before Lease Start Date.");
                                return;
                            }
                            setFormData({ ...formData, lease_end: newDate });
                        }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Duration (Months) *</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.tenure_months === undefined ? '' : formData.tenure_months}
                        onChange={(e) => {
                            const newMonths = parseInt(e.target.value);
                            if (isNaN(newMonths) || newMonths < 0) {
                                setFormData({ ...formData, tenure_months: '' });
                                return;
                            }
                            
                            setFormData((prev) => {
                                const updates = { tenure_months: newMonths };
                                if (prev.lease_start) {
                                    const newEnd = new Date(prev.lease_start);
                                    newEnd.setMonth(newEnd.getMonth() + newMonths);
                                    
                                    // Normally the lease end is exactly minus 1 day from the same day after X months.
                                    // Simple approach: just add the months.
                                    updates.lease_end = newEnd.toISOString().slice(0, 10);
                                }
                                return { ...prev, ...updates };
                            });
                        }}
                    />
                </div>
            </div>

            <div className="form-row" style={{ marginTop: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Unit Handover Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.unit_handover_date || ''}
                        onChange={(e) => setFormData({ ...formData, unit_handover_date: e.target.value })}
                    />
                </div>
                 <div className="form-group" style={{ flex: 1 }}>
                    <label>Fitout Period Start</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.fitout_period_start || ''}
                        max={formData.fitout_period_end || undefined}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            if (formData.fitout_period_end && newDate > formData.fitout_period_end) {
                                alert("Fitout Period Start cannot be after Fitout Period End.");
                                return;
                            }
                            setFormData({ ...formData, fitout_period_start: newDate });
                        }}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Fitout Period End</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.fitout_period_end || ''}
                        min={formData.fitout_period_start || undefined}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            if (formData.fitout_period_start && newDate < formData.fitout_period_start) {
                                alert("Fitout Period End cannot be before Fitout Period Start.");
                                return;
                            }
                            setFormData({ ...formData, fitout_period_end: newDate });
                        }}
                    />
                </div>
            </div>
            
            <div className="form-row" style={{ marginTop: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Store Open Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.opening_date || ''}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            // Validation 20: Store open date cannot be before Fitout completion date and should be within lease subsistence tenure
                            if (formData.fitout_period_end && newDate < formData.fitout_period_end) {
                                alert("Store Open Date cannot be before Fitout Completion Date.");
                                return;
                            }
                            if (formData.lease_start && newDate < formData.lease_start) {
                                alert("Store Open Date cannot be before Lease Start Date.");
                                return;
                            }
                            if (formData.lease_end && newDate > formData.lease_end) {
                                alert("Store Open Date cannot be after Lease End Date.");
                                return;
                            }
                            setFormData({ ...formData, opening_date: newDate });
                        }}
                    />
                    <small style={{ color: '#64748b' }}>Must be on or after Fitout bounds</small>
                </div>
                 <div className="form-group" style={{ flex: 1 }}>
                    <label>Rent Commencement Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.rent_commencement_date || ''}
                        onChange={(e) => setFormData({ ...formData, rent_commencement_date: e.target.value })}
                    />
                </div>
            </div>

            <h4 style={{ margin: '30px 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Lockin & Notice Periods</h4>
            
            <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lessee Lock-in Period (Months)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 12"
                        value={formData.lessee_lockin_period_months}
                        onChange={(e) => setFormData({ ...formData, lessee_lockin_period_months: e.target.value })}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lessor Lock-in Period (Months)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 12"
                        value={formData.lessor_lockin_period_months}
                        onChange={(e) => setFormData({ ...formData, lessor_lockin_period_months: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-row" style={{ marginTop: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lessee Notice Period (Months)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 3"
                        value={formData.lessee_notice_period_months}
                        onChange={(e) => setFormData({ ...formData, lessee_notice_period_months: e.target.value })}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Lessor Notice Period (Months)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 3"
                        value={formData.lessor_notice_period_months}
                        onChange={(e) => setFormData({ ...formData, lessor_notice_period_months: e.target.value })}
                    />
                </div>
            </div>
            
            {/* Notice for Vacation is specifically REMOVED here per the rules */}

        </div>
    );
};

export default Step2TermsFinalization;
