import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getDashboardStats, getProjects, tenantAPI, unitAPI } from '../../services/api';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Search State
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                setIsSearching(true);
                try {
                    const [projRes, tenantRes, unitRes] = await Promise.all([
                        getProjects({ search: searchTerm }),
                        tenantAPI.getTenants({ search: searchTerm }),
                        unitAPI.getUnits({ search: searchTerm })
                    ]);

                    const projects = (projRes.data.data || projRes.data || []).map(p => ({ ...p, type: 'Project', label: p.project_name, link: `/admin/projects/${p.id}` }));
                    const tenants = (tenantRes.data || []).map(t => ({ ...t, type: 'Tenant', label: t.company_name, link: `/admin/tenant/${t.id}` }));
                    const units = (unitRes.data.data || unitRes.data || []).map(u => ({ ...u, type: 'Unit', label: `${u.unit_number} (${u.building})`, link: `/admin/view-unit/${u.id}` }));

                    setSearchResults([...projects, ...tenants, ...units]);
                    setShowResults(true);
                } catch (err) {
                    console.error("Search failed", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchSelect = (link) => {
        navigate(link);
        setShowResults(false);
        setSearchTerm("");
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Helper data - handle the new nested structure
    const s = stats?.metrics || {};

    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">
                {/* HEADER */}
                <header className="dashboard-header">
                    <div className="search-bar-container">
                        <div className="search-bar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                placeholder="Search properties, tenants, units..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            />
                        </div>
                        {showResults && (
                            <div className="search-results-dropdown">
                                {isSearching ? (
                                    <div className="no-results">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((item, idx) => (
                                        <div key={idx} className="search-result-item" onClick={() => handleSearchSelect(item.link)}>
                                            <div className="search-result-info">
                                                <span className="search-result-label">{item.label}</span>
                                                <span className="search-result-type">{item.type}</span>
                                            </div>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">No results found for "{searchTerm}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn" onClick={() => navigate('/admin/notifications')} title="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </button>

                        <button className="primary-btn" onClick={() => navigate('/admin/leases')}>
                            + New Lease
                        </button>
                    </div>
                </header>

                {/* ROW 1: 5 Main Entities (Wrapping Grid) */}
                <section className="stats-grid-top">
                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : (
                        [
                            { title: "Total Projects", value: s.totalProjects?.value || 0, change: s.totalProjects?.change, cls: s.totalProjects?.type || "neutral", stroke: "#2ED573", link: "/admin/projects" },
                            { title: "Total Units", value: s.totalUnits?.value || 0, change: s.totalUnits?.change, cls: s.totalUnits?.type || "neutral", stroke: "#FF4757", link: "/admin/units" },
                            { title: "Total Masters", value: s.totalMasters?.value || 0, change: s.totalMasters?.change, cls: s.totalMasters?.type || "neutral", stroke: "#2E66FF", link: "/admin/parties" },
                            { title: "Active Ownerships", value: s.totalOwnerships?.value || 0, change: s.totalOwnerships?.change, cls: "neutral", stroke: "#FFA502", link: "/admin/ownership-mapping" },
                            { title: "Total Leases", value: s.totalLeases?.value || 0, change: s.totalLeases?.change, cls: s.totalLeases?.type || "neutral", stroke: "#5352ED", link: "/admin/leases" }
                        ].map((item, idx) => (
                            <div className="stat-card clickable" key={idx} onClick={() => navigate(item.link)} style={{ cursor: 'pointer' }}>
                                <h4>{item.title}</h4>
                                <div className="stat-value">{item.value}</div>
                                <div className={`stat-change ${item.cls}`}>
                                    {item.change}
                                </div>
                                <div className="mini-sparkline">
                                    <svg width="100%" height="35" viewBox="0 0 100 35" preserveAspectRatio="none">
                                        <path
                                            d="M0,25 C12,15 30,30 50,20 S88,15 100,22"
                                            fill="none"
                                            stroke={item.stroke}
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* ROW 2: Revenue & Area */}
                <section className="stats-grid-secondary">
                    {/* Revenue Card */}
                    <div className="stat-card revenue-card">
                        <div>
                            <h4>Total Revenue</h4>
                            <div className="stat-value">{s.totalRevenue?.value || "₹0.0M"}</div>
                            <div className="stat-change negative">
                                {s.totalRevenue?.change}
                            </div>
                        </div>
                        <div className="mini-chart-wave">
                            <svg width="120" height="40" viewBox="0 0 120 40">
                                <path d="M0,35 C30,35 30,10 60,10 C90,10 90,25 120,20" fill="none" stroke="#FF4757" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Area Occupied */}
                    <div className="area-card">
                        <div className="area-info">
                            <h4>Area Occupied</h4>
                            <span className="sub-text">Average Rent Achieved: ₹{Number(stats?.areaStats?.occupied?.avgRentPerSqft || 0).toFixed(2)} per sq ft</span>
                        </div>
                        <div className="area-metrics">
                            <span className="big-num">{stats?.areaStats?.occupied?.area?.toLocaleString() || '0'} sq ft</span>
                            <span className="label">Super / Leasable Area</span>
                        </div>
                    </div>

                    {/* Area Vacant */}
                    <div className="area-card">
                        <div className="area-info">
                            <h4>Area Vacant</h4>
                            <span className="sub-text">Average Expected Rent: ₹{Number(stats?.areaStats?.vacant?.avgRentPerSqft || 0).toFixed(2)} per sq ft</span>
                        </div>
                        <div className="area-metrics">
                            <span className="big-num">{stats?.areaStats?.vacant?.area?.toLocaleString() || '0'} sq ft</span>
                            <span className="label">Super / Leasable Area</span>
                        </div>
                    </div>
                </section>

                {/* REVENUE CHART SECTION */}
                <section className="chart-section">
                    <div className="section-header">
                        <h2>
                            Revenue Trends <span className="text-muted">Gross revenue across all properties</span>
                        </h2>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot current" /> This year</span>
                            <span className="legend-item"><span className="dot last" /> Last year</span>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {/* Dynamic Chart */}
                        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="revenue-chart-svg" style={{ width: '100%', height: '250px', overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2E66FF" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#2E66FF" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,250 L1000,250" stroke="#F0F2F5" />
                            <path d="M0,200 L1000,200" stroke="#F0F2F5" />
                            <path d="M0,150 L1000,150" stroke="#F0F2F5" />

                            {stats?.revenueTrends && (
                                <path
                                    d={(() => {
                                        const data = stats.revenueTrends;
                                        if (!data || data.length === 0) return "";

                                        const revenues = data.map(d => d.revenue);
                                        const maxRev = Math.max(...revenues) * 1.2 || 100;
                                        const width = 1000;
                                        const height = 250;
                                        const step = width / (data.length - 1);

                                        const points = data.map((d, i) => {
                                            const x = i * step;
                                            const y = height - (d.revenue / maxRev) * height;
                                            return `${x},${y}`;
                                        });

                                        let path = `M${points[0]}`;
                                        for (let i = 1; i < points.length; i++) {
                                            const [x, y] = points[i].split(',');
                                            path += ` L ${x},${y}`;
                                        }
                                        return path;
                                    })()}
                                    fill="url(#trendGradient)"
                                    stroke="#2E66FF"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                            )}
                        </svg>
                        <div className="chart-labels">
                            {stats?.revenueTrends?.map((d, i) => (
                                <span key={i}>{d.month}</span>
                            )) || <span>Loading...</span>}
                        </div>
                    </div>
                </section>

                {/* LISTS SECTIONS */}
                <section className="lists-grid">
                    {/* Renewals */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Renewals</h3>
                            <button className="link-btn" onClick={() => navigate('/admin/leases?filter=renewals')}>View All</button>
                        </div>
                        <div className="list-content">
                            {stats?.upcomingRenewals?.length > 0 ? stats.upcomingRenewals.map((item, idx) => (
                                <div className="list-item" key={idx}>
                                    <div className="date-badge">
                                        <span className="month">{new Date(item.lease_end_date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="day">{new Date(item.lease_end_date).getDate()}</span>
                                    </div>
                                    <div className="item-details">
                                        <div className="primary-text">{item.unit_number} • {new Date(item.lease_end_date).toLocaleDateString()}</div>
                                        <div className="secondary-text">{item.tenant_name}</div>
                                    </div>
                                    <span className={`status-pill ${item.badgeType}`}>
                                        {item.badge}
                                    </span>
                                </div>
                            )) : <p className="empty-text">No upcoming renewals.</p>}
                        </div>
                    </div>

                    {/* Expiries */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button className="link-btn" onClick={() => navigate('/admin/leases?filter=expiries')}>View All</button>
                        </div>
                        <div className="list-content">
                            {stats?.upcomingExpiries?.length > 0 ? stats.upcomingExpiries.map((item, idx) => (
                                <div className="list-item" key={idx}>
                                    <div className="date-badge">
                                        <span className="month">{new Date(item.lease_end_date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="day">{new Date(item.lease_end_date).getDate()}</span>
                                    </div>
                                    <div className="item-details">
                                        <div className="primary-text">{item.unit_number} • {new Date(item.lease_end_date).toLocaleDateString()}</div>
                                        <div className="secondary-text">{item.tenant_name}</div>
                                    </div>
                                    <span className={`status-pill ${item.badgeType}`}>
                                        {item.badge}
                                    </span>
                                </div>
                            )) : <p className="empty-text">No upcoming expiries.</p>}
                        </div>
                    </div>

                    {/* Rent Escalations */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button className="link-btn" onClick={() => navigate('/admin/leases?filter=escalations')}>View All</button>
                        </div>
                        <div className="list-content">
                            {stats?.rentEscalations?.length > 0 ? stats.rentEscalations.map((item, idx) => (
                                <div className="list-item" key={idx}>
                                    <div className="date-badge gray">
                                        <span className="month">{new Date(item.effective_from).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                        <span className="day">{new Date(item.effective_from).getDate()}</span>
                                    </div>
                                    <div className="item-details">
                                        <div className="primary-text">{item.unit_number} • {new Date(item.effective_from).getFullYear()}</div>
                                        <div className="secondary-text">{item.increase_type}</div>
                                    </div>
                                    <span className="value-text success">
                                        {item.increase_type === 'Percentage' ? `+${item.value}%` : `+₹${item.value}`}
                                    </span>
                                </div>
                            )) : <p className="empty-text">No escalations.</p>}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Dashboard;
