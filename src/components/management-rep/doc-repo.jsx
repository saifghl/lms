import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RepSidebar from "./RepSidebar";
import { managementAPI } from "../../services/api";
import "./DocumentRepository.css";

const DocumentRepository = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, [searchQuery, filterCategory]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory) params.category = filterCategory;

      const res = await managementAPI.getDocuments(params);
      const list = res.data.data || res.data || [];
      setDocuments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    // Trigger hidden file input or open modal
    document.getElementById('file-upload').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Add other fields if required by API, e.g., project_id, category
      // formData.append('project_id', 1); 
      // formData.append('category', 'General');

      await managementAPI.uploadDocument(formData);
      alert('File uploaded successfully');
      fetchDocuments();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="dashboard-container">
      <RepSidebar />
      <main className="main-content">
        <header className="page-header">
          <div className="header-left">
            <div className="breadcrumb">
              <Link to="/management/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>HOME</Link> &gt; <span className="active">DOCUMENTS</span>
            </div>
            <h1>Document Repository</h1>
            <p>Centralized storage for all project and lease related documents.</p>
          </div>
        </header>

        {/* Upload Zone */}
        <div className="upload-zone-container">
          <div className="drag-drop-area">
            <svg className="upload-icon-large" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <h3>Upload New Document</h3>
            <p>Drag and drop files here, or click to browse</p>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="btn-upload-file" onClick={handleUploadClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Browse Files
            </button>
          </div>
        </div>

        <div className="content-card">
          {/* Filters Bar */}
          <div className="filters-bar">
            <div className="filter-group">
              <div className="search-wrapper">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="select-wrapper">
                <select
                  className="filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Lease">Lease Agreements</option>
                  <option value="Legal">Legal</option>
                  <option value="Invoices">Invoices</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name / Project</th>
                  <th>Category</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Loading documents...</td>
                  </tr>
                )}
                {!loading && documents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No documents found</td>
                  </tr>
                )}
                {!loading && documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="project-name-cell">
                        <div className="project-icon-placeholder">
                          DOC
                        </div>
                        <div className="file-info">
                          <h4>{doc.name || doc.projectName || 'Untitled'}</h4>
                          <span>{doc.projectName}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge processing" style={{ background: '#f7fafc', color: '#4a5568', border: '1px solid #edf2f7' }}>
                        {doc.category || 'General'}
                      </span>
                    </td>
                    <td>{doc.uploadedBy || 'Admin'}</td>
                    <td>{formatDate(doc.date || doc.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn" title="Download">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <button className="action-btn" title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span>Showing {documents.length} results</span>
            <div className="page-nav">
              <button disabled>&lt;</button>
              <span>1</span>
              <button>&gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentRepository;
