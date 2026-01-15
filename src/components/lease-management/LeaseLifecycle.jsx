import React, { useEffect, useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";
import {
  getPendingLeases,
  approveLease,
} from "../../services/api";

const LeaseLifecycle = () => {
  const [leases, setLeases] = useState([]);

  const loadLeases = () => {
    getPendingLeases()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setLeases(data);
      })
      .catch(() => alert("Failed to load pending leases"));
  };

  useEffect(() => {
    loadLeases();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveLease(id);
      loadLeases();
    } catch (error) {
      alert("Failed to approve lease");
    }
  };

  return (
    <div className="dashboard-layout">
      <RepSidebar />

      <div className="lease-dashboard-content">
        <h2>Pending Lease Approvals</h2>

        {leases.map((lease) => (
          <div className="approval-card" key={lease.id}>
            <h4>{lease.company_name || lease.tenant?.company_name || "Unknown Tenant"}</h4>
            <p>Rent: ₹{lease.monthly_rent}</p>
            <p>
              Duration: {lease.lease_start} → {lease.lease_end}
            </p>

            <button
              className="btn-approve"
              onClick={() => handleApprove(lease.id)}
            >
              Approve
            </button>
          </div>
        ))}

        {leases.length === 0 && <p>No pending leases</p>}
      </div>
    </div>
  );
};

export default LeaseLifecycle;
