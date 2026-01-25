import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { partyAPI } from '../../services/api';
import './PartyForm.css';

const AddParty = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        type: 'Individual',
        company_name: '',
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        alt_phone: '',
        identification_type: 'Tax ID',
        identification_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await partyAPI.createParty(formData);
            navigate('/admin/parties');
        } catch (error) {
            console.error("Failed to create party", error);
            alert("Failed to create party. Please check the inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="party-form-container">
            <Sidebar />
            <main className="party-form-content">
                <div className="breadcrumb">
                    <Link to="/admin/dashboard">HOME</Link> &gt;
                    <Link to="/admin/parties"> PARTIES</Link> &gt; ADD NEW
                </div>

                <header className="party-form-header">
                    <h2>Add New Party</h2>
                    <p>Enter details for a new individual or company.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* TYPE SELECTION */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Party Type</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ maxWidth: '300px' }}>
                                <label>Legal Entity Type *</label>
                                <select
                                    className="form-select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="Individual">Individual</option>
                                    <option value="Company">Company</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* COMPANY DETAILS (Conditional) */}
                    {formData.type === 'Company' && (
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Company Details</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company Name *</label>
                                    <input
                                        className="form-input"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        required={formData.type === 'Company'}
                                        placeholder="e.g. Acme Corp Pvt Ltd"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PERSONAL / REPRESENTATIVE INFO */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>{formData.type === 'Company' ? 'Representative Information' : 'Personal Information'}</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 0.2 }}>
                                <label>Title</label>
                                <select
                                    className="form-select"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    className="form-input"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input
                                    className="form-input"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    className="form-input"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Alt Phone</label>
                                <input
                                    className="form-input"
                                    name="alt_phone"
                                    value={formData.alt_phone}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>

                    {/* IDENTIFICATION */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Identification</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>ID Type</label>
                                <select
                                    className="form-select"
                                    name="identification_type"
                                    value={formData.identification_type}
                                    onChange={handleChange}
                                >
                                    <option value="Tax ID">Tax ID / PAN</option>
                                    <option value="Voter ID">Voter ID</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Aadhar">Aadhar</option>
                                    <option value="CIN">CIN (Company)</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>ID Number</label>
                                <input
                                    className="form-input"
                                    name="identification_number"
                                    value={formData.identification_number}
                                    onChange={handleChange}
                                    placeholder="Enter ID Number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Address</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Address Line 1</label>
                                <input
                                    className="form-input"
                                    name="address_line1"
                                    value={formData.address_line1}
                                    onChange={handleChange}
                                    placeholder="Street Address"
                                />
                            </div>
                            <div className="form-group">
                                <label>Address Line 2</label>
                                <input
                                    className="form-input"
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleChange}
                                    placeholder="Apartment, Suite, etc."
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    className="form-input"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    className="form-input"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    className="form-input"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    className="form-input"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/admin/parties')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Party'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddParty;
