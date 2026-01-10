import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './CreateUser.css';
import { roleAPI } from '../../services/api';

const CreateUser = () => {

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role_id: '',
        status: 'active'
    });

    /* ================= LOAD ROLES ================= */
    useEffect(() => {
        roleAPI.getAll()
            .then(res => setRoles(res.data))
            .catch(err => console.error(err));
    }, []);

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.role_id) {
            alert("Please fill all required fields");
            return;
        }

        // split full name
        const nameParts = formData.fullName.trim().split(" ");
        const first_name = nameParts.shift();
        const last_name = nameParts.join(" ") || "";

        try {
            await roleAPI.create({
                first_name,
                last_name,
                email: formData.email,
                phone: formData.phone,
                role_id: formData.role_id,
                status: formData.status,
                password_hash: "TEMP_PASSWORD" // ⚠️ explained below
            });

            alert("User created successfully");
            navigate("/admin/role-management");

        } catch (err) {
            console.error(err);
            alert("User creation failed");
        }
    };

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
                                ✕
                            </Link>
                        </div>

                        <form className="user-form" onSubmit={handleSubmit}>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role</label>
                                    <div className="select-wrapper">
                                        <select
                                            name="role_id"
                                            value={formData.role_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-footer">
                                <Link to="/admin/role-management" className="cancel-btn">
                                    Cancel
                                </Link>
                                <button type="submit" className="create-btn">
                                    Create User
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateUser;
