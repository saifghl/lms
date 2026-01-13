import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ownerAPI } from '../../services/api';
import './AddOwner.css';

const AddOwner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternative_contact: '',
    representative_name: '',
    representative_phone: '',
    representative_email: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => navigate('/admin/owner');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ownerAPI.createOwner(formData);
      alert("Owner added successfully!");
      navigate("/admin/owner");
    } catch (err) {
      console.error(err);
      alert("Failed to add owner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-owner-container">
      <Sidebar />
      <main className="add-owner-content">
        <div className="breadcrumb">
          <Link to="/admin/dashboard">HOME</Link> &gt;
          <Link to="/admin/owners"> OWNERS</Link> &gt; ADD
        </div>

        <header className="add-owner-header">
          <h2>Add Property Owner</h2>
          <p>Register a new property owner and their contact details.</p>
        </header>

        {/* PERSONAL INFO */}
        <div className="form-section">
          <div className="section-header">
            <h3>Personal Information</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
              />
            </div>

            <div className="form-group">
              <label>Alternative Contact</label>
              <input
                className="form-input"
                name="alternative_contact"
                value={formData.alternative_contact}
                onChange={handleChange}
                placeholder="e.g. +91 9998887776"
              />
            </div>
          </div>
        </div>

        {/* REPRESENTATIVE */}
        <div className="form-section">
          <div className="section-header">
            <h3>Representative Details</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Representative Name</label>
              <input
                className="form-input"
                name="representative_name"
                value={formData.representative_name}
                onChange={handleChange}
                placeholder="e.g. Jane Smith"
              />
            </div>

            <div className="form-group">
              <label>Representative Phone</label>
              <input
                className="form-input"
                name="representative_phone"
                value={formData.representative_phone}
                onChange={handleChange}
                placeholder="e.g. +91 1122334455"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Representative Email</label>
            <input
              className="form-input"
              name="representative_email"
              value={formData.representative_email}
              onChange={handleChange}
              placeholder="e.g. jane@company.com"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="form-section">
          <div className="section-header">
            <h3>Address</h3>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              className="form-input"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, City, Country"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Owner'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddOwner;
