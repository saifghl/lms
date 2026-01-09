import React, { useEffect, useState } from "react";
import RepSidebar from "./RepSidebar";
import { getDocuments } from "../../services/managementApi";
import "./DocumentRepository.css";

const DocRepo = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getDocuments().then((res) => setDocuments(res.data));
  }, []);

  return (
    <div className="doc-repo-container">
      <RepSidebar />
      <main className="doc-repo-content">
        <h2>Document Repository</h2>

        <table className="docs-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Date</th>
              <th>Uploaded By</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.projectName}</td>
                <td>{doc.date}</td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default DocRepo;
