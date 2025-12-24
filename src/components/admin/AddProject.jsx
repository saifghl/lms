import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddProject.css';

const AddProject = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="add-project-container">
                    <div className="project-form-card">
                        <div className="form-header">
                            <div className="header-titles">
                                <h2>Add / Edit New Project</h2>
                                <p>Enter the details for the new lease project.</p>
                            </div>
                            {/* TODO: Backend - Ensure this close button redirects correctly or handles unsaved changes check */}
                            <Link to="/admin/projects" className="close-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </Link>
                        </div>

                        {/* TODO: Backend - Wrap inputs in a <form> and add onSubmit handler to POST data to /api/projects */}
                        <form className="project-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Name</label>
                                    <input type="text" placeholder="e.g., Downtown Plaza Phase 1" />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input type="text" placeholder="City, Region" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea placeholder="Street address, P.O. Box..." rows="3"></textarea>
                                </div>
                                <div className="form-group status-group">
                                    <label>Status</label>
                                    <div className="status-toggle">
                                        <button type="button" className="toggle-btn active">
                                            <span className="dot"></span> Active
                                        </button>
                                        <button type="button" className="toggle-btn">
                                            <span className="dot empty"></span> Inactive
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row three-cols">
                                <div className="form-group">
                                    <label>Project Type</label>
                                    <div className="select-wrapper">
                                        <select defaultValue="">
                                            <option value="" disabled>Select Type</option>
                                            <option value="residential">Residential</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="mixed">Mixed Use</option>
                                        </select>
                                        <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Total Floors</label>
                                    <div className="select-wrapper">
                                        <select defaultValue="">
                                            <option value="" disabled>Total Floors</option>
                                            <option value="1">1</option>
                                            <option value="5">5</option>
                                            <option value="10">10+</option>
                                        </select>
                                        <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Total Project Area</label>
                                    <div className="input-with-icon">
                                        <input type="text" placeholder="0 sqft" />
                                        <svg className="lock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </div>
                                    <span className="help-text">(Automatically calculated from total area of all units under this project)</span>
                                </div>
                            </div>

                            <div className="upload-section">
                                <div className="upload-box">
                                    <div className="upload-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <span className="upload-text">Upload Image</span>
                                </div>
                            </div>

                            <div className="form-footer">
                                <button type="button" className="details-btn">Field Details</button>
                                <button type="submit" className="create-btn">+ Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddProject;
