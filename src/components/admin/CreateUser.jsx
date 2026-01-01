import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './CreateUser.css';

const CreateUser = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <div className="create-user-container">
                    <div className="user-form-card">
                        <div className="form-header">
                            <div className="header-titles">
                                <h2>Create New User</h2>
                                <p>Add a new user to the system and assign their role.</p>
                            </div>
                            <Link to="/admin/role-management" className="close-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </Link>
                        </div>

                        <form className="user-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="e.g. John Doe" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john.doe@example.com" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <div className="select-wrapper">
                                        <select defaultValue="">
                                            <option value="" disabled>Select Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="property_manager">Property Manager</option>
                                            <option value="leasing_agent">Leasing Agent</option>
                                            <option value="financial_analyst">Financial Analyst</option>
                                            <option value="maintenance_staff">Maintenance Staff</option>
                                        </select>
                                        <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <div className="select-wrapper">
                                        <select defaultValue="active">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                        <svg className="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="form-footer">
                                <Link to="/admin/role-management" className="cancel-btn">Cancel</Link>
                                <button type="submit" className="create-btn">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateUser;
