import React from 'react';
import RepSidebar from './RepSidebar';
import './DocumentRepository.css';

const DocRepo = () => {
  // Mock Data based on the screenshot
  const documents = [
    {
      id: 'P-1024',
      projectName: 'Sunset Apartments',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2535&auto=format&fit=crop',
      date: '11des2025',
      uploadedBy: 'Ketki Shah',
      category: 'Lease'
    },
    {
      id: 'P-1045',
      projectName: 'Lakeside Commercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
      date: '11des2025',
      uploadedBy: 'Ketki Shah',
      category: 'Repoerting'
    },
    {
      id: 'P-1102',
      projectName: 'Downtown Lofts',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec2aa5a398f?q=80&w=2696&auto=format&fit=crop',
      date: '11des2025',
      uploadedBy: 'Ketki Shah',
      category: 'Property'
    },
    {
      id: 'P-1120',
      projectName: 'Oakwood Residence',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop',
      date: '11des2025',
      uploadedBy: 'Ketki Shah',
      category: 'Tentant'
    },
    {
      id: 'P-1155',
      projectName: 'Miami Bay Villa',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
      date: '11des2025',
      uploadedBy: 'Ketki Shah',
      category: 'Lease'
    }
  ];

  return (
    <div className="doc-repo-container">
      <RepSidebar />
      <main className="doc-repo-content">
        <div className="doc-repo-header">
          <h2>Document Repository</h2>
          <p>Manage, organize,and track all lease-related documentation across your portfolio.</p>
        </div>

        <div className="upload-zone-container">
          <div className="drag-drop-area">
            <div className="upload-icon-large">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="12"></line><line x1="15" y1="15" x2="12" y2="12"></line></svg>
            </div>
            <h3>Drag and Droop Excel file here</h3>
            <p>Click the button below to browse your files</p>
            <button className="btn-upload-file">Upload File</button>
          </div>
        </div>

        <div className="docs-filters-bar">
          <div className="docs-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="" />
          </div>
          <div className="docs-filter-group">
            <button className="docs-dropdown">
              All Categories
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button className="docs-dropdown">
              Upload date
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button className="docs-dropdown">
              File Type
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </div>

        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Date</th>
                <th>Uploaded by</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={index}>
                  <td>
                    <div className="project-name-cell">
                      <img src={doc.image} alt={doc.projectName} className="project-thumb" />
                      <div className="project-details">
                        <h4>{doc.projectName}</h4>
                        <span>ID: #{doc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{doc.date}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{doc.category}</td>
                  <td>
                    <div className="action-placeholder"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="docs-pagination">
          <span>Showing 1 to 5 of 42 results</span>
          <div className="pagination-controls">
            <div className="page-arrow">&lt;</div>
            <div className="page-num active">1</div>
            <div className="page-num">2</div>
            <div className="page-num">3</div>
            <div className="page-num">4</div>
            <div className="page-num">5</div>
            <div className="page-num">...</div>
            <div className="page-num">42</div>
            <div className="page-arrow">&gt;</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocRepo;
