import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getDashboardStats } from '../../services/api';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <header className="dashboard-header">

                    <div className="search-bar">
                        <input type="text" placeholder="Search properties, tenants..." />
                        <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
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
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        [
                            { title: "Total Projects", value: stats?.stats?.totalProjects || 0, change: "", cls: "positive", stroke: "#2ED573" },
                            { title: "Total Units", value: stats?.stats?.totalUnits || 0, change: "", cls: "negative", stroke: "#FF4757" },
                            { title: "Total Owners", value: stats?.stats?.totalOwners || 0, change: "", cls: "neutral", stroke: "#2E66FF" },
                            { title: "Total Tenants", value: stats?.stats?.totalTenants || 0, change: "", cls: "warning", stroke: "#FFA502" },
                            { title: "Total Leases", value: stats?.stats?.totalLeases || 0, change: "", cls: "info", stroke: "#5352ED" },
                            { title: "Total Revenue", value: `₹${(stats?.stats?.totalRevenue || 0).toLocaleString()}`, change: "", cls: "negative", stroke: "#FF4757" },
                        ].map((c, i) => (
                            <div className="stat-card fade-in" key={i}>
                                <h4>{c.title}</h4>
                                <div className="stat-value">{c.value}</div>
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
                        ))
                    )}
                </section>

                {/* AREA SECTION */}
                <section className="area-stats-container">

                    <div className="area-card fade-in">
                        <div>
                            <h3>Area Occupied</h3>
                            <p>Average Rent Achieved: ₹{stats?.areaStats?.occupied?.avgRentPerSqft?.toFixed(2) || '0.00'} per sq ft</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">{stats?.areaStats?.occupied?.area?.toLocaleString() || '0'} sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="area-card fade-in">
                        <div>
                            <h3>Area Vacant</h3>
                            <p>Available for leasing</p>
                        </div>

                        <div className="area-value-block">
                            <div className="area-value">{stats?.areaStats?.vacant?.area?.toLocaleString() || '0'} sq ft</div>
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

                        {stats?.upcomingRenewals?.length > 0 ? stats.upcomingRenewals.map((x, i) => {
                            const date = new Date(x.lease_end_date);
                            const month = date.toLocaleString('default', { month: 'short' });
                            const day = date.getDate();
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle">
                                        <span>{month}</span>
                                        <span className="icon-day">{day}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>{x.unit_number} • {x.lease_end_date}</h4>
                                        <p>{x.tenant_name}</p>
                                    </div>
                                    <span className={`badge ${x.days_remaining < 30 ? 'warning' : 'success'}`}>
                                        {x.days_remaining} Days
                                    </span>
                                </div>
                            );
                        }) : (
                            <div className="list-item">No upcoming renewals</div>
                        )}
                    </div>

                    {/* EXPIRIES */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button>View All</button>
                        </div>

                        {stats?.upcomingExpiries?.length > 0 ? stats.upcomingExpiries.map((x, i) => {
                            const date = new Date(x.lease_end_date);
                            const month = date.toLocaleString('default', { month: 'short' });
                            const day = date.getDate();
                            const riskLevel = x.days_remaining < 30 ? 'danger-pill' : x.days_remaining < 60 ? 'warning-pill' : 'success-pill';
                            const riskText = x.days_remaining < 30 ? 'HIGH RISK' : x.days_remaining < 60 ? 'MEDIUM' : 'LOW';
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle">
                                        <span>{month}</span>
                                        <span className="icon-day">{day}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>{x.unit_number} • {x.lease_end_date}</h4>
                                        <p>{x.tenant_name}</p>
                                    </div>
                                    <span className={`badge ${riskLevel}`}>{riskText}</span>
                                </div>
                            );
                        }) : (
                            <div className="list-item">No upcoming expiries</div>
                        )}
                    </div>

                    {/* ESCALATIONS */}
                    <div className="list-card fade-in">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button>View All</button>
                        </div>

                        {stats?.rentEscalations?.length > 0 ? stats.rentEscalations.map((x, i) => {
                            const date = new Date(x.effective_date);
                            const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                            const day = date.getDate();
                            const value = x.increase_type === 'Percentage (%)' ? `+${x.value}%` : `+₹${x.value}`;
                            return (
                                <div className="list-item" key={i}>
                                    <div className="list-icon-circle gray">
                                        <span>{month}</span>
                                        <span className="icon-day">{day}</span>
                                    </div>
                                    <div className="list-info">
                                        <h4>{x.unit_number} • {x.effective_date}</h4>
                                        <p>{x.increase_type}</p>
                                    </div>
                                    <span className="text-success">{value}</span>
                                </div>
                            );
                        }) : (
                            <div className="list-item">No upcoming escalations</div>
                        )}

                    </div>

                </section>

            </main>
        </div>
    );
};

export default Dashboard;
