import React from 'react';

const Step3Finalize = ({ formData, setFormData }) => {
    return (
        <div className="form-section">
            <h3>Step 3: Terms & Finalization</h3>

            {/* Dates & Tenure */}
            <div className="form-row date-row">
                <div className="form-group">
                    <label>Lease Start Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.lease_start}
                        onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Lease End Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.lease_end}
                        onChange={(e) => setFormData({ ...formData, lease_end: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Rent Commencement Date *</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.rent_commencement_date}
                        onChange={(e) => setFormData({ ...formData, rent_commencement_date: e.target.value })}
                    />
                    <small className="help-text">Fit-out period ends here</small>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Fit-out Period End</label>
                    <input
                        type="date"
                        className="form-control"
                        value={formData.fitout_period_end}
                        onChange={(e) => setFormData({ ...formData, fitout_period_end: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Lockin Period (Months)</label>
                    <input
                        type="number"
                        placeholder="e.g. 12"
                        className="form-control"
                        value={formData.lockin_period_months}
                        onChange={(e) => setFormData({ ...formData, lockin_period_months: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Notice Period (Months)</label>
                    <input
                        type="number"
                        placeholder="e.g. 3"
                        className="form-control"
                        value={formData.notice_period_months}
                        onChange={(e) => setFormData({ ...formData, notice_period_months: e.target.value })}
                    />
                </div>
            </div>

            {/* Other Financials */}
            <h4 style={{ margin: '20px 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Additional Financials</h4>
            <div className="form-row">
                <div className="form-group">
                    <label>Payment Due Day</label>
                    <select
                        value={formData.payment_due_day}
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, payment_due_day: e.target.value })}
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
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, billing_frequency: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, cam_charges: e.target.value })}
                        />
                        <span className="currency-code">INR</span>
                    </div>
                </div>
            </div>

            {/* Deposits */}
            <h4 style={{ margin: '20px 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Deposits</h4>
            <div className="form-row">
                <div className="form-group">
                    <label>Security Deposit</label>
                    <div className="currency-input">
                        <span className="currency-symbol">₹</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.security_deposit}
                            onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, utility_deposit: e.target.value })}
                        />
                        <span className="currency-code">INR</span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Deposit Type</label>
                    <select
                        value={formData.deposit_type}
                        className="form-control"
                        onChange={(e) => setFormData({ ...formData, deposit_type: e.target.value })}
                    >
                        <option>Cash</option>
                        <option>Check</option>
                        <option>Bank Transfer</option>
                        <option>UPI</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Step3Finalize;
