import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ownerAPI } from '../../services/api';
import './OwnerDetails.css';

const OwnerDetails = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);

  const profileImage = "https://via.placeholder.com/120";
  const displayName = owner?.name || "Owner Name";
  const displayId = owner?.id || "000";
  const joinedDate = "2024";
  const email = owner?.email || "demo@email.com";
  const phone = owner?.phone || "0000000000";
  const repName = owner?.representative_name || "Representative";
  const repPhone = owner?.representative_phone || "0000000000";
  const address = owner?.address || "Not available";

  useEffect(() => {
    // Optional API call later
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="content">
        <h2>Owner Details</h2>

        <img src={profileImage} alt="Profile" />

        <p><b>Name:</b> {displayName}</p>
        <p><b>ID:</b> {displayId}</p>
        <p><b>Joined:</b> {joinedDate}</p>
        <p><b>Email:</b> {email}</p>
        <p><b>Phone:</b> {phone}</p>
        <p><b>Representative:</b> {repName}</p>
        <p><b>Rep Phone:</b> {repPhone}</p>
        <p><b>Address:</b> {address}</p>

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default OwnerDetails;
