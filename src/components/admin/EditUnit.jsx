import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EditUnit.css';
import { unitAPI, getProjectById, filterAPI } from '../../services/api';

const EditUnit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        unit_number: '',
        status: '',
        chargeable_area: '',
        projected_rent: '', // Changed from monthly_rent to match DB
        floor_number: '',
        block_tower: '', // Added
        unit_condition: '',
        plc: '',
        carpet_area: '',
        unit_category: '',
        unit_zoning_type: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [project, setProject] = useState(null);
    const [rentPerSqft, setRentPerSqft] = useState('');
    const [unitConditions, setUnitConditions] = useState([
        { value: 'fully_fitted', label: 'Fully Fitted' },
        { value: 'semi_fitted', label: 'Semi Fitted' },
        { value: 'bare_shell', label: 'Bare Shell' }
    ]);
    const [plcs, setPlcs] = useState([
        { value: 'front_facing', label: 'Front Facing' },
        { value: 'corner', label: 'Corner' },
        { value: 'park_facing', label: 'Park Facing' },
        { value: 'road_facing', label: 'Road Facing' }
    ]);
    const [unitCategories, setUnitCategories] = useState([]);
    const [unitZoningTypes, setUnitZoningTypes] = useState([]);

    useEffect(() => {
        const fetchUnitAndProject = async () => {
            try {
                const res = await unitAPI.getUnitById(id);
                const data = res.data;
                setFormData({
                    unit_number: data.unit_number || '',
                    status: data.status || 'vacant',
                    chargeable_area: data.chargeable_area || '',
                    projected_rent: data.projected_rent || '',
                    floor_number: data.floor_number || '',
                    block_tower: data.block_tower || '', // Added
                    unit_condition: data.unit_condition || 'bare_shell',
                    plc: data.plc || 'front_facing',
                    carpet_area: data.carpet_area || '',
                    covered_area: data.covered_area || '', // Ensure covered_area is also fetched
                    unit_category: data.unit_category || '',
                    unit_zoning_type: data.unit_zoning_type || '',
                    project_id: data.project_id
                });

                // Calculate initial rent per sqft if rent exists
                if (data.projected_rent > 0 && data.chargeable_area > 0) { // Default to super area for initial display if needed, or just let it recalculate
                    // Actually better to not reverse calculate to avoid rounding errors, just let user enter new rate if they want to change
                }

                if (data.project_id) {
                    const projRes = await getProjectById(data.project_id);
                    setProject(projRes.data.data || projRes.data);
                }
            } catch (err) {
                console.error("Error fetching unit:", err);
                setError("Failed to load unit details");
            }
        };
        const fetchFilters = async () => {
            try {
                const ucRes = await filterAPI.getFilterOptions("unit_condition");
                if (ucRes.data.data.length > 0) {
                    setUnitConditions(ucRes.data.data.map(t => ({ value: t.option_value, label: t.option_value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })));
                }
                const plcRes = await filterAPI.getFilterOptions("plc");
                if (plcRes.data.data.length > 0) {
                    setPlcs(plcRes.data.data.map(t => ({ value: t.option_value, label: t.option_value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })));
                }
                const catRes = await filterAPI.getFilterOptions("unit_category");
                if (catRes.data?.data?.length > 0) {
                    setUnitCategories(catRes.data.data.map(t => ({ value: t.option_value, label: t.option_value })));
                }
                const zoneRes = await filterAPI.getFilterOptions("unit_zoning_type");
                if (zoneRes.data?.data?.length > 0) {
                    setUnitZoningTypes(zoneRes.data.data.map(t => ({ value: t.option_value, label: t.option_value })));
                }
            } catch (error) {
                console.error("Error fetching filters", error);
            }
        };
        fetchUnitAndProject();
        fetchFilters();
    }, [id]);

    useEffect(() => {
        if (!project || !rentPerSqft) return;

        const calcType = project.calculation_type || 'Chargeable Area';
        let area = 0;

        if (calcType === 'Covered Area') {
            area = parseFloat(formData.covered_area) || 0;
        } else if (calcType === 'Carpet Area') {
            area = parseFloat(formData.carpet_area) || 0;
        } else {
            area = parseFloat(formData.chargeable_area) || 0;
        }

        const rate = parseFloat(rentPerSqft);
        const total = area * rate;

        if (rate > 0) {
            setFormData(prev => ({
                ...prev,
                projected_rent: total > 0 ? total.toString() : ''
            }));
        }
    }, [formData.chargeable_area, formData.covered_area, formData.carpet_area, rentPerSqft, project]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await unitAPI.updateUnit(id, formData);

            setMessage("✅ Unit updated successfully");

            setTimeout(() => {
                navigate("/admin/units");
            }, 1500);

        } catch (err) {
            console.error(err);
            setError("❌ Failed to update unit");
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="edit-unit-container">
                    <div className="unit-form-card">

                        {/* Header */}
                        <div className="edit-header">
                            <div className="header-content">
                                <div className="breadcrumb">
                                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt;{' '}
                                    <Link to="/admin/units" style={{ textDecoration: 'none', color: 'inherit' }}>UNITS</Link> &gt;{' '}
                                    <span className="active">UNIT {formData.unit_number}</span>
                                </div>
                                <div className="title-row">
                                    <h2>Edit Unit: {formData.unit_number}</h2>
                                </div>
                                <p className="subtitle">
                                    Update current lease details, status, pricing, and amenities for this unit.
                                </p>
                            </div>
                        </div>

                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}

                        <form className="unit-form" onSubmit={handleUpdate}>

                            {/* Unit Identification */}
                            <section className="form-section">
                                <h3>Unit Identification</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input
                                            type="text"
                                            name="unit_number"
                                            value={formData.unit_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="vacant">Vacant</option>
                                                <option value="occupied">Occupied</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="under_maintenance">Under Maintenance</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Block / Tower</label>
                                        <input
                                            type="text"
                                            name="block_tower"
                                            value={formData.block_tower}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input
                                            type="text"
                                            name="floor_number"
                                            value={formData.floor_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Chargeable Area (sq ft)</label>
                                    <input
                                        type="text"
                                        name="chargeable_area"
                                        value={formData.chargeable_area}
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>

                            {/* Lease details section if needed, or just rent */}
                            <section className="form-section">
                                <h3>Rent & Details</h3>
                                <div className="form-row">
                                    <label>Projected Rent (₹)</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div className="input-with-suffix" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <input
                                                type="number"
                                                value={rentPerSqft}
                                                onChange={(e) => setRentPerSqft(e.target.value)}
                                                placeholder="Proj. Rent/sqft"
                                                style={{ width: '100px' }}
                                            />
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                x {project?.calculation_type || 'Chargeable Area'}
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="projected_rent"
                                            value={formData.projected_rent}
                                            readOnly
                                            style={{ backgroundColor: '#f9fafb' }}
                                            placeholder="Total Rent"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Covered Area (sq ft)</label>
                                    <input
                                        type="text"
                                        name="covered_area"
                                        value={formData.covered_area || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Carpet Area (sq ft)</label>
                                    <input
                                        type="text"
                                        name="carpet_area"
                                        value={formData.carpet_area || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="form-group">
                                        <label>Unit Condition</label>
                                        <select name="unit_condition" value={formData.unit_condition} onChange={handleChange}>
                                            {unitConditions.map(uc => (
                                                <option key={uc.value} value={uc.value}>{uc.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Category</label>
                                        <select name="unit_category" value={formData.unit_category} onChange={handleChange}>
                                            <option value="">Select Category</option>
                                            {unitCategories.map(uc => (
                                                <option key={uc.value} value={uc.value}>{uc.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Zoning Type</label>
                                        <select name="unit_zoning_type" value={formData.unit_zoning_type} onChange={handleChange}>
                                            <option value="">Select Zoning</option>
                                            {unitZoningTypes.map(uc => (
                                                <option key={uc.value} value={uc.value}>{uc.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-group">
                                        <label>Premium on Lease</label>
                                        <select name="plc" value={formData.plc} onChange={handleChange}>
                                            <option value="">Select Premium On Lease (Optional)</option>
                                            {plcs.map(plc => (
                                                <option key={plc.value} value={plc.value}>{plc.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="form-footer">
                                <Link to="/admin/units" className="cancel-btn">Cancel</Link>
                                <button type="submit" className="update-btn">
                                    Update Unit
                                </button>
                            </div>

                        </form>
                    </div >
                </div >
            </main >
        </div >
    );
};

export default EditUnit;
