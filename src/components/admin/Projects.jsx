import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getProjects, deleteProject as deleteProjectAPI } from "../../services/api";
import "./projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  /* ================= DELETE PROJECT ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProjectAPI(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <div className="header-text">
            <h1>Projects</h1>
            <p>Manage your commercial properties and business spaces</p>
          </div>
          <Link
            to="/admin/add-project"
            className="primary-btn"
            style={{ textDecoration: "none" }}
          >
            + Add Project
          </Link>
        </header>

        <div className="content-card">
          {/* Filters (UI ONLY) */}
          <div className="filters-bar">
            <div className="search-wrapper">
              <input type="text" placeholder="Search projects..." />
            </div>
            <div className="filter-actions">
              <button className="filter-btn">Location: All</button>
              <button className="filter-btn">Type: Residential</button>
              <button className="clear-btn">Clear filters</button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="table-responsive">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Total Floors</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-info-cell">
                        <div className="project-icon">🏢</div>
                        <div>
                          <div className="project-name">
                            {project.project_name}
                          </div>
                          <div className="project-id">
                            ID: {project.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="text-secondary">
                      {project.location}
                    </td>

                    <td>
                      <div className="units-cell">
                        <span className="unit-count">
                          {project.total_floors}
                        </span>
                        <span className="occupancy-label">
                          {project.project_type}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="actions-cell">
                        <Link
                          to={`/admin/edit-project/${project.id}`}
                          className="action-btn edit"
                        >
                          ✏️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Projects;
