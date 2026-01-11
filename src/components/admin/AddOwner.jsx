import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AddOwner.css';
import { ownerAPI, unitAPI } from '../../services/api';

const AddOwner = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ownerAPI.createOwner(formData);
      alert("Owner added successfully!");
      navigate("/admin/owners");
    } catch (err) {
      console.error(err);
      alert("Failed to add owner");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <h2>Add Owner</h2>

        <form onSubmit={handleSubmit} className="form">
          <input name="name" placeholder="Owner Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />
          <input name="address" placeholder="Address" onChange={handleChange} />

          <button type="submit">Save Owner</button>
        </form>
      </div>
    </div>
  );
};

export default AddOwner;
