import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { getProjects, deleteProject as deleteProjectAPI } from "../../services/api";
import "./projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");

  // Options for filters (hardcoded for now as per requirement to make it functional without major UI overhaul)
  const LOCATIONS = ["All", "Mumbai", "Pune", "Bangalore", "Delhi"];
  const TYPES = ["All", "Residential", "Commercial", "Industrial"];

  /* ================= FETCH PROJECTS ================= */
  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (location !== "All") params.location = location;
        if (type !== "All") params.type = type;

        const response = await getProjects(params);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, location, type]);

  /* ================= HANDLERS ================= */
  const handleSearch = (e) => setSearch(e.target.value);

  const cycleLocation = () => {
    const currentIndex = LOCATIONS.indexOf(location);
    const nextIndex = (currentIndex + 1) % LOCATIONS.length;
    setLocation(LOCATIONS[nextIndex]);
  };

  const cycleType = () => {
    const currentIndex = TYPES.indexOf(type);
    const nextIndex = (currentIndex + 1) % TYPES.length;
    setType(TYPES[nextIndex]);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("All");
    setType("All");
  };

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
            style={{ textDecoration: "none", display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Project
          </Link>
        </header>

        <div className="content-card">
          {/* Filters (UI ONLY) */}
          <div className="filters-bar">
            <div className="search-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search projects by key name, city, or ID..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="filter-actions">
              <button className="filter-btn" onClick={cycleLocation}>
                Location: {location}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <button className="filter-btn" onClick={cycleType}>
                Type: {type}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <button className="clear-btn" onClick={clearFilters}>Clear filters</button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="table-responsive">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Total Units</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>Loading projects...</td>
                  </tr>
                )}
                {!loading && projects.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>No projects found.</td>
                  </tr>
                )}
                {!loading && projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-info-cell">
                        <div className="project-icon-wrapper">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </div>
                        <div>
                          <div className="project-name">
                            {project.project_name}
                          </div>
                          <div className="project-id">
                            ID: P-{project.id}
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
                          {project.total_units || project.total_floors || 0}
                        </span>
                        <span className="occupancy-label">
                          {/* Mock occupancy - replace with real data if available in API */}
                          {(project.total_units > 0 ? '85% Occupied' : 'New Construction')}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="actions-cell">
                        <Link
                          to={`/admin/edit-project/${project.id}`}
                          className="action-btn"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(project.id)}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Static Demo) */}
          <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div className="showing-text" style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Showing {projects.length > 0 ? `1 to ${projects.length}` : '0'} of {projects.length} results
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }} disabled>&lt;</button>
              <button style={{ padding: '6px 12px', border: '1px solid #2e66ff', background: '#2e66ff', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>1</button>
              <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }}>2</button>
              <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }}>...</button>
              <button style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '6px', color: '#64748b', cursor: 'pointer' }}>&gt;</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Projects;
