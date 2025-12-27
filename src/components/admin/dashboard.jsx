import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './dashboard.css';

const Dashboard = () => {
    // BACKEND: Fetch dashboard data (stats, charts, lists) here
    // const { stats, revenueData, renewals, expiries, escalations } = useDashboardData();

    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="dashboard-header">
                    <div className="search-bar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        {/* BACKEND: Implement search functionality */}
                        <input type="text" placeholder="Search properties, tenants..." />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn notification-btn">
                            {/* BACKEND: Fetch notification count */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        </button>
                        {/* BACKEND: Link to New Lease creation workflow */}
                        <button className="primary-btn" onClick={() => navigate('/admin/leases')}>+ New Lease</button>
                    </div>
                </header>

                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Projects</h3>
                        <div className="stat-value">12</div>
                        <div className="stat-change positive">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            +2% vs last month
                        </div>
                        <div className="mini-chart green">
                            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path mc_style="fill:none;stroke:#00b894;stroke-width:2" d="M0,25 Q10,20 20,25 T40,15 T60,20 T80,10 T100,5" fill="none" stroke="#00b894" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Units</h3>
                        <div className="stat-value">148</div>
                        <div className="stat-change positive">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            +5% vs last month
                        </div>
                        <div className="mini-chart red">
                            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0,20 Q10,25 20,20 T40,15 T60,25 T80,15 T100,20" fill="none" stroke="#ff7675" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Owners</h3>
                        <div className="stat-value">45</div>
                        <div className="stat-change neutral">- 0% change</div>
                        <div className="mini-chart blue">
                            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0,15 Q25,15 50,15 T100,15" fill="none" stroke="#0984e3" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Tenants</h3>
                        <div className="stat-value">142</div>
                        <div className="stat-change negative">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                            -3% vs last month
                        </div>
                        <div className="mini-chart purple">
                            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0,10 Q10,15 20,10 T40,20 T60,10 T80,15 T100,5" fill="none" stroke="#6c5ce7" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <Link to="/admin/leases" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="stat-card">
                            <h3>Total Leases</h3>
                            <div className="stat-value">138</div>
                            <div className="stat-change positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                +4% vs last month
                            </div>
                            <div className="mini-chart purple">
                                <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                    <path d="M0,20 Q10,15 20,20 T40,10 T60,15 T80,5 T100,15" fill="none" stroke="#6c5ce7" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">$1.2M</div>
                        <div className="stat-change positive">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            -12% YTD
                        </div>
                        <div className="mini-chart red">
                            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0,25 Q10,20 20,25 T40,10 T60,15 T80,5 T100,10" fill="none" stroke="#ff7675" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Secondary Stats Row (Area details) */}
                <section className="secondary-stats-row">
                    <div className="secondary-stat-card">
                        <div className="sec-stat-info">
                            <h3>Area Occupied</h3>
                            <p>Average Rent Achieved: ₹57.20 per sq ft</p>
                        </div>
                        <div className="sec-stat-value">
                            245,000 sq ft
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="secondary-stat-card">
                        <div className="sec-stat-info">
                            <h3>Area Vacant</h3>
                            <p>Average Expected Rent: ₹53.82 per sq ft</p>
                        </div>
                        <div className="sec-stat-value">
                            42,000 sq ft
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="secondary-stat-card">
                        <div className="sec-stat-info">
                            <h3>Total Leasable</h3>
                            <p>Total Area across all properties</p>
                        </div>
                        <div className="sec-stat-value">
                            287,000 sq ft
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>
                </section>

                <div className="dashboard-content-split">
                    <section className="chart-section">
                        <div className="section-header">
                            <h2>Revenue Trends <span className="text-muted">Gross revenue across all properties</span></h2>
                            <div className="chart-legend">
                                <span className="legend-item"><span className="dot current"></span> This year</span>
                                <span className="legend-item"><span className="dot last"></span> Last year</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            {/* BACKEND: Integrate charting library (e.g. Recharts) with real data here */}
                            <svg viewBox="0 0 1000 300" className="mock-chart">
                                <line x1="0" y1="250" x2="1000" y2="250" stroke="#f0f0f0" />
                                <line x1="0" y1="200" x2="1000" y2="200" stroke="#f0f0f0" />
                                <line x1="0" y1="150" x2="1000" y2="150" stroke="#f0f0f0" />

                                <path d="M0,220 C100,210 200,180 300,190 S400,160 500,140 S700,120 800,130 S900,110 1000,100" fill="none" stroke="#3498db" strokeWidth="3" />
                                <path d="M0,240 C100,230 200,210 300,220 S400,200 500,190 S700,180 800,190 S900,170 1000,160" fill="none" stroke="#b2bec3" strokeWidth="2" strokeDasharray="5,5" />
                            </svg>
                            <div className="chart-labels">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="lists-container">
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Renewals</h3>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>
                        {/* BACKEND: Map through upcomingRenewals data */}
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Nov</span>
                                <span className="icon-day">15</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 402 • Nov 15, 2024</h4>
                                <p>James Logistics</p>
                            </div>
                            <span className="badge warning">30 Days</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Dec</span>
                                <span className="icon-day">01</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 105 • Dec 01, 2024</h4>
                                <p>TechCorp Inc</p>
                            </div>
                            <span className="badge success">45 Days</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Dec</span>
                                <span className="icon-day">12</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 220 • Dec 12, 2024</h4>
                                <p>Star Bakery</p>
                            </div>
                            <span className="badge success">60 Days</span>
                        </div>
                    </div>

                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>
                        {/* BACKEND: Map through upcomingExpiries data */}
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Nov</span>
                                <span className="icon-day">15</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 403 • Nov 15, 2024</h4>
                                <p>James Logistics</p>
                            </div>
                            <span className="badge danger-pill">Expired</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Dec</span>
                                <span className="icon-day">01</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 105 • Dec 01, 2024</h4>
                                <p>TechCorp Inc</p>
                            </div>
                            <span className="badge warning-pill">Medium</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span className="icon-text">Dec</span>
                                <span className="icon-day">12</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 220 • Dec 12, 2024</h4>
                                <p>Star Bakery</p>
                            </div>
                            <span className="badge success-pill">Low</span>
                        </div>
                    </div>

                    <div className="list-card">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>View All</button>
                        </div>
                        {/* BACKEND: Map through rentEscalations data */}
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span className="icon-initial">CPI</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 402 • Nov 15, 2024</h4>
                                <p>CPI Adjustment</p>
                            </div>
                            <span className="text-success">+5.0%</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span className="icon-initial">FI</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 105 • Dec 01, 2024</h4>
                                <p>Fixed Increase</p>
                            </div>
                            <span className="text-success">+2.0%</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span className="icon-initial">MR</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 220 • Dec 12, 2024</h4>
                                <p>Market Review</p>
                            </div>
                            <span className="text-success">+5.0%</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
