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
                {/* Header with Search and Action Buttons */}
                <header className="dashboard-header">
                    <div className="search-bar">
                        {/* BACKEND: Implement search functionality */}
                        <input type="text" placeholder="Search properties, tenants..." />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn notification-btn" aria-label="Notifications">
                            {/* BACKEND: Fetch notification count */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </button>
                        {/* BACKEND: Link to New Lease creation workflow */}
                        <button className="primary-btn" onClick={() => navigate('/admin/leases')}>+ New Lease</button>
                    </div>
                </header>

                {/* Main Stats Grid - 6 Cards in a row */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Projects</h3>
                        <div className="stat-value">12</div>
                        <div className="stat-change positive">+2% vs last month</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,35 C10,35 15,20 25,25 S40,35 50,30 S65,15 80,20 S90,30 100,35" fill="none" stroke="#2ED573" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Units</h3>
                        <div className="stat-value">148</div>
                        <div className="stat-change negative">+5% vs last month</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,25 C10,35 20,35 30,25 S45,15 55,20 S70,35 85,25 S95,20 100,30" fill="none" stroke="#FF4757" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Owners</h3>
                        <div className="stat-value">45</div>
                        <div className="stat-change neutral">- 0% change</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,20 C15,15 25,35 40,25 S60,15 75,30 S90,20 100,25" fill="none" stroke="#2E66FF" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Tenants</h3>
                        <div className="stat-value">142</div>
                        <div className="stat-change warning">+3% vs last month</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,30 Q10,25 20,30 T40,20 T60,25 T80,15 T100,20" fill="none" stroke="#FFA502" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Leases</h3>
                        <div className="stat-value">138</div>
                        <div className="stat-change info">+4% vs last month</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,25 Q10,20 20,30 T40,15 T60,25 T80,10 T100,20" fill="none" stroke="#5352ED" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">$1.2M</div>
                        <div className="stat-change negative">+12% YTD</div>
                        <div className="mini-chart">
                            <svg width="100%" height="40" viewBox="0 0 100 40">
                                <path d="M0,35 Q10,25 20,35 T40,20 T60,30 T80,15 T100,25" fill="none" stroke="#FF4757" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Secondary Stats Row - Area Details (Occupied & Vacant) */}
                <section className="area-stats-container">
                    <div className="area-card">
                        <div className="area-info">
                            <h3>Area Occupied</h3>
                            <p>Average Rent Achieved: ₹57.20 per sq ft</p>
                        </div>
                        <div className="area-value-block">
                            <div className="area-value">245,000 sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>

                    <div className="area-card">
                        <div className="area-info">
                            <h3>Area Vacant</h3>
                            <p>Average Expected Rent: ₹53.82 per sq ft</p>
                        </div>
                        <div className="area-value-block">
                            <div className="area-value">42,000 sq ft</div>
                            <span>Super / Leasable Area</span>
                        </div>
                    </div>
                </section>

                {/* Revenue Trends Chart */}
                <section className="chart-section">
                    <div className="section-header">
                        <h2>
                            Revenue Trends
                            <span className="text-muted">Gross revenue across all properties</span>
                        </h2>
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
                            <line x1="0" y1="100" x2="1000" y2="100" stroke="#f0f0f0" />

                            <path d="M0,220 C100,210 200,180 300,190 S400,160 500,140 S700,120 800,130 S900,110 1000,100" fill="none" stroke="#3498db" strokeWidth="3" />
                            <path d="M0,240 C100,230 200,210 300,220 S400,200 500,190 S700,180 800,190 S900,170 1000,160" fill="none" stroke="#b2bec3" strokeWidth="2" strokeDasharray="5,5" />
                        </svg>
                        <div className="chart-labels">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                        </div>
                    </div>
                </section>

                {/* Lists Section - Renewals, Expiries, Escalations */}
                <section className="lists-container">
                    {/* Upcoming Renewals */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Renewals</h3>
                            <button>View All</button>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span>Nov</span>
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
                                <span>Dec</span>
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
                                <span>Dec</span>
                                <span className="icon-day">12</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 220 • Dec 12, 2024</h4>
                                <p>Star Bakery</p>
                            </div>
                            <span className="badge success">60 Days</span>
                        </div>
                    </div>

                    {/* Upcoming Expiries */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Upcoming Expiries</h3>
                            <button>View All</button>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span>Oct</span>
                                <span className="icon-day">31</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 402 • Nov 15, 2024</h4>
                                <p>James Logistics</p>
                            </div>
                            <span className="badge danger-pill">HIGH RISK</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span>Nov</span>
                                <span className="icon-day">05</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 105 • Dec 01, 2024</h4>
                                <p>TechCorp Inc</p>
                            </div>
                            <span className="badge warning-pill">MEDIUM</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle">
                                <span>Nov</span>
                                <span className="icon-day">20</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 220 • Dec 12, 2024</h4>
                                <p>Star Bakery</p>
                            </div>
                            <span className="badge success-pill">LOW</span>
                        </div>
                    </div>

                    {/* Rent Escalations */}
                    <div className="list-card">
                        <div className="list-header">
                            <h3>Rent Escalations</h3>
                            <button>View All</button>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span>JAN</span>
                                <span className="icon-day">01</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 402 • Nov 15, 2024</h4>
                                <p>CPI Adjustment</p>
                            </div>
                            <span className="text-success">+3.5%</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span>JAN</span>
                                <span className="icon-day">01</span>
                            </div>
                            <div className="list-info">
                                <h4>Unit 105 • Dec 01, 2024</h4>
                                <p>Fixed Increase</p>
                            </div>
                            <span className="text-success">+2.0%</span>
                        </div>
                        <div className="list-item">
                            <div className="list-icon-circle gray">
                                <span>FEB</span>
                                <span className="icon-day">01</span>
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