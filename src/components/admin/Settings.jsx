import React from 'react';
import Sidebar from './Sidebar';
import './Settings.css';

const Settings = () => {
    return (
        <div className="settings-container">
            <Sidebar />
            <main className="settings-content">
                <header className="settings-header">
                    <h2>Profile Settings</h2>
                    <div className="sub-header">Manage your personal details, security preferences, and account settings.</div>
                </header>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-info-left">
                        <div className="profile-avatar-container">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
                                alt="Alex Johnson"
                                className="profile-avatar"
                            />
                            <div className="edit-avatar-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                        </div>
                        <div className="profile-text">
                            <h3>Alex Johnson</h3>
                            <span className="role">Super Administrator</span>
                            <span className="location">San Francisco, CA</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="btn-remove">Remove</button>
                        <button className="btn-change-photo">Change Photo</button>
                    </div>
                </div>

                {/* Personal Information */}
                <section className="settings-section">
                    <h3>Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-field">
                            <label>First Name</label>
                            <input type="text" defaultValue="Alex" />
                        </div>
                        <div className="form-field">
                            <label>Last Name</label>
                            <input type="text" defaultValue="Johnson" />
                        </div>
                        <div className="form-field">
                            <label>Job Title</label>
                            <input type="text" defaultValue="Senior Property Manager" />
                        </div>
                        <div className="form-field">
                            <label>Phone Number</label>
                            <input type="text" defaultValue="+1 (555) 123-4567" />
                        </div>
                    </div>
                </section>

                <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '40px' }} />

                {/* Security & Password */}
                <section className="settings-section">
                    <h3>Security & Password</h3>

                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label>Email Address</label>
                            <span className="last-changed-badge">Last changed 3 months ago</span>
                        </div>
                        <div className="email-field-container input-with-icon">
                            <input type="email" defaultValue="alex.johnson@leaseadmin.com" className="verified" readOnly />
                            <div className="input-right-icon">
                                <span className="verified-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-field" style={{ marginBottom: '20px' }}>
                        <label>Current Password</label>
                        <input type="password" placeholder="Enter current password" />
                    </div>

                    <div className="form-field">
                        <label>New Password</label>
                        <input type="password" placeholder="Enter new password" />
                    </div>
                </section>

                <footer className="settings-footer">
                    <button className="btn-save">Save Changes</button>
                </footer>
            </main>
        </div>
    );
};

export default Settings;
