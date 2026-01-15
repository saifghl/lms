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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch stats from backend
                const response = await getDashboardStats();
                const data = response.data;
                // Assuming data structure from backend matches or mapping it here
                setStats({
                    projects: { value: data.total_projects || 0, change: "+2%" },
                    units: { value: data.total_units || 0, change: "+5%" },
                    owners: { value: data.total_owners || 0, change: "0%" },
                    tenants: { value: data.total_tenants || 0, change: "+3%" },
                    leases: { value: data.total_leases || 0, change: "+4%" },
                    revenue: { value: `₹${data.total_revenue || 0}`, change: "+12%" }
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                            <p>Average Rent Achieved: ₹57.20 per sq ft</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">245,000 sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="area-card fade-in">
                        <div>
                            <h3>Area Vacant</h3>
                            <p>Average Expected Rent: ₹53.82 per sq ft</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">42,000 sq ft</div>
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

                            <path
                                d="M0,240 C120,225 240,205 360,185 S600,175 780,190 S960,215 1000,205"
                                stroke="#BFC8D6"
                                strokeDasharray="6 6"
                                fill="none"
                            />

                        </svg>

                        <div className="chart-labels">
                            <span>Jan</span><span>Feb</span><span>Mar</span>
                            <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                </section>

                {/* LISTS */}
                <section className="lists-container">

                    {/* RENEWALS */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Upcoming Renewals</h3>
                            <button>View All</button>
                        </div>

                        {[
                            { m: "Nov", d: "15", t: "Unit 402 • Nov 15, 2024", c: "James Logistics", b: "30 Days", cls: "warning" },
                            { m: "Dec", d: "01", t: "Unit 105 • Dec 01, 2024", c: "TechCorp Inc", b: "45 Days", cls: "success" },
                            { m: "Dec", d: "12", t: "Unit 220 • Dec 12, 2024", c: "Star Bakery", b: "60 Days", cls: "success" },
                        ].map((x, i) => (
                            <div className="list-item" key={i}>
                                <div className="list-icon-circle">
                                    <span>{x.m}</span>
                                    <span className="icon-day">{x.d}</span>
                                </div>
                                <div className="list-info">
                                    <h4>{x.t}</h4>
                                    <p>{x.c}</p>
                                </div>
                                <span className={`badge ${x.cls}`}>{x.b}</span>
                            </div>
                        ))}
                    </div>

                    {/* EXPIRIES */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button>View All</button>
                        </div>

                        {[
                            { m: "Oct", d: "31", t: "Unit 402 • Nov 15, 2024", c: "James Logistics", cls: "danger-pill", txt: "HIGH RISK" },
                            { m: "Nov", d: "05", t: "Unit 105 • Dec 01, 2024", c: "TechCorp Inc", cls: "warning-pill", txt: "MEDIUM" },
                            { m: "Nov", d: "20", t: "Unit 220 • Dec 12, 2024", c: "Star Bakery", cls: "success-pill", txt: "LOW" },
                        ].map((x, i) => (
                            <div className="list-item" key={i}>
                                <div className="list-icon-circle">
                                    <span>{x.m}</span>
                                    <span className="icon-day">{x.d}</span>
                                </div>
                                <div className="list-info">
                                    <h4>{x.t}</h4>
                                    <p>{x.c}</p>
                                </div>
                                <span className={`badge ${x.cls}`}>{x.txt}</span>
                            </div>
                        ))}

                    </div>

                    {/* ESCALATIONS */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button>View All</button>
                        </div>

                        {[
                            { m: "JAN", d: "01", t: "Unit 402 • Nov 15, 2024", c: "CPI Adjustment", p: "+3.5%" },
                            { m: "JAN", d: "01", t: "Unit 105 • Dec 01, 2024", c: "Fixed Increase", p: "+2.0%" },
                            { m: "FEB", d: "01", t: "Unit 220 • Dec 12, 2024", c: "Market Review", p: "+5.0%" },
                        ].map((x, i) => (
                            <div className="list-item" key={i}>
                                <div className="list-icon-circle gray">
                                    <span>{x.m}</span>
                                    <span className="icon-day">{x.d}</span>
                                </div>
                                <div className="list-info">
                                    <h4>{x.t}</h4>
                                    <p>{x.c}</p>
                                </div>
                                <span className="text-success">{x.p}</span>
                            </div>
                        ))}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default Dashboard;
