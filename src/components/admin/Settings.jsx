import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './Settings.css';
import { settingsAPI } from '../../services/api';

const Settings = () => {

    // TEMP → later replace with JWT user id
    const userId = 3;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    /* ============================
       LOAD USER FROM DB
    ============================ */
    useEffect(() => {
        // Changed to use getSettings()
        settingsAPI.getSettings()
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Load user error:", err);
                // Fallback mock data if API fails (for demo)
                setUser({
                    first_name: "Admin",
                    last_name: "User",
                    email: "admin@example.com",
                    role: "Super Admin",
                    profile_image: null
                });
                setLoading(false);
            });
    }, [userId]);

    /* ============================
       HANDLE INPUT CHANGE
    ============================ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* ============================
       SAVE PROFILE
    ============================ */
    const handleSave = () => {
        settingsAPI.updateSettings(user)
            .then(() => alert("Profile updated successfully"))
            .catch(() => alert("Update failed"));
    };

    /* ============================
       PHOTO UPLOAD
    ============================ */
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        settingsAPI.uploadPhoto(userId, formData)
            .then(res => {
                setUser(prev => ({
                    ...prev,
                    profile_image: res.data.image
                }));
            })
            .catch(() => alert("Photo upload failed"));
    };

    /* ============================
       REMOVE PHOTO (FIXED)
    ============================ */
    const handleRemovePhoto = () => {
        settingsAPI.removePhoto(userId)
            .then(() => {
                setUser(prev => ({
                    ...prev,
                    profile_image: null
                }));
            })
            .catch(() => alert("Failed to remove photo"));
    };

    /* ============================
       UPDATE PASSWORD
    ============================ */
    const handlePasswordUpdate = () => {
        if (!currentPassword || !newPassword) {
            alert("Fill both password fields");
            return;
        }

        settingsAPI.updatePassword(userId, {
            currentPassword,
            newPassword
        })
            .then(() => {
                alert("Password updated successfully");
                setCurrentPassword("");
                setNewPassword("");
            })
            .catch(() => alert("Password update failed"));
    };

    if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
    if (!user) return <div style={{ padding: 30 }}>User not found</div>;

    // ✅ Correct image path
    const profileImage = user.profile_image
        ? `http://localhost:5000${user.profile_image}`
        : "https://via.placeholder.com/150";

    return (
        <div className="settings-container">
            <Sidebar />

            <main className="settings-content">
                <header className="settings-header">
                    <h2>Profile Settings</h2>
                    <div className="sub-header">
                        Manage your personal details, security preferences, and account settings.
                    </div>
                </header>

                {/* ================= PROFILE CARD ================= */}
                <div className="profile-card">
                    <div className="profile-info-left">
                        <div className="profile-avatar-container">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="profile-avatar"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="photoUpload"
                                onChange={handlePhotoChange}
                            />

                            {/* Pencil icon */}
                            <label
                                htmlFor="photoUpload"
                                className="edit-avatar-icon"
                                style={{ zIndex: 1 }}
                            >
                                ✎
                            </label>
                        </div>

                        <div className="profile-text">
                            <h3>{user.first_name} {user.last_name}</h3>
                            <span className="role">{user.role || "Administrator"}</span>
                            <span className="location">{user.location || "—"}</span>
                        </div>
                    </div>

                    {/* ✅ FIXED BUTTONS */}
                    <div className="profile-actions" style={{ zIndex: 5 }}>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={handleRemovePhoto}
                        >
                            Remove
                        </button>

                        <button
                            type="button"
                            className="btn-change-photo"
                            onClick={() => document.getElementById("photoUpload").click()}
                        >
                            Change Photo
                        </button>
                    </div>
                </div>

                {/* ================= PERSONAL INFO ================= */}
                <section className="settings-section">
                    <h3>Personal Information</h3>

                    <div className="form-grid">
                        <div className="form-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={user.first_name || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={user.last_name || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="job_title"
                                value={user.job_title || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={user.phone || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button className="btn-save" onClick={handleSave}>
                        Save Changes
                    </button>
                </section>

                <hr />

                {/* ================= SECURITY ================= */}
                <section className="settings-section">
                    <h3>Security & Password</h3>

                    <div className="form-field">
                        <label>Email Address</label>
                        <input type="email" value={user.email || ""} readOnly />
                    </div>

                    <div className="form-field">
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button className="btn-save" onClick={handlePasswordUpdate}>
                        Update Password
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Settings;
