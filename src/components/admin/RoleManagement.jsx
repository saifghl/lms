import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './RoleManagement.css';

const RoleManagement = () => {
    // Mock Data based on the screenshot
    const users = [
        {
            id: 1,
            name: 'David Ross',
            email: 'd.ross@estateadmin.com',
            role: 'Data Entry',
            roleClass: 'data-entry',
            access: { lease: true, fin: false, maint: false }, // "All" is simulated by just one toggle active in UI or custom logic
            isAll: true,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Sarah Jenkins',
            email: 'sarah.j@estateadmin.com',
            role: 'Administrator',
            roleClass: 'admin',
            access: { lease: true, fin: false, maint: true },
            status: 'Active'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'm.chen@estateadmin.com',
            role: 'Lease Manager',
            roleClass: 'lease-mgr',
            access: { lease: true, fin: false, maint: false },
            status: 'Inactive'
        },
        {
            id: 4,
            name: 'Emma Wilson',
            email: 'e.wilson@estateadmin.com',
            role: 'Management Rep',
            roleClass: 'management-rep',
            access: { lease: true, fin: true, maint: false },
            status: 'Active'
        }
    ];

    return (
        <div className="role-management-container">
            <Sidebar />

            {/* Top Search Bar Mock (Visual only to match design placement) */}
            <div className="top-search-bar">
                <div className="search-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search users by name, role..." />
                </div>
            </div>

            <main className="role-content">
                <header className="role-header">
                    <div className="role-title">
                        <h2>Role Management</h2>
                        <p>Manage user access, assign roles, and configure module permissions.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-filter">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Filters
                        </button>
                        <Link to="/admin/create-user" className="btn-create">
                            + Create New User
                        </Link>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-grid">
                    <div className="stats-card">
                        <h3>Total Users</h3>
                        <div className="stat-value">124</div>
                    </div>
                    <div className="stats-card">
                        <h3>Active Administrators</h3>
                        <div className="stat-value">4</div>
                    </div>
                    <div className="stats-card">
                        <h3>Lease Managers</h3>
                        <div className="stat-value">18</div>
                    </div>
                    <div className="stats-card">
                        <h3>Pending Invites</h3>
                        <div className="stat-value">2</div>
                    </div>
                </section>

                {/* Users Table */}
                <section className="role-table-container">
                    <div className="role-table-header">
                        <div className="checkbox-wrapper"></div> {/* Header Checkbox placeholder */}
                        <div>User Info</div>
                        <div>Role</div>
                        <div>Module Access</div>


                    </div>

                    {users.map(user => (
                        <div className="user-row" key={user.id}>
                            <div className="checkbox-wrapper">
                                <div className="role-row-bullet"></div>
                            </div>

                            <div className="user-info">
                                <img
                                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                                    alt={user.name}
                                    className="user-avatar"
                                />
                                <div className="user-details">
                                    <h4>{user.name}</h4>
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div>
                                <span className={`role-badge ${user.roleClass}`}>{user.role}</span>
                            </div>

                            <div className="module-access">
                                {user.isAll ? (
                                    <div className="toggle-group">
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider"></span>
                                        </label>
                                        <span className="toggle-label">All</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="toggle-group">
                                            <label className="switch">
                                                <input type="checkbox" defaultChecked={user.access.lease} />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="toggle-label">Lease</span>
                                        </div>
                                        <div className="toggle-group">
                                            <label className="switch">
                                                <input type="checkbox" defaultChecked={user.access.fin} />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="toggle-label">Finance</span>
                                        </div>
                                        <div className="toggle-group">
                                            <label className="switch">
                                                <input type="checkbox" defaultChecked={user.access.maint} />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="toggle-label">Maintenance</span>
                                        </div>
                                    </>
                                )}
                            </div>




                        </div>
                    ))}
                </section>

                <footer className="table-footer">
                    <span>Showing 1–4 of 124 users</span>
                    <div className="pagination">
                        <span className="page-arrow">&lt;</span>
                        <span className="page-item active">1</span>
                        <span className="page-item">2</span>
                        <span className="page-item">3</span>
                        <span className="page-item">4</span>
                        <span className="page-item">5</span>
                        <span>...</span>
                        <span className="page-item">124</span>
                        <span className="page-arrow">&gt;</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default RoleManagement;
