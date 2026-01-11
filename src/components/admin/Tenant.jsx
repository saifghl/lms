import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Tenant.css';

const Tenant = () => {
  const navigate = useNavigate();

  const tenant = { id: 1 };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="content">
        <h2>Tenant</h2>

        <button className="action-icon-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button onClick={() => navigate(`/admin/tenant/edit/${tenant.id}`)}>
          ✏️ Edit Tenant
        </button>

      </div>
    </div>
  );
};

export default Tenant;
