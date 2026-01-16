import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';
import { getDashboardStats } from '../../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        projects: { value: 0, change: "0%" },
        units: { value: 0, change: "0%" },
        owners: { value: 0, change: "0%" },
        tenants: { value: 0, change: "0%" },
        leases: { value: 0, change: "0%" },
        revenue: { value: "₹0", change: "0%" }
    });
    const [loading, setLoading] = useState(true);
    const [areaStats, setAreaStats] = useState(null);
    const [lists, setLists] = useState({
        renewals: [],
        expiries: [],
        escalations: []
    });
    const [revenueTrends, setRevenueTrends] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats from backend
                const response = await getDashboardStats();
                const data = response.data;

                if (data.stats) {
                    setStats({
                        projects: { value: data.stats.totalProjects || 0, change: "+2%" }, // Mock change for now
                        units: { value: data.stats.totalUnits || 0, change: "+5%" },
                        owners: { value: data.stats.totalOwners || 0, change: "0%" },
                        tenants: { value: data.stats.totalTenants || 0, change: "+3%" },
                        leases: { value: data.stats.totalLeases || 0, change: "+4%" },
                        revenue: { value: `₹${parseFloat(data.stats.totalRevenue || 0).toLocaleString('en-IN')}`, change: "+12%" }
                    });
                }

                if (data.areaStats) {
                    setAreaStats(data.areaStats);
                }

                if (data.upcomingRenewals) setLists(prev => ({ ...prev, renewals: data.upcomingRenewals }));
                if (data.upcomingExpiries) setLists(prev => ({ ...prev, expiries: data.upcomingExpiries }));
                if (data.rentEscalations) setLists(prev => ({ ...prev, escalations: data.rentEscalations }));
                if (data.revenueTrends) setRevenueTrends(data.revenueTrends);

            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return { m: "UNK", d: "00", full: "Unknown" };
        const date = new Date(dateString);
        return {
            m: date.toLocaleString('default', { month: 'short' }),
            d: date.getDate().toString().padStart(2, '0'),
            full: date.toLocaleDateString()
        };
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <header className="dashboard-header">

                    <div className="search-bar">
                        <input type="text" placeholder="Search properties, tenants..." />
                        <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </button>

                        <button className="primary-btn" onClick={() => navigate('/admin/leases')}>
                            + New Lease
                        </button>
                    </div>
                </header>

                {/* TOP METRICS */}
                <section className="stats-grid">
                    {[
                        { title: "Total Projects", value: stats.projects.value, change: stats.projects.change, cls: "positive", stroke: "#2ED573" },
                        { title: "Total Units", value: stats.units.value, change: stats.units.change, cls: "negative", stroke: "#FF4757" },
                        { title: "Total Owners", value: stats.owners.value, change: stats.owners.change, cls: "neutral", stroke: "#2E66FF" },
                        { title: "Total Tenants", value: stats.tenants.value, change: stats.tenants.change, cls: "warning", stroke: "#FFA502" },
                        { title: "Total Leases", value: stats.leases.value, change: stats.leases.change, cls: "info", stroke: "#5352ED" },
                        { title: "Total Revenue", value: stats.revenue.value, change: stats.revenue.change, cls: "negative", stroke: "#FF4757" },
                    ].map((c, i) => (
                        <div className="stat-card fade-in" key={i}>
                            <h4>{c.title}</h4>
                            <div className="stat-value">{loading ? '...' : c.value}</div>
                            <div className={`stat-change ${c.cls}`}>{c.change}</div>

                            <div className="mini-chart">
                                <svg width="100%" height="38" viewBox="0 0 100 40">
                                    <path
                                        d="M0,30 C12,18 30,34 50,24 S88,18 100,26"
                                        fill="none"
                                        stroke={c.stroke}
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                </section>

                {/* AREA SECTION */}
                <section className="area-stats-container">

                    <div className="area-card fade-in">
                        <div>
                            <h3>Area Occupied</h3>
                            <p>Average Rent Achieved: ₹{areaStats?.occupied?.avgRentPerSqft ? parseFloat(areaStats.occupied.avgRentPerSqft).toFixed(2) : '0.00'} per sq ft</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">{areaStats?.occupied?.area ? parseFloat(areaStats.occupied.area).toLocaleString() : '0'} sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="area-card fade-in">
                        <div>
                            <h3>Area Vacant</h3>
                            <p>Average Expected Rent: ₹{areaStats?.vacant?.avgRentPerSqft ? parseFloat(areaStats.vacant.avgRentPerSqft).toFixed(2) : '0.00'} per sq ft</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">{areaStats?.vacant?.area ? parseFloat(areaStats.vacant.area).toLocaleString() : '0'} sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                </section>

                {/* CHART */}
                <section className="chart-section fade-in">

                    <div className="section-header">

                        <h2>
                            Revenue Trends
                            <span className="text-muted">
                                Gross revenue across all properties
                            </span>
                        </h2>

                        <div className="chart-legend">
                            <span className="legend-item"><span className="dot current" /> This year</span>
                            <span className="legend-item"><span className="dot last" /> Last year</span>
                        </div>

                    </div>

                    <div className="chart-wrapper">

                        <svg viewBox="0 0 1000 300" preserveAspectRatio="none">

                            <defs>
                                <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2E66FF" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#2E66FF" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <path d="M0,250 L1000,250" stroke="#F0F2F5" />
                            <path d="M0,200 L1000,200" stroke="#F0F2F5" />
                            <path d="M0,150 L1000,150" stroke="#F0F2F5" />

                            <path
                                d="M0,220 C120,205 240,165 360,145 S600,110 780,130 S960,165 1000,155"
                                fill="url(#trend)"
                                stroke="#2E66FF"
                                strokeWidth="3"
                            />

                        </svg>

                        <div className="chart-labels">
                            {revenueTrends.length > 0 ? revenueTrends.map((t, i) => (
                                <span key={i}>{t.month}</span>
                            )) : (
                                <>
                                    <span>Jan</span><span>Feb</span><span>Mar</span>
                                    <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* LISTS */}
                <section className="lists-container">

                    {/* RENEWALS */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Upcoming Renewals</h3>
                            <button onClick={() => navigate('/admin/leases')}>View All</button>
                        </div>

                        {lists.renewals.length > 0 ? lists.renewals.map((x, i) => {
                            const d = formatDate(x.lease_end_date);
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle">
                                        <span>{d.m}</span>
                                        <span className="icon-day">{d.d}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>Unit {x.unit_number} • {d.full}</h4>
                                        <p>{x.tenant_name}</p>
                                    </div>
                                    <span className={`badge warning`}>{x.days_remaining} Days</span>
                                </div>
                            )
                        }) : <p className="text-muted p-3">No upcoming renewals</p>}
                    </div>

                    {/* EXPIRIES */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button onClick={() => navigate('/admin/leases')}>View All</button>
                        </div>

                        {lists.expiries.length > 0 ? lists.expiries.map((x, i) => {
                            const d = formatDate(x.lease_end_date);
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle">
                                        <span>{d.m}</span>
                                        <span className="icon-day">{d.d}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>Unit {x.unit_number} • {d.full}</h4>
                                        <p>{x.tenant_name}</p>
                                    </div>
                                    <span className={`badge danger-pill`}>{x.days_remaining} Days</span>
                                </div>
                            )
                        }) : <p className="text-muted p-3">No upcoming expiries</p>}

                    </div>

                    {/* ESCALATIONS */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button onClick={() => navigate('/admin/leases')}>View All</button>
                        </div>

                        {lists.escalations.length > 0 ? lists.escalations.map((x, i) => {
                            const d = formatDate(x.effective_date);
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle gray">
                                        <span>{d.m}</span>
                                        <span className="icon-day">{d.d}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>Unit {x.unit_number} • {d.full}</h4>
                                        <p>{x.increase_type}</p>
                                    </div>
                                    <span className="text-success">+{parseFloat(x.value).toLocaleString()}</span>
                                </div>
                            )
                        }) : <p className="text-muted p-3">No upcoming escalations</p>}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default Dashboard;
