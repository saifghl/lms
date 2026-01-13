import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RepSidebar from "./RepSidebar";
import { settingsAPI } from "../../services/api";
import "./RepSettings.css";

const RepSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Representative"
  });
  const [loading, setLoading] = useState(false); // Can be true if we fetch on mount
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Assuming settingsAPI.getSettings returns current user profile or app settings
      // If specific user profile endpoint is needed, we might use userAPI.getMe() if available.
      // For now, using settingsAPI as placeholder integration.
      // const res = await settingsAPI.getSettings();
      // setProfile(res.data || {}); 

      // Mock data since getSettings might be app-wide
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "rep@cusec.com",
        phone: "+1 555 123 4567",
        role: "Representative"
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch settings", err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await settingsAPI.updateSettings(profile);
      alert("Settings updated successfully");
    } catch (err) {
      console.error("Failed to update settings", err);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rep-settings-container">
      <RepSidebar />
      <main className="main-content" style={{ marginLeft: 250, width: 'calc(100% - 250px)' }}>
        <header className="page-header">
          <div className="header-left">
            <div className="breadcrumb">
              <Link to="/management/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <span className="active">SETTINGS</span>
            </div>
            <h1>Settings</h1>
            <p>Manage your account settings and preferences.</p>
          </div>
        </header>

        <div className="settings-card">
          {/* Simple Tabs if needed, or just sections */}
          <h3 className="settings-section-title">Profile Information</h3>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled // Usually email is immutable or requires verification
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <h3 className="settings-section-title" style={{ marginTop: '40px' }}>Security</h3>
          <div className="form-group">
            <label>Change Password</label>
            <button className="btn-cancel" style={{ width: 'auto' }}>Update Password</button>
          </div>

          <div className="actions-row">
            <button className="btn-cancel" onClick={() => fetchSettings()}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepSettings;
