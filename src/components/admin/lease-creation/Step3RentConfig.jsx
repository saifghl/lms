import React from 'react';

const Step3RentConfig = ({
    rentModel, // 'Fixed' | 'RevenueShare' | 'Hybrid'
    formData,
    setFormData,
    selectedProject,
    selectedUnit,
    isSubLease // Pass this down to use Sub Lease Area
}) => {
    
    // Automatically calculate rent amount from rates
    React.useEffect(() => {
        const calcType = selectedProject?.calculation_type || 'Chargeable Area';
        let usableArea = 0;
        
        // If it's a sub-lease, the rent applies to the "sub leased area"
        if (isSubLease && formData.sub_lease_area_sqft) {
            usableArea = parseFloat(formData.sub_lease_area_sqft) || 0;
        } else if (selectedUnit) {
            if (calcType === 'Covered Area') usableArea = parseFloat(selectedUnit.covered_area) || 0;
            else if (calcType === 'Carpet Area') usableArea = parseFloat(selectedUnit.carpet_area) || 0;
            else usableArea = parseFloat(selectedUnit.chargeable_area) || 0;
        }

        // Calculate based on mg_amount_sqft or monthly_rent (which is now acting as base fixed rate in DB)
        // Wait, for fixed we store the rate in "mg_amount_sqft" or we just input the final total.
        // Let's assume we capture mg_amount_sqft for all rate fields
        const totalMG = parseFloat(formData.mg_amount_sqft || 0) * usableArea;
        
        if (totalMG > 0) {
            setFormData(prev => ({ 
                ...prev, 
                mg_amount: totalMG.toFixed(2), 
                monthly_rent: totalMG.toFixed(2)  // Backup standard field
            }));
        }
    }, [formData.mg_amount_sqft, formData.sub_lease_area_sqft, isSubLease, selectedProject, selectedUnit, setFormData]);

    const daysOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        else if (day % 10 === 2 && day !== 12) suffix = 'nd';
        else if (day % 10 === 3 && day !== 13) suffix = 'rd';
        return `${day}${suffix} of every month`;
    });

    return (
        <div className="form-section">
            <h3>Step 3: Rent Configuration - {rentModel} Model</h3>

            <div className="rent-block">
                <h4>Rent & Financial Details</h4>
                <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>MG (Per Sqft) / Rent Rate</label>
                        <div className="input-with-suffix" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Rate"
                                value={formData.mg_amount_sqft}
                                onChange={(e) => setFormData({ ...formData, mg_amount_sqft: e.target.value })}
                            />
                            <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#666' }}>
                                on {isSubLease ? 'Sub Leased Area' : (selectedProject?.calculation_type || 'Chargeable Area')}
                            </span>
                        </div>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>MG Amount (INR) / Base Rent</label>
                        <div className="currency-input">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.mg_amount}
                                readOnly
                                style={{ backgroundColor: '#f3f4f6' }}
                            />
                            <span className="currency-code">INR</span>
                        </div>
                    </div>
                </div>

                {/* REVENUE SHARE FIELDS */}
                {(rentModel === 'RevenueShare' || rentModel === 'Hybrid') && (
                    <>
                        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px dashed #cbd5e1' }} />
                        <h4>Revenue Share Configuration</h4>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Revenue Share Percentage (%)</label>
                                <div className="input-with-suffix" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        placeholder="e.g. 10"
                                        className="form-control"
                                        value={formData.revenue_share_percentage || ''}
                                        onChange={(e) => setFormData({ ...formData, revenue_share_percentage: e.target.value })}
                                    />
                                    <span style={{ marginLeft: '10px' }}>%</span>
                                </div>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Applicable On</label>
                                <select
                                    className="form-control"
                                    value={formData.revenue_share_applicable_on || 'Net Sales'}
                                    onChange={(e) => setFormData({ ...formData, revenue_share_applicable_on: e.target.value })}
                                >
                                    <option value="Net Sales">Net Sales</option>
                                    <option value="Gross Sales">Gross Sales</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Rent Amount Option Calculation</label>
                                <select
                                    className="form-control"
                                    value={formData.rent_amount_option || 'Option B'}
                                    onChange={(e) => setFormData({ ...formData, rent_amount_option: e.target.value })}
                                >
                                    <option value="Option A">Option A (Total of MG + Rev Share)</option>
                                    <option value="Option B">Option B (Higher of MG or Rev Share)</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px dashed #cbd5e1' }} />

                <h4>Additional Financial Info</h4>
                <div className="form-row">
                     <div className="form-group" style={{ flex: 1 }}>
                        <label>Payment Due Date *</label>
                        <select
                            className="form-control"
                            value={formData.payment_due_day || '5th of every month'}
                            onChange={(e) => setFormData({ ...formData, payment_due_day: e.target.value })}
                        >
                            <option value="">Select Date</option>
                            {daysOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div className="form-group" style={{ flex: 1 }}>
                        <label>Billing Frequency</label>
                        <select
                            className="form-control"
                            value={formData.billing_frequency || 'Monthly'}
                            onChange={(e) => setFormData({ ...formData, billing_frequency: e.target.value })}
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annually">Annually</option>
                        </select>
                    </div>
                </div>

                <div className="form-row" style={{ marginTop: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Rent Free Period Start</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.rent_free_start_date || ''}
                            onChange={(e) => setFormData({ ...formData, rent_free_start_date: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Rent Free Period End</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.rent_free_end_date || ''}
                            onChange={(e) => setFormData({ ...formData, rent_free_end_date: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3RentConfig;
