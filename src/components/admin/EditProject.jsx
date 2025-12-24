import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EditProject.css';

const EditProject = () => {
    // In a real app, use projectId to fetch data
    // const { projectId } = useParams();
    // TODO: Backend - Fetch project details by ID when component mounts
    // useEffect(() => { fetch(`/api/projects/${projectId}`).then(...) }, [projectId]);

    const navigate = useNavigate();

    // TODO: Backend - Implement updateProject function to PUT changes to API
    const handleUpdate = () => {
        // api.put(`/projects/${projectId}`, formData)...
        navigate('/admin/projects');
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="edit-project-container">
                    {/* Header */}
                    <header className="edit-header">
                        <div className="header-left">
                            <div className="breadcrumb">
                                <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <Link to="/admin/projects" style={{ textDecoration: 'none', color: 'inherit' }}>PROJECTS</Link> &gt; <span className="active">EDIT PROJECT</span>
                            </div>
                            <div className="title-row">
                                <h1>Skyline Tower Renovation</h1>
                                <span className="status-badge active">Active</span>
                            </div>
                            <p className="subtitle">Update critical project details, financials, and lease terms. Ensure all data matches the master agreement.</p>
                        </div>
                        <div className="header-right">
                            <div className="last-edited">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>Last edited by Sarah J. on Oct 24</span>
                            </div>
                        </div>
                    </header>

                    <div className="edit-grid">

                        {/* Column 1: General Info & Completion Date */}
                        <div className="edit-col-main">
                            <section className="edit-card">
                                <h3>General Information</h3>
                                <div className="form-group vertical">
                                    <label>Project Name</label>
                                    <input type="text" defaultValue="Skyline Tower Renovation" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group vertical">
                                        <label>Project Code</label>
                                        <input type="text" defaultValue="PRJ-2023-004" />
                                    </div>
                                    <div className="form-group vertical">
                                        <label>Developer Name</label>
                                        <input type="text" defaultValue="Acme Corp" />
                                    </div>
                                </div>
                                <div className="form-group vertical">
                                    <label>Description</label>
                                    <textarea rows="4" defaultValue="Comprehensive renovation of the Skyline Tower lobby and common areas, including HVAC upgrades and new security systems."></textarea>
                                </div>
                            </section>

                            <section className="edit-card">
                                <h3>Project Completion Date</h3>
                                <div className="form-row">
                                    <div className="form-group vertical">
                                        <label>Start Date</label>
                                        <div className="input-with-icon">
                                            <input type="date" defaultValue="2024-01-01" />
                                        </div>
                                    </div>
                                    <div className="form-group vertical">
                                        <label>End Date</label>
                                        <div className="input-with-icon">
                                            <input type="date" defaultValue="2025-12-31" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group vertical">
                                    <label>Lease Rental Rang</label>
                                    <input type="text" defaultValue="₹ 30 / sqft - ₹ 60 / sqft" className="bg-input" />
                                </div>
                            </section>

                            <div className="save-status">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>All changes saved locally</span>
                            </div>
                        </div>

                        {/* Column 2: Rent Projection & Settings */}
                        <div className="edit-col-side">
                            <section className="edit-card rent-card">
                                <h3>Rent Projection</h3>
                                <div className="form-group vertical">
                                    <label>Rent per month/year</label>
                                    <input type="text" defaultValue="₹ 1,200,000" />
                                </div>
                                <div className="form-group vertical">
                                    <label>Average Monthly Rent</label>
                                    <input type="text" defaultValue="₹ 45,000" />
                                </div>
                                <div className="form-group vertical">
                                    <label>Security Deposit</label>
                                    <input type="text" defaultValue="₹ 90,000" />
                                </div>
                            </section>

                            <section className="edit-card">
                                <h3>Settings</h3>
                                <div className="toggle-row">
                                    <span>Public Visibility</span>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </section>
                        </div>

                    </div>

                    <div className="edit-footer">
                        <Link to="/admin/projects" className="cancel-btn">Cancel</Link>
                        <button className="update-btn" onClick={handleUpdate}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            Update Project
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default EditProject;
