import React from 'react';
import RepSidebar from './RepSidebar';
import './RepSettings.css';

const RepSettings = () => {
    return (
        <div className="rep-settings-container">
            <RepSidebar />
            <main className="rep-settings-content">
                <div className="settings-page-header">
                    <h2>Settings</h2>
                    <p>Manage your account settings and preferences.</p>
                </div>

                <div className="settings-card">
                    <h3>Profile Information</h3>
                    <div className="profile-form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" defaultValue="Arjun" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" defaultValue="Kapoor" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" defaultValue="arjun.kapoor@cusec.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" defaultValue="+91 98765 43210" />
                        </div>
                        <div className="form-group full-width">
                            <label>Role</label>
                            <input type="text" defaultValue="Management Representative" disabled style={{ background: '#f0f0f0', cursor: 'not-allowed' }} />
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>Security</h3>
                    <div className="password-grid">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" placeholder="Enter current password" />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" placeholder="Enter new password" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" placeholder="Confirm new password" />
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <h3>Notifications</h3>
                    <div className="notification-toggles">
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <h4>Email Notifications</h4>
                                <p>Receive email updates on lease expiries and escalations.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <h4>SMS Alerts</h4>
                                <p>Get urgent alerts via SMS for critical tasks.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="toggle-item">
                            <div className="toggle-info">
                                <h4>System Popups</h4>
                                <p>Show in-app popup notifications.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-actions">
                    <button className="btn-cancel">Cancel</button>
                    <button className="btn-save">Save Changes</button>
                </div>

            </main>
        </div>
    );
};

export default RepSettings;
