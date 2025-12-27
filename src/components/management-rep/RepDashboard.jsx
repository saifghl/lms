import React from 'react';
import RepSidebar from './RepSidebar';
import './RepDashboard.css';

const RepDashboard = () => {
    // Mock Data for the chart
    const revenueData = [30, 45, 35, 50, 40, 60, 55, 65, 78, 72, 85, 90];

    // Mock Sparklines (simplified as SVG paths)
    const sparks = {
        green: "M0 20 L5 18 L10 22 L15 15 L20 18 L25 10 L30 15 L35 5 L40 10",
        red: "M0 10 L5 15 L10 12 L15 18 L20 15 L25 22 L30 18 L35 25 L40 20",
        blue: "M0 15 L5 15 L10 18 L15 12 L20 15 L25 15 L30 10 L35 12 L40 8"
    };

    return (
        <div className="dashboard-container">
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
                            Oct 2023 - 2024
                        </button>
                        <button className="export-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="metrics-grid">
                    <MetricCard title="Total Projects" value="12" change="+2% vs last month" spark={sparks.green} type="positive" />
                    <MetricCard title="Total Units" value="148" change="+5% vs last month" spark={sparks.red} type="negative" />
                    <MetricCard title="Total Owners" value="45" change="~ 0% change" spark={sparks.blue} type="neutral" />
                    <MetricCard title="Total Tenants" value="142" change="+3% vs last month" spark={sparks.green} type="positive" />
                    <MetricCard title="Total Leases" value="138" change="+4% vs last month" spark={sparks.blue} type="positive" />
                    <MetricCard title="Total Revenue" value="₹1.2M" change="+12% YTD" spark={sparks.red} type="negative" />
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
                        <ListItem date="15" month="Nov" title="Unit 402 • Nov 15, 2024" subtitle="James Logistics" badge="30 Days" badgeType="warning" />
                        <ListItem date="01" month="Dec" title="Unit 105 • Dec 01, 2024" subtitle="TechCorp Inc" badge="45 Days" badgeType="success" />
                        <ListItem date="12" month="Dec" title="Unit 220 • Dec 12, 2024" subtitle="Star Bakery" badge="60 Days" badgeType="success" />
                    </ListSection>

                    <ListSection title="Upcoming Expires" viewAllLink="#">
                        <ListItem date="15" month="Nov" title="Unit 402 • Nov 15, 2024" subtitle="James Logistics" badge="HIGH RISK" badgeType="danger" />
                        <ListItem date="01" month="Dec" title="Unit 105 • Dec 01, 2024" subtitle="TechCorp Inc" badge="MEDIUM" badgeType="warning" />
                        <ListItem date="12" month="Dec" title="Unit 220 • Dec 12, 2024" subtitle="Star Bakery" badge="LOW" badgeType="success" />
                    </ListSection>

                    <ListSection title="Rent Escalations" viewAllLink="#">
                        <ListItem date="15" month="Jan" title="Unit 402 • Nov 15, 2024" subtitle="CPI Adjustment" badge="+3.5%" badgeType="success" bgType="neutral" />
                        <ListItem date="01" month="Jan" title="Unit 105 • Dec 01, 2024" subtitle="Fixed Increase" badge="+2.0%" badgeType="success" bgType="neutral" />
                        <ListItem date="01" month="Feb" title="Unit 220 • Dec 12, 2024" subtitle="Market Review" badge="+5.0%" badgeType="success" bgType="neutral" />
                    </ListSection>
                </div>

            </main>
        </div>
    );
};

const MetricCard = ({ title, value, change, spark, type }) => (
    <div className="metric-card">
        <span className="metric-label">{title}</span>
        <span className="metric-value">{value}</span>
        <span className={`metric-change ${type}`}>{change}</span>
        <svg className="sparkline" viewBox="0 0 40 30" preserveAspectRatio="none">
            <path d={spark} fill="none" stroke={type === 'positive' ? '#38a169' : type === 'negative' ? '#e53e3e' : '#3182ce'} strokeWidth="2" />
        </svg>
    </div>
);

const ListSection = ({ title, viewAllLink, children }) => (
    <div className="dashboard-list-card">
        <div className="list-header">
            <h3>{title}</h3>
            <a href={viewAllLink} className="view-all">View All</a>
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
