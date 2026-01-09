import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddUnit.css';

const AddUnit = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Ref for the file input

    const [formData, setFormData] = useState({
        project_id: 1,
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
    const [submitMessage, setSubmitMessage] = useState(''); // New state for success/failure message
    const [isSubmitting, setIsSubmitting] = useState(false); // Optional: To disable button during submit

    /* ------------------ HANDLERS ------------------ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(''); // Clear any previous message

        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            images.forEach(img => {
                data.append("images", img);
            });

            const response = await fetch("http://localhost:5000/api/units", {
                method: "POST",
                body: data
            });

            if (response.ok) {
                setSubmitMessage('Unit created successfully!');
                setTimeout(() => navigate('/admin/units'), 2000); // Redirect after 2 seconds
            } else {
                throw new Error('Failed to create unit');
            }

        } catch (error) {
            console.error("Create unit failed:", error);
            setSubmitMessage('Failed to create unit. Please try again.');
            setTimeout(() => setSubmitMessage(''), 3000); // Clear message after 3 seconds
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
                                <p>Fill in the details below to register a new property unit into the system.</p>
                            </div>
                            <Link to="/admin/units" className="close-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </Link>
                        </div>

                        <form className="unit-form" onSubmit={handleSubmit}>

                            {/* Section 1 */}
                            <section className="form-section">
                                <h3>Location & Identification</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input
                                            type="text"
                                            name="unit_number"
                                            value={formData.unit_number}
                                            onChange={handleChange}
                                            placeholder="e.g., 1st floor-unit 101"
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
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select name="unit_condition" value={formData.unit_condition} onChange={handleChange}>
                                                <option value="fully_fitted">Fully fitted</option>
                                                <option value="warm_shell">Warm Shell</option>
                                                <option value="bare_shell">Bare Shell</option>
                                            </select>
                                            <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 - Status & Media */}
                            <section className="form-section">
                                <h3>Status & Media</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit PLC</label>
                                        <div className="select-wrapper">
                                            <select name="plc" value={formData.plc} onChange={handleChange}>
                                                <option value="front_facing">Front facing</option>
                                                <option value="corner">Corner unit</option>
                                                <option value="plaza_view">Plaza view</option>
                                            </select>
                                            <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
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
                                            style={{ display: 'none' }} // Changed from opacity: 0 and position absolute for better accessibility
                                        />
                                        <div className="upload-content">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                            <span>Upload a file or drag and drop</span>
                                            <span className="upload-hint">PNG, JPG up to 10MB</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Display submit message */}
                            {submitMessage && (
                                <div className="submit-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: submitMessage.includes('successfully') ? '#d4edda' : '#f8d7da', color: submitMessage.includes('successfully') ? '#155724' : '#721c24', borderRadius: '4px' }}>
                                    {submitMessage}
                                </div>
                            )}

                            <div className="form-footer">
                                <button type="button" className="cancel-btn" onClick={() => navigate('/admin/units')} disabled={isSubmitting}>cancel</button>
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