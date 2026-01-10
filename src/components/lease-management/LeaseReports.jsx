import React, { useEffect, useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";
import { getExpiringLeases } from "../../services/api";

const LeaseReports = () => {
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    getExpiringLeases()
      .then((res) => setLeases(res.data))
      .catch(() => alert("Failed to load lease reports"));
  }, []);

  return (
    <div className="dashboard-layout">
      <RepSidebar />

      <div className="lease-dashboard-content">
        <h2>Expiring Leases</h2>

        {leases.map((lease) => (
          <div className="tracker-item" key={lease.id}>
            <h3>{lease.company_name}</h3>
            <p>Rent: ₹{lease.monthly_rent}</p>
            <p>Expiry: {lease.lease_end}</p>
          </div>
        ))}

        {leases.length === 0 && <p>No expiring leases</p>}
      </div>
    </div>
  );
};

export default LeaseReports;
