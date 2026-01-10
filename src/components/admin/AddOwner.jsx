import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddOwner.css';
import { ownerAPI, unitAPI } from '../../services/api';

const AddOwner = () => {
    const navigate = useNavigate();

    const [units, setUnits] = useState([]);
    const [selectedUnitIds, setSelectedUnitIds] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        representative_name: '',
        representative_phone: '',
        representative_email: '',
        alternative_contact: '',
        address: ''
    });

    // FETCH UNITS (ADDED DEBUG LOG)
    useEffect(() => {
        unitAPI.getAll()
            .then(res => {
                console.log('Loaded units:', res.data); // Debug: Check if units load
                setUnits(res.data);
            })
            .catch(err => {
                console.error('Failed to load units', err);
                alert('Failed to load units. Check console.');
            });
    }, []);

    // INPUT CHANGE
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // UNIT SELECTION CHANGE (UPDATED FOR MULTI-SELECT DROPDOWN)
    const handleUnitChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedUnitIds(selectedOptions);
    };

    // TOTAL AREA
    const totalArea = units
        .filter(u => selectedUnitIds.includes(u.id)) // Ensure 'id' matches API response
        .reduce((sum, u) => sum + Number(u.super_area), 0);

    const handleCancel = () => {
        navigate('/admin/owner');
    };

    // ✅ FIXED SAVE HANDLER
    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert('Please fill all required owner details');
            return;
        }

        if (!formData.representative_name || !formData.representative_phone) {
            alert('Representative name and phone are required');
            return;
        }

        if (selectedUnitIds.length === 0) {
            alert('Please select at least one unit');
            return;
        }

        try {
            await ownerAPI.create({
                ...formData,
                unit_ids: selectedUnitIds
            });

            navigate('/admin/owner');
        } catch (err) {
            console.error(err);
            alert('Failed to create owner. Check server logs.');
        }
    };

    return (
        <div className="add-owner-container">
            <Sidebar />
            <main className="add-owner-content">
                <div className="breadcrumb">HOME &gt; OWNER &gt; ADD NEW</div>

                <header className="add-owner-header">
                    <h2>Add New Property Owner</h2>
                    <p>Register a new property owner by filling out the details below.</p>
                </header>

                {/* PERSONAL INFO */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>Personal Information</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Representative Name *</label>
                            <input
                                type="text"
                                name="representative_name"
                                className="form-input"
                                value={formData.representative_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Representative Phone *</label>
                            <input
                                type="tel"
                                name="representative_phone"
                                className="form-input"
                                value={formData.representative_phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Representative Email</label>
                            <input
                                type="email"
                                name="representative_email"
                                className="form-input"
                                value={formData.representative_email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* UNITS */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>Property Units</h3>
                        <span className="total-area-badge">
                            Total Owned Area : {totalArea} sqft
                        </span>
                    </div>

                    <div className="unit-selection-box">
                        {units.length === 0 && (
                            <p style={{ color: '#999' }}>No vacant units available</p>
                        )}

                        {units.length > 0 && (
                            <select
                                multiple
                                value={selectedUnitIds}
                                onChange={handleUnitChange}
                                className="form-select"
                                style={{ width: '100%', height: '150px' }} // Adjust styling as needed
                            >
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>
                                        Unit {unit.unit_number} – {unit.super_area} sqft
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* ADDRESS */}
                <div className="form-section">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        className="form-input"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                {/* ACTIONS */}
                <div className="form-actions">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-submit" onClick={handleSave}>Create Owner</button>
                </div>
            </main>
        </div>
    );
};

export default AddOwner;