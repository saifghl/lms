import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import './ActivityLogs.css';

import { getActivityLogs, exportActivityLogs, getProjectLocations, FILE_BASE_URL } from '../../services/api';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    // Filters
    const [search, setSearch] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [selectedModule, setSelectedModule] = useState("All Modules");
    const [availableLocations, setAvailableLocations] = useState(["All Locations"]);

    const MODULES = ["All Modules", "User Mgmt", "Lease Mgmt", "Properties", "Reports", "Financials"];

    // Fetch Locations (using Project Locations as proxy for User/Office Locations)
    useEffect(() => {
        const fetchLocs = async () => {
            try {
                const res = await getProjectLocations();
                if (res.data) {
                    setAvailableLocations(["All Locations", ...res.data]);
                }
            } catch (err) {
                console.error("Failed to fetch locations", err);
            }
        };
        fetchLocs();
    }, []);

    const fetchLogs = React.useCallback(async () => {
        try {
            setLoading(true);
            const filters = {};
            if (search) filters.search = search;
            if (selectedLocation !== "All Locations") filters.location = selectedLocation;
            if (selectedModule !== "All Modules") filters.module = selectedModule;

            const res = await getActivityLogs(pagination.page, pagination.limit, filters);
            if (res.data && res.data.logs) {
                setLogs(res.data.logs);
                setPagination(prev => ({ ...prev, total: res.data.total }));
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, selectedLocation, selectedModule]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchLogs]);

    // Helper to format date and time
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const handleExport = async () => {
        try {
            const filters = {};
            if (search) filters.search = search;
            if (selectedLocation !== "All Locations") filters.location = selectedLocation;
            if (selectedModule !== "All Modules") filters.module = selectedModule;

            const res = await exportActivityLogs(filters);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'activity_logs.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.limit)) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // Helper to generate page numbers
    const getPageNumbers = () => {
        const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
        const current = pagination.page;
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedLocation("All Locations");
        setSelectedModule("All Modules");
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="activity-logs-container">
            <Sidebar />
            <main className="activity-logs-content">
                <header className="activity-header">
                    <div className="activity-title">
                        <h2>Activity Logs</h2>
                        <p>Monitor system changes, user actions, and security events in real-time.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-refresh" onClick={fetchLogs}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                            Refresh
                        </button>
                        <button className="btn-export" onClick={handleExport}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Export Report
                        </button>
                    </div>
                </header>

                <div className="filters-container">
                    {/* Search Bar - Added as per requirement */}
                    <div className="search-wrapper">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        {/* Module Dropdown */}
                        <select
                            className="filter-dropdown-select"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                        >
                            {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>

                        {/* Location Dropdown - Replacing static "User Management" or added next to it */}
                        <select
                            className="filter-dropdown-select"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>

                        {/* Removed static User Management text */}
                        <button className="btn-add-filter">+ Add Filter</button>
                    </div>
                    <div className="filter-controls">
                        <span className="clear-filters" onClick={handleClearFilters}>Clear filters</span>
                    </div>
                </div>

                <div className="activity-table-container">
                    <div className="activity-table-header">
                        <div>Avatar</div>
                        <div>User</div>
                        <div>Action</div>
                        <div>Module</div>
                        <div>Timestamp</div>
                    </div>

                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>No activity logs found.</div>
                    ) : (
                        logs.map((log, index) => {
                            const { date, time } = formatDateTime(log.created_at);
                            const userName = log.first_name ? `${log.first_name} ${log.last_name}` : 'Unknown User';
                            const role = log.role_name || 'N/A';
                            // Parse details if JSON, else string
                            let details = log.details;
                            try {
                                const parsed = JSON.parse(log.details);
                                details = typeof parsed === 'object' ? JSON.stringify(parsed) : parsed;
                            } catch (e) { }

                            // Avatar logic
                            const avatarUrl = log.profile_image
                                ? `${FILE_BASE_URL}/uploads/${log.profile_image}`
                                : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E";

                            return (
                                <div className="activity-row" key={log.id || index}>
                                    <div className="avatar-col">
                                        <img src={avatarUrl} alt={userName} onError={(e) => e.target.src = avatarUrl} />
                                    </div>
                                    <div className="user-col">
                                        <h4>{userName}</h4>
                                        <span>{role}</span>
                                    </div>
                                    <div className="action-col">
                                        <h4>{log.action}</h4>
                                        <span>{details}</span>
                                    </div>
                                    <div className="module-col">
                                        <span className={`badge-module ${log.module?.toLowerCase().split(' ')[0]}`}>{log.module}</span>
                                    </div>
                                    <div className="timestamp-col">
                                        <span>{date}</span>
                                        <span className="time">{time}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div className="table-footer">
                        <span>Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} log</span>
                        <div className="pagination">
                            <span
                                className={`page-arrow ${pagination.page === 1 ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >&lt;</span>

                            {getPageNumbers().map((page, idx) => (
                                <span
                                    key={idx}
                                    className={`page-item ${pagination.page === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                >
                                    {page}
                                </span>
                            ))}

                            <span
                                className={`page-arrow ${pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'disabled' : ''}`}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >&gt;</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActivityLogs;
