import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getProjectById, updateProject } from "../../services/api";
import "./EditProject.css";

const EditProject = () => {
  const { id } = useParams(); // /admin/edit-project/:id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    location: "",
    address: "",
    project_type: "",
    total_floors: "",
    total_project_area: "",
    description: "",
    status: "Active"
  });

  /* ================= FETCH PROJECT BY ID ================= */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await updateProject(id, formData);
      alert("Project Updated Successfully");
      navigate("/admin/projects");
    } catch (error) {
      console.error(error);
      alert("Error updating project");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="edit-project-container">

          {/* Header */}
          <header className="edit-header">
            <div className="header-left">
              <div className="breadcrumb">
                <Link to="/admin/dashboard">HOME</Link> &gt;
                <Link to="/admin/projects">PROJECTS</Link> &gt;
                <span className="active">EDIT PROJECT</span>
              </div>
              <div className="title-row">
                <h1>{formData.project_name}</h1>
                <span className="status-badge active">{formData.status}</span>
              </div>
              <p className="subtitle">
                Update critical project details, financials, and lease terms.
              </p>
            </div>
          </header>

          <div className="edit-grid">

            {/* MAIN COLUMN */}
            <div className="edit-col-main">

              <section className="edit-card">
                <h3>General Information</h3>

                <div className="form-group vertical">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group vertical">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </section>

            </div>

            {/* SIDE COLUMN */}
            <div className="edit-col-side">
              <section className="edit-card">
                <h3>Settings</h3>
                <div className="toggle-row">
                  <span>Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </section>
            </div>

          </div>

          <div className="edit-footer">
            <Link to="/admin/projects" className="cancel-btn">
              Cancel
            </Link>
            <button className="update-btn" onClick={handleUpdate}>
              Update Project
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EditProject;
