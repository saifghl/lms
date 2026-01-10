import React, { useEffect, useState } from "react";
import RepSidebar from "./RepSidebar";
import { getReports } from "../../services/managementApi";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports().then((res) => setReports(res.data));
  }, []);

  return (
    <div className="reports-container">
      <RepSidebar />
      <main style={{ marginLeft: 250 }}>
        <h2>Reports</h2>

        <table className="reports-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Reports;
