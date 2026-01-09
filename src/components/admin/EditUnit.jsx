import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getUnitById, updateUnit, getProjects } from '../../services/api';
import './EditUnit.css';

const EditUnit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
        owner_id: null,
        current_tenant_id: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [unitResponse, projectsResponse] = await Promise.all([
                    getUnitById(id),
                    getProjects()
                ]);
                const unit = unitResponse.data;
                setFormData({
                    unit_number: unit.unit_number || '',
                    floor_number: unit.floor_number || '',
                    project_id: unit.project_id || '',
                    super_area: unit.super_area || '',
                    carpet_area: unit.carpet_area || '',
                    covered_area: unit.covered_area || '',
                    unit_status: unit.unit_status || 'vacant',
                    unit_plc: unit.unit_plc || 'front_facing',
                    projected_rent: unit.projected_rent || '',
                    images: unit.images || '',
                    owner_id: unit.owner_id || null,
                    current_tenant_id: unit.current_tenant_id || null
                });
                setProjects(projectsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...formData,
                floor_number: parseInt(formData.floor_number) || null,
                project_id: parseInt(formData.project_id) || null,
                super_area: parseFloat(formData.super_area) || 0,
                carpet_area: parseFloat(formData.carpet_area) || 0,
                covered_area: parseFloat(formData.covered_area) || 0,
                projected_rent: parseFloat(formData.projected_rent) || 0,
                owner_id: formData.owner_id ? parseInt(formData.owner_id) : null,
                current_tenant_id: formData.current_tenant_id ? parseInt(formData.current_tenant_id) : null
            };
            await updateUnit(id, updateData);
            alert("Unit Updated Successfully");
            navigate('/admin/units');
        } catch (error) {
            console.error("Error updating unit:", error);
            alert("Failed to update unit");
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <div>Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="edit-unit-container">
                    <div className="unit-form-card">
                        <div className="edit-header">
                            <div className="header-content">
                                <div className="breadcrumb">
                                    <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/units" style={{ textDecoration: 'none', color: 'inherit' }}>UNITS</Link> &gt; <span className="active">UNIT {formData.unit_number}</span>
                                </div>
                                <div className="title-row">
                                    <h2>Edit Unit: {formData.unit_number}</h2>
                                </div>
                                <p className="subtitle">Update current lease details, status, pricing, and amenities for this unit.</p>
                            </div>
                        </div>

                        <form className="unit-form" onSubmit={handleUpdate}>
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Project</label>
                                        <select 
                                            name="project_id"
                                            value={formData.project_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map(project => (
                                                <option key={project.id} value={project.id}>{project.project_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input 
                                            type="number" 
                                            name="floor_number"
                                            value={formData.floor_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h3>Dimensions</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Super Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="super_area"
                                            value={formData.super_area}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Carpet Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="carpet_area"
                                            value={formData.carpet_area}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Covered Area (sq ft)</label>
                                        <input 
                                            type="number" 
                                            name="covered_area"
                                            value={formData.covered_area}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h3>Status & Pricing</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Status</label>
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
                                    </div>
                                    <div className="form-group">
                                        <label>Unit PLC</label>
                                        <select 
                                            name="unit_plc"
                                            value={formData.unit_plc}
                                            onChange={handleChange}
                                        >
                                            <option value="front_facing">Front facing</option>
                                            <option value="corner">Corner unit</option>
                                            <option value="plaza_view">Plaza view</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Projected Rent (₹/month)</label>
                                        <input 
                                            type="number" 
                                            name="projected_rent"
                                            value={formData.projected_rent}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="form-footer">
                                <Link to="/admin/units" className="cancel-btn">Cancel</Link>
                                <button type="submit" className="update-btn">Update Unit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditUnit;

