import React from "react";
import Sidebar from "./sidebar";
import "./sidebar.css";

function DocRepo() {
  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="content-area">
        {/* Page Header */}
        <div className="page-header">
          <h2>Document Repository</h2>
          <p>
            Manage, organize, and track all lease-related documentation across
            your portfolio.
          </p>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-box">
            <div className="upload-icon">📄</div>
            <h4>Drag and Drop Excel file here</h4>
            <p>Click the button below to browse your files</p>
            <button className="upload-btn">Upload File</button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="filter-section">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />

          <select className="filter-dropdown">
            <option>All Categories</option>
            <option>Lease</option>
            <option>Reporting</option>
            <option>Property</option>
          </select>

          <select className="filter-dropdown">
            <option>Upload Date</option>
          </select>

          <select className="filter-dropdown">
            <option>File Type</option>
          </select>
        </div>

        {/* Document Table */}
        <div className="table-section">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Date</th>
                <th>Uploaded By</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Sunset Apartments</td>
                <td>11 Dec 2025</td>
                <td>Kriti Shah</td>
                <td>Lease</td>
                <td>⋮</td>
              </tr>

              <tr>
                <td>Lakeside Commercial</td>
                <td>11 Dec 2025</td>
                <td>Kriti Shah</td>
                <td>Reporting</td>
                <td>⋮</td>
              </tr>

              <tr>
                <td>Downtown Lofts</td>
                <td>11 Dec 2025</td>
                <td>Kriti Shah</td>
                <td>Property</td>
                <td>⋮</td>
              </tr>

              <tr>
                <td>Oakwood Residence</td>
                <td>11 Dec 2025</td>
                <td>Kriti Shah</td>
                <td>Tenant</td>
                <td>⋮</td>
              </tr>

              <tr>
                <td>Miami Bay Villa</td>
                <td>11 Dec 2025</td>
                <td>Kriti Shah</td>
                <td>Lease</td>
                <td>⋮</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-section">
          <span>Showing 1 to 5 of 42 results</span>

          <div className="pagination">
            <span className="page active">1</span>
            <span className="page">2</span>
            <span className="page">3</span>
            <span className="page">4</span>
            <span className="page">5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocRepo;
