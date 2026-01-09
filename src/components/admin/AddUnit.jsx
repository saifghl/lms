import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { addUnit, getProjects } from '../../services/api';
import './AddUnit.css';

const AddUnit = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        unit_number: '',
        floor_number: '',
        project_id: '',
        super_area: '',
        carpet_area: '',
        covered_area: '',
        unit_status: 'vacant',
        unit_plc: 'front_facing',
        projected_rent: '',
        images: '',
        owner_id: null
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                floor_number: parseInt(formData.floor_number) || null,
                project_id: parseInt(formData.project_id) || null,
                super_area: parseFloat(formData.super_area) || 0,
                carpet_area: parseFloat(formData.carpet_area) || 0,
                covered_area: parseFloat(formData.covered_area) || 0,
                projected_rent: parseFloat(formData.projected_rent) || 0,
                owner_id: formData.owner_id ? parseInt(formData.owner_id) : null
            };
            await addUnit(submitData);
            alert("Unit Added Successfully");
            navigate('/admin/units');
        } catch (error) {
            console.error("Error adding unit:", error);
            alert("Failed to add unit");
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </Link>
                        </div>

                        <form className="unit-form" onSubmit={handleSubmit}>
                            {/* Section 1: Location & Identification */}
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input 
                                            type="number" 
                                            name="floor_number"
                                            value={formData.floor_number}
                                            onChange={handleChange}
                                            placeholder="e.g., 5" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Project</label>
                                        <select 
                                            name="project_id"
                                            value={formData.project_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map(project => (
                                                <option key={project.id} value={project.id}>{project.project_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Specifications & Dimensions */}
                            <section className="form-section">
                                <h3>Specifications & Dimensions</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Super Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="super_area"
                                            value={formData.super_area}
                                            onChange={handleChange}
                                            placeholder="0" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Carpet Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="carpet_area"
                                            value={formData.carpet_area}
                                            onChange={handleChange}
                                            placeholder="0" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Covered Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="covered_area"
                                            value={formData.covered_area}
                                            onChange={handleChange}
                                            placeholder="0" 
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select 
                                                name="unit_status"
                                                value={formData.unit_status}
                                                onChange={handleChange}
                                            >
                                                <option value="vacant">Vacant</option>
                                                <option value="fully_fitted">Fully fitted</option>
                                                <option value="warm_shell">Warm Shell</option>
                                                <option value="bare_shell">Bare Shell</option>
                                                <option value="leased">Leased</option>
                                                <option value="fitout">Fitout</option>
                                            </select>
                                            <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Status & Media */}
                            <section className="form-section">
                                <h3>Status & Media</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit PLC</label>
                                        <div className="select-wrapper">
                                            <select 
                                                name="unit_plc"
                                                value={formData.unit_plc}
                                                onChange={handleChange}
                                            >
                                                <option value="front_facing">Front facing</option>
                                                <option value="corner">Corner unit</option>
                                                <option value="plaza_view">Plaza view</option>
                                            </select>
                                            <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Projected Rent (₹/month)</label>
                                        <div className="input-with-suffix">
                                            <input 
                                                type="number" 
                                                name="projected_rent"
                                                value={formData.projected_rent}
                                                onChange={handleChange}
                                                placeholder="0.00" 
                                            />
                                            <span className="suffix">INR</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Unit Images (URLs - comma separated)</label>
                                    <input 
                                        type="text" 
                                        name="images"
                                        value={formData.images}
                                        onChange={handleChange}
                                        placeholder="Enter image URLs separated by commas" 
                                    />
                                </div>
                            </section>

                            <div className="form-footer">
                                <button type="button" className="cancel-btn" onClick={() => navigate('/admin/units')}>cancel</button>
                                <button type="submit" className="create-btn">Create Unit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddUnit;
