import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { unitAPI, getProjects } from '../../services/api';
import './AddUnit.css';

const AddUnit = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        project_id: '',
        unit_number: '',
        floor_number: '',
        super_area: '',
        carpet_area: '',
        covered_area: '',
        unit_condition: 'fully_fitted',
        plc: 'front_facing',
        projected_rent: ''
    });

    const [images, setImages] = useState([]);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res.data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        if (!formData.project_id) {
            setSubmitMessage("Please select a project.");
            setIsSubmitting(false);
            return;
        }

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            images.forEach(img => {
                data.append("images", img);
            });

            await unitAPI.createUnit(data);

            setSubmitMessage('Unit created successfully!');
            setTimeout(() => navigate('/admin/units'), 2000);

        } catch (error) {
            console.error("Create unit failed:", error);
            setSubmitMessage('Failed to create unit. ' + (error.response?.data?.message || 'Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="add-unit-container">
                    <div className="unit-form-card">
                        <div className="form-header">
                            <div className="header-titles">
                                <h2>Add New Units</h2>
                                <p>Fill in the details below to register a new property unit.</p>
                            </div>
                            <Link to="/admin/units" className="close-btn">✕</Link>
                        </div>

                        <form className="unit-form" onSubmit={handleSubmit}>
                            {/* Section 1 */}
                            <section className="form-section">
                                <h3>Location & Identification</h3>
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Project / Building</label>
                                        <div className="select-wrapper">
                                            <select name="project_id" value={formData.project_id} onChange={handleChange} required>
                                                <option value="">Select Project</option>
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.project_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input
                                            type="text"
                                            name="unit_number"
                                            value={formData.unit_number}
                                            onChange={handleChange}
                                            placeholder="e.g., 101"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input
                                            type="text"
                                            name="floor_number"
                                            value={formData.floor_number}
                                            onChange={handleChange}
                                            placeholder="e.g., 5"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section className="form-section">
                                <h3>Specifications & Dimensions</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Super Area (sq ft)</label>
                                        <input type="text" name="super_area" value={formData.super_area} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Carpet Area (sq ft)</label>
                                        <input type="text" name="carpet_area" value={formData.carpet_area} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Covered Area (sq ft)</label>
                                        <input type="text" name="covered_area" value={formData.covered_area} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Unit Condition</label>
                                        <div className="select-wrapper">
                                            <select name="unit_condition" value={formData.unit_condition} onChange={handleChange}>
                                                <option value="fully_fitted">Fully Fitted</option>
                                                <option value="semi_fitted">Semi Fitted</option>
                                                <option value="bare_shell">Bare Shell</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 - Status & Media */}
                            <section className="form-section">
                                <h3>Commercials</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>PLC</label>
                                        <div className="select-wrapper">
                                            <select name="plc" value={formData.plc} onChange={handleChange}>
                                                <option value="front_facing">Front Facing</option>
                                                <option value="corner">Corner</option>
                                                <option value="park_facing">Park Facing</option>
                                                <option value="road_facing">Road Facing</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Projected Rent (₹/month)</label>
                                        <div className="input-with-suffix">
                                            <input type="text" name="projected_rent" value={formData.projected_rent} onChange={handleChange} />
                                            <span className="suffix">INR</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Unit Images</label>
                                    <div className="upload-box dashed" onClick={handleUploadClick}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="upload-content">
                                            <span>Upload a file or drag and drop</span>
                                            <span className="upload-hint">PNG, JPG up to 10MB</span>
                                        </div>
                                    </div>
                                    {images.length > 0 && <div style={{ marginTop: 5 }}>{images.length} files selected</div>}
                                </div>
                            </section>

                            {submitMessage && (
                                <div className="submit-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: submitMessage.includes('successfully') ? '#d4edda' : '#f8d7da', color: submitMessage.includes('successfully') ? '#155724' : '#721c24', borderRadius: '4px' }}>
                                    {submitMessage}
                                </div>
                            )}

                            <div className="form-footer">
                                <Link to="/admin/units" className="cancel-btn">Cancel</Link>
                                <button type="submit" className="create-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Unit'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddUnit;