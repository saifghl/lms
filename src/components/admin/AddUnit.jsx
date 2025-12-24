import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddUnit.css';

const AddUnit = () => {
    const navigate = useNavigate();

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

                        {/* TODO: Backend - Add onSubmit handler to form element */}
                        <form className="unit-form" onSubmit={(e) => {
                            e.preventDefault();
                            // TODO: Backend - Collect form data and POST to /api/units
                            console.log("Submitting new unit...");
                            navigate('/admin/units');
                        }}>

                            {/* Section 1: Location & Identification */}
                            <section className="form-section">
                                <h3>Location & Identification</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit Number</label>
                                        <input type="text" placeholder="e.g., 1st floor-unit 101" />
                                    </div>
                                    <div className="form-group">
                                        <label>Floor Number</label>
                                        <input type="text" placeholder="e.g., 5" />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Specifications & Dimensions */}
                            <section className="form-section">
                                <h3>Specifications & Dimensions</h3>
                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label>Super Area (sq ft)</label>
                                        <input type="text" placeholder="0" />
                                    </div>
                                    <div className="form-group">
                                        <label>Carpet Area (sq ft)</label>
                                        <input type="text" placeholder="0" />
                                    </div>
                                    <div className="form-group">
                                        <label>Covered Area (sq ft)</label>
                                        <input type="text" placeholder="0" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Unit Status</label>
                                        <div className="select-wrapper">
                                            <select defaultValue="fully_fitted">
                                                <option value="fully_fitted">Fully fitted</option>
                                                <option value="warm_shell">Warm Shell</option>
                                                <option value="bare_shell">Bare Shell</option>
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
                                            <select defaultValue="front_facing">
                                                <option value="front_facing">Front facing</option>
                                                <option value="corner">Corner unit</option>
                                                <option value="plaza_view">Plaza view</option>
                                            </select>
                                            <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Projected Rent ($/month)</label>
                                        <div className="input-with-suffix">
                                            <input type="text" placeholder="$0.00 USD" />
                                            <span className="suffix">USD</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Unit Images</label>
                                    <div className="upload-box dashed">
                                        <div className="upload-content">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                            <span>Upload a file or drag and drop</span>
                                            <span className="upload-hint">Recommended: PNG, JPG, GIF up to 10MB</span>
                                        </div>
                                    </div>
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
