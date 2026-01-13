import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RepSidebar from './RepSidebar';
import './RepDashboard.css';
import { managementAPI } from '../../services/api';

const RepDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await managementAPI.getDashboardStats();
                setStats(res.data.data || res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Mock Sparklines (simplified as SVG paths) - keeping for visual consistency
    const sparks = {
        green: "M0 20 L5 18 L10 22 L15 15 L20 18 L25 10 L30 15 L35 5 L40 10",
        red: "M0 10 L5 15 L10 12 L15 18 L20 15 L25 22 L30 18 L35 25 L40 20",
        blue: "M0 15 L5 15 L10 18 L15 12 L20 15 L25 15 L30 10 L35 12 L40 8"
    };

    return (
        <div className="rep-dashboard-container">
            <RepSidebar />
            <main className="main-content">

                {/* Header */}
                <div className="rep-header">
                    <div className="rep-title-section">
                        <h1>Dashboard</h1>
                        <p>Overview of lease operation and performance metrics</p>
                    </div>
                    <div className="rep-header-actions">
                        <button className="date-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            This Month
                        </button>
                        <button className="export-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Export Report
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Loading dashboard data...</div>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <div className="metrics-grid">
                            <MetricCard
                                title="Total Projects"
                                value={stats?.metrics?.totalProjects?.value || 0}
                                change={stats?.metrics?.totalProjects?.change || "0%"}
                                spark={sparks.green}
                                type={stats?.metrics?.totalProjects?.type || "neutral"}
                            />
                            <MetricCard
                                title="Total Units"
                                value={stats?.metrics?.totalUnits?.value || 0}
                                change={stats?.metrics?.totalUnits?.change || "0%"}
                                spark={sparks.red}
                                type={stats?.metrics?.totalUnits?.type || "neutral"}
                            />
                            <MetricCard
                                title="Total Owners"
                                value={stats?.metrics?.totalOwners?.value || 0}
                                change={stats?.metrics?.totalOwners?.change || "0%"}
                                spark={sparks.blue}
                                type={stats?.metrics?.totalOwners?.type || "neutral"}
                            />
                            <MetricCard
                                title="Total Tenants"
                                value={stats?.metrics?.totalTenants?.value || 0}
                                change={stats?.metrics?.totalTenants?.change || "0%"}
                                spark={sparks.green}
                                type={stats?.metrics?.totalTenants?.type || "neutral"}
                            />
                            <MetricCard
                                title="Total Leases"
                                value={stats?.metrics?.totalLeases?.value || 0}
                                change={stats?.metrics?.totalLeases?.change || "0%"}
                                spark={sparks.blue}
                                type={stats?.metrics?.totalLeases?.type || "neutral"}
                            />
                            <MetricCard
                                title="Total Revenue"
                                value={stats?.metrics?.totalRevenue?.value || "₹0"}
                                change={stats?.metrics?.totalRevenue?.change || "0%"}
                                spark={sparks.red}
                                type={stats?.metrics?.totalRevenue?.type || "neutral"}
                            />
                        </div>

                        {/* Revenue Trends Chart */}
                        <div className="chart-section">
                            <div className="section-header">
                                <h3>Revenue Trends</h3>
                                <span className="section-subtitle">Gross revenue across all properties</span>
                            </div>
                            <div className="chart-placeholder">
                                {/* Mock Chart Visualization */}
                                <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                                    {/* Grid Lines */}
                                    <line x1="0" y1="250" x2="1000" y2="250" stroke="#edf2f7" strokeWidth="1" />
                                    <line x1="0" y1="150" x2="1000" y2="150" stroke="#edf2f7" strokeWidth="1" />
                                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#edf2f7" strokeWidth="1" />

                                    {/* Trend Line */}
                                    <path d="M0 250 Q 80 200, 160 220 T 320 180 T 480 150 T 640 100 T 800 120 T 960 80"
                                        fill="none" stroke="#3182ce" strokeWidth="3" />

                                    {/* Area under curve */}
                                    <path d="M0 250 Q 80 200, 160 220 T 320 180 T 480 150 T 640 100 T 800 120 T 960 80 V 300 H 0 Z"
                                        fill="rgba(49, 130, 206, 0.05)" />
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Lists */}
                        <div className="lists-grid">
                            <ListSection title="Upcoming Renewals" viewAllLink="#">
                                {stats?.upcomingRenewals?.length > 0 ? (
                                    stats.upcomingRenewals.map(item => (
                                        <ListItem
                                            key={item.id}
                                            date={new Date(item.date).getDate()}
                                            month={new Date(item.date).toLocaleString('default', { month: 'short' })}
                                            title={`${item.unit} • ${new Date(item.date).toLocaleDateString()}`}
                                            subtitle={item.tenant}
                                        />
                                    ))
                                ) : (
                                    <p className="no-data">No upcoming renewals</p>
                                )}
                            </ListSection>

                            <ListSection title="Upcoming Expires" viewAllLink="#">
                                {stats?.upcomingExpiries?.length > 0 ? (
                                    stats.upcomingExpiries.map(item => (
                                        <ListItem
                                            key={item.id}
                                            date={new Date(item.date).getDate()}
                                            month={new Date(item.date).toLocaleString('default', { month: 'short' })}
                                            title={`${item.unit} • ${new Date(item.date).toLocaleDateString()}`}
                                            subtitle={item.tenant}
                                        />
                                    ))
                                ) : (
                                    <p className="no-data">No upcoming expiries</p>
                                )}
                            </ListSection>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

const MetricCard = ({ title, value, change, spark, type }) => (
    <div className="metric-card">
        <span className="metric-label">{title}</span>
        <span className="metric-value">{value}</span>
        <span className={`metric-change ${type}`}>
            {type === 'positive' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            )}
            {type === 'negative' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            )}
            {change}
        </span>
        <div className="sparkline-container">
            <svg className="sparkline" viewBox="0 0 40 30" preserveAspectRatio="none">
                <path d={spark} fill="none" stroke={type === 'positive' ? '#38a169' : type === 'negative' ? '#e53e3e' : '#3182ce'} strokeWidth="2" />
            </svg>
        </div>
    </div>
);

const ListSection = ({ title, viewAllLink, children }) => (
    <div className="dashboard-list-card">
        <div className="list-header">
            <h3>{title}</h3>
            <Link to={viewAllLink} className="view-all">View All</Link>
        </div>
        <div className="list-items">
            {children}
        </div>
    </div>
);

const ListItem = ({ date, month, title, subtitle }) => (
    <div className="list-item">
        <div className="date-badge">
            <span className="month">{month}</span>
            <span className="day">{date}</span>
        </div>
        <div className="item-details">
            <span className="item-title">{title}</span>
            <span className="item-subtitle">{subtitle}</span>
        </div>
    </div>
);

export default RepDashboard;
