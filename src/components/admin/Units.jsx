import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { unitAPI } from '../../services/api';
import './units.css';

const Units = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('All');
    const [selectedUnitType, setSelectedUnitType] = useState('All');
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        project_id: '',
        status: ''
    });

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                console.log('Fetching units from API...');
                const response = await unitAPI.getUnits();
                const data = response.data;
                console.log('API Response:', data);

                if (!Array.isArray(data)) {
                    throw new Error('API response is not an array');
                }

                const mappedUnits = data.map(unit => ({
                    id: unit.id,
                    unitNo: unit.unit_number || 'N/A',
                    building: unit.building || 'N/A',
                    area: unit.area || 'N/A',
                    status: unit.status || 'unknown',
                    statusType: unit.status || 'unknown',
                    statusDesc: unit.status === 'vacant' ? 'Available for leasing' : 'Occupied'
                }));
                setUnits(mappedUnits);
                setError(null);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'Failed to fetch units');
                setUnits([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, []);

    // Filter units based on search and filters
    const filteredUnits = units.filter(unit => {
        const matchesSearch = searchTerm === '' ||
            unit.unitNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.area.toString().includes(searchTerm);
        const matchesBuilding = selectedBuilding === 'All' || unit.building === selectedBuilding;
        const matchesUnitType = selectedUnitType === 'All' || unit.status === selectedUnitType.toLowerCase();
        return matchesSearch && matchesBuilding && matchesUnitType;
    });

    // Get unique buildings for dropdown
    const buildings = ['All', ...new Set(units.map(unit => unit.building))];

    // Get unique statuses for unit type dropdown (as proxy)
    const unitTypes = ['All', ...new Set(units.map(unit => unit.status))];

    // Handlers
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleBuildingChange = (e) => setSelectedBuilding(e.target.value);
    const handleUnitTypeChange = (e) => setSelectedUnitType(e.target.value);
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedBuilding('All');
        setSelectedUnitType('All');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <p>Loading units...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <main className="main-content">
                    <p>Error fetching units: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <Link to="/admin/dashboard">HOME</Link> &gt; <Link to="/admin/projects">PROJECTS</Link> &gt; <span className="active">UNITS INVENTORY</span>
                        </div>
                        <h1>Unit Management</h1>
                        <p>Manage your property inventory, availability, and unit details.</p>
                    </div>
                    <Link to="/admin/add-unit" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>+ Add Units</Link>
                </header>

                <div className="content-card">
                    {/* Filters Bar */}
                    <div className="filters-bar">
                        <div className="search-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" placeholder="Search by Unit No, Tenant, or Building..." value={searchTerm} onChange={handleSearchChange} />
                        </div>
                        <div className="filter-group">
                            <div className="dropdown-filter">
                                <select value={selectedBuilding} onChange={handleBuildingChange}>
                                    {buildings.map(building => (
                                        <option key={building} value={building}>Building: {building}</option>
                                    ))}
                                </select>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            <div className="dropdown-filter">
                                <select value={selectedUnitType} onChange={handleUnitTypeChange}>
                                    {unitTypes.map(type => (
                                        <option key={type} value={type}>Unit Type: {type}</option>
                                    ))}
                                </select>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>
                        <div className="view-actions">
                            <button className="icon-btn active">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                            <button className="icon-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button className="text-btn" onClick={handleClearFilters}>Clear filters</button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Unit No</th>
                                    <th>Tower/Building</th>
                                    <th>Area (SQ FT)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnits.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">No units found.</td>
                                    </tr>
                                ) : (
                                    filteredUnits.map((unit) => (
                                        <tr key={unit.id}>
                                            <td className="unit-id">{unit.unitNo}</td>
                                            <td>{unit.building}</td>
                                            <td>{unit.area}</td>
                                            <td><span className={`status-badge ${unit.status}`}>{unit.status}</span></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/admin/view-unit/${unit.id}`} className="action-btn view" title="View">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    </Link>
                                                    <Link to={`/admin/edit-unit/${unit.id}`} className="action-btn edit" title="Edit">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span>Rows per page: 10 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                        <span>1—{filteredUnits.length} of {units.length}</span>
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

export default Units;