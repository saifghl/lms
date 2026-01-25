import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getProjects, unitAPI, ownershipAPI, partyAPI } from '../../services/api';
import './OwnershipMapping.css';

const OwnershipMapping = () => {
    const [projects, setProjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [unitOwners, setUnitOwners] = useState([]); // List of history
    const [currentOwner, setCurrentOwner] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchUnits(selectedProject);
        } else {
            setUnits([]);
            setSelectedUnit('');
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedUnit) {
            fetchOwnerships(selectedUnit);
        } else {
            setUnitOwners([]);
            setCurrentOwner(null);
        }
    }, [selectedUnit]);

    const fetchProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUnits = async (projectId) => {
        try {
            const res = await unitAPI.getUnitsByProject(projectId);
            setUnits(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOwnerships = async (unitId) => {
        setLoading(true);
        try {
            const res = await ownershipAPI.getOwnersByUnit(unitId);
            const owners = res.data || [];
            setUnitOwners(owners);
            const active = owners.find(o => o.ownership_status === 'Active');
            setCurrentOwner(active || null);
        } catch (error) {
            console.error("Failed to fetch ownerships", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveOwner = async () => {
        if (!currentOwner) return;
        if (window.confirm('Are you sure you want to remove the current owner?')) {
            try {
                await ownershipAPI.removeOwner({ unit_id: selectedUnit, party_id: currentOwner.party_id, end_date: new Date().toISOString().split('T')[0] });
                fetchOwnerships(selectedUnit);
            } catch (error) {
                alert('Failed to remove owner');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <div className="breadcrumb">
                        <Link to="/admin/dashboard">HOME</Link> &gt; <span className="active">OWNERSHIP MAPPING</span>
                    </div>
                    <h1>Ownership Mapping</h1>
                    <p>Assign Owners to Units.</p>
                </header>

                <div className="mapping-interface">
                    <div className="selection-panel">
                        <div className="selection-group">
                            <label>Select Project</label>
                            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                                <option value="">-- Choose Project --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.project_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="selection-group">
                            <label>Select Unit</label>
                            <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} disabled={!selectedProject}>
                                <option value="">-- Choose Unit --</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.id}>Unit {u.unit_number} ({u.status})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="details-panel">
                        {!selectedUnit ? (
                            <div className="no-unit-selected">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                <p>Select a Unit to view ownership details</p>
                            </div>
                        ) : (
                            <>
                                <h3>Current Ownership</h3>
                                {currentOwner ? (
                                    <div className="current-owner-card">
                                        <div className="owner-info">
                                            <h4>{currentOwner.company_name || `${currentOwner.first_name} ${currentOwner.last_name}`}</h4>
                                            <p>Since: {new Date(currentOwner.start_date).toLocaleDateString()}</p>
                                        </div>
                                        <button className="remove-btn" onClick={handleRemoveOwner}>Remove</button>
                                    </div>
                                ) : (
                                    <div className="current-owner-card" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                        <div className="owner-info">
                                            <h4 style={{ color: '#64748b' }}>No Active Owner</h4>
                                        </div>
                                        <button className="assign-btn" onClick={() => setIsAssignModalOpen(true)}>Assign New Owner</button>
                                    </div>
                                )}

                                <h3>Ownership History</h3>
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Owner Name</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unitOwners.map(o => (
                                            <tr key={o.id}>
                                                <td>{o.company_name || `${o.first_name} ${o.last_name}`}</td>
                                                <td>
                                                    <span className={`status-badge ${o.ownership_status.toLowerCase() === 'active' ? 'individual' : 'company'}`} style={{ background: o.ownership_status === 'Active' ? '#dcfce7' : '#f1f5f9', color: o.ownership_status === 'Active' ? '#166534' : '#64748b' }}>
                                                        {o.ownership_status}
                                                    </span>
                                                </td>
                                                <td>{new Date(o.start_date).toLocaleDateString()}</td>
                                                <td>{o.end_date ? new Date(o.end_date).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        ))}
                                        {unitOwners.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No history found</td></tr>}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>

                {isAssignModalOpen && (
                    <AssignOwnerModal
                        isOpen={isAssignModalOpen}
                        onClose={() => setIsAssignModalOpen(false)}
                        unitId={selectedUnit}
                        onAssign={() => {
                            setIsAssignModalOpen(false);
                            fetchOwnerships(selectedUnit);
                        }}
                    />
                )}
            </main>
        </div>
    );
};

const AssignOwnerModal = ({ isOpen, onClose, unitId, onAssign }) => {
    const [search, setSearch] = useState('');
    const [parties, setParties] = useState([]);
    const [selectedParty, setSelectedParty] = useState(null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const searchParties = async () => {
            try {
                const res = await partyAPI.getAllParties({ search }); // API needs search param support
                setParties(res.data || []);
            } catch (e) { console.error(e); }
        };
        searchParties();
    }, [search]);

    const searchParties = async () => {
        try {
            const res = await partyAPI.getAllParties({ search }); // API needs search param support
            setParties(res.data || []);
        } catch (e) { console.error(e); }
    };

    const handleAssign = async () => {
        if (!selectedParty) return;
        try {
            await ownershipAPI.assignOwner({ unit_id: unitId, party_id: selectedParty.id, start_date: startDate });
            onAssign();
        } catch (e) {
            alert("Failed to assign: " + (e.response?.data?.message || e.message));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Assign Owner</h3>
                <div className="form-group">
                    <label>Search Party</label>
                    <input
                        className="form-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Type name..."
                        autoFocus
                    />
                    <div className="search-results">
                        {parties.map(p => (
                            <div
                                key={p.id}
                                className={`search-item ${selectedParty?.id === p.id ? 'selected' : ''}`}
                                onClick={() => setSelectedParty(p)}
                            >
                                {p.company_name || `${p.first_name} ${p.last_name}`} ({p.type})
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Assignment Date</label>
                    <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit" onClick={handleAssign} disabled={!selectedParty}>Assign</button>
                </div>
            </div>
        </div>
    );
};

export default OwnershipMapping;
