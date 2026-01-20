import React, { useEffect, useState } from "react";
import RepSidebar from "../management-rep/RepSidebar";
import "./leaseManagement.css";
import { leaseAPI } from "../../services/api";

const LeaseTracker = () => {
    const [stats, setStats] = useState({
        expiring_90_days: 0,
        renewals_pending: 0,
        escalation_due: 0,
        lock_in_ending: 0
    });
    const [leases, setLeases] = useState([]);

    useEffect(() => {
        leaseAPI.getLeaseTrackerStats().then(res => setStats(res.data)).catch(console.error);
        leaseAPI.getAllLeases({ status: 'active' }).then(res => setLeases(res.data)).catch(console.error);
    }, []);

    const calculateProgress = (start, end) => {
        const total = new Date(end) - new Date(start);
        const elapsed = new Date() - new Date(start);
        const percent = (elapsed / total) * 100;
        return Math.min(Math.max(percent, 0), 100);
    };

    return (
        <div className="dashboard-container">
            <RepSidebar />
            <main className="main-content lease-tracker">
                <header className="page-header">
                    <div>
                        <h1>Lease Tracker</h1>
                        <p>Monitor lease lifecycles and key milestones visually.</p>
                    </div>
                </header>

                {/* Tracker Stats */}
                <div className="tracker-stats">
                    <div className="tracker-stat-card">
                        <h3>Expiring (90 days)</h3>
                        <div className="value">{stats.expiring_90_days}</div>
                    </div>
                    <div className="tracker-stat-card">
                        <h3>Renewals pending</h3>
                        <div className="value">{stats.renewals_pending}</div>
                    </div>
                    <div className="tracker-stat-card">
                        <h3>Escalation Due</h3>
                        <div className="value">{stats.escalation_due}</div>
                    </div>
                    <div className="tracker-stat-card">
                        <h3>Lock-in ending</h3>
                        <div className="value">{stats.lock_in_ending}</div>
                    </div>
                </div>

                {/* Visual Tracker List */}
                <div className="visual-tracker-list">
                    <h3>Active Lease Progression</h3>
                    {leases.map((lease, i) => (
                        <div className="visual-lease-card" key={i}>
                            <div className="lease-info">
                                <h4>{lease.tenant_name} <span className="text-muted">({lease.unit_number})</span></h4>
                                <div className="dates">
                                    <span>Start: {new Date(lease.lease_start).toLocaleDateString()}</span>
                                    <span>End: {new Date(lease.lease_end).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${calculateProgress(lease.lease_start, lease.lease_end)}%` }}></div>
                                <div className="marker start" style={{ left: '0%' }}>Start</div>
                                <div className="marker lockin" style={{ left: '30%' }}>Lock-in</div>
                                <div className="marker end" style={{ left: '100%' }}>End</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default LeaseTracker;
