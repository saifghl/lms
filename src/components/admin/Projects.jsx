import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './projects.css';

const Projects = () => {
    // TODO: Backend - Fetch all projects from API
    // useEffect(() => {
    //   const fetchProjects = async () => {
    //     const response = await fetch('/api/projects');
    //     setProjects(await response.json());
    //   };
    //   fetchProjects();
    // }, []);

    // Mock Data
    const projects = [
        {
            id: "P-1024",
            name: "Sunset Apartments",
            location: "Austin, TX",
            units: "120",
            occupancy: "98% Occupied",
            status: "active",
            type: "Residential"
        },
        {
            id: "P-1025",
            name: "Lakeside Commercial",
            location: "Chicago, IL",
            units: "45",
            occupancy: "Commercial Spaces",
            status: "maintenance",
            type: "Commercial"
        },
        {
            id: "P-1026",
            name: "Downtown Lofts",
            location: "Seattle, WA",
            units: "200",
            occupancy: "New Construction",
            status: "planning",
            type: "Residential"
        },
        {
            id: "P-1027",
            name: "Oakwood Residence",
            location: "Portland, OR",
            units: "24",
            occupancy: "100% Occupied",
            status: "active",
            type: "Residential"
        },
        {
            id: "P-1028",
            name: "Miami Bay Villa",
            location: "Miami, FL",
            units: "1",
            occupancy: "Single Family",
            status: "inactive",
            type: "Residential"
        }
    ];

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-text">
                        <h1>Projects</h1>
                        <p>Manage your commercial properties and business spaces</p>
                    </div>
                    <Link to="/admin/add-project" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>+ Add Project</Link>
                </header>

                <div className="content-card">
                    {/* Filters */}
                    <div className="filters-bar">
                        <div className="search-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search projects by key name, city, or ID..." />
                        </div>
                        <div className="filter-actions">

                            <button className="filter-btn">
                                Location: All
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <button className="filter-btn">
                                Type: Residential
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <button className="clear-btn">Clear filters</button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Location</th>
                                    <th>Total Units</th>

                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <div className="project-info-cell">
                                                {/* Placeholder Icon for Project Image */}
                                                <div className="project-icon">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8H7v8" /><line x1="22" y1="0" x2="22" y2="0" /></svg>
                                                </div>
                                                <div>
                                                    <div className="project-name">{project.name}</div>
                                                    <div className="project-id">ID: {project.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-secondary">{project.location}</td>
                                        <td>
                                            <div className="units-cell">
                                                <span className="unit-count">{project.units}</span>
                                                <span className="occupancy-label">{project.occupancy}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="actions-cell">
                                                <Link to={`/admin/edit-project/${project.id}`} className="action-btn edit" title="Edit">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span className="showing-text">Showing 1 to 5 of 42 results</span>
                        <div className="page-controls">
                            <button className="page-btn disabled">&lt;</button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <button className="page-btn">4</button>
                            <span className="ellipsis">...</span>
                            <button className="page-btn">42</button>
                            <button className="page-btn">&gt;</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Projects;
