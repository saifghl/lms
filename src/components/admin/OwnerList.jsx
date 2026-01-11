import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './OwnerList.css';
import { ownerAPI } from '../../services/api';

const OwnerList = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const res = await ownerAPI.getOwners();
      setOwners(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <h2>Owners</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => navigate("/admin/owners/add")}>
          Add Owner
        </button>
      </div>
    </div>
  );
};

export default OwnerList;
