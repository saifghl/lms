import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './OwnerList.css';

const OwnerList = () => {
    const navigate = useNavigate();

    // Mock Data based on the screenshot
    const owners = [
        {
            id: 'OWN-001',
            name: 'Sunset Apartments',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
            phone: '+1 555-0123',
            email: 'john@example.com',
            gst: '22AAAAA0000A1Z5',
            area: '48,200',
            status: 'Verified',
            statusClass: 'verified'
        },
        {
            id: 'OWN-002',
            name: 'Jane Smith',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop',
            phone: '+1 555-0124',
            email: 'jane@example.com',
            gst: '22BBBB0000B1Z6',
            area: '11,750',
            status: 'Pending',
            statusClass: 'pending'
        },
        {
            id: 'OWN-003',
            name: 'Robert Brown',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop',
            phone: '+1 555-0125',
            email: 'robert@example.com',
            gst: '22CCCCC0000C1Z7',
            area: '34000',
            status: 'Rejected',
            statusClass: 'rejected'
        },
        {
            id: 'OWN-004',
            name: 'Emily White',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2588&auto=format&fit=crop',
            phone: '+1 555-0126',
            email: 'emily@example.com',
            gst: '22DDDDD0000D1Z8',
            area: '43650',
            status: 'Verified',
            statusClass: 'verified'
        }
    ];

    return (
        <div className="owner-list-container">
            <Sidebar />
            <main className="owner-content">
                <div className="breadcrumb">HOME &gt; OWNER LIST</div>

                <header className="owner-header">
                    <div className="owner-title">
                        <h2>Owner List</h2>
                        <p>Manage and track all property owners in the system.</p>
                    </div>
                    <button className="btn-add-owner" onClick={() => navigate('/admin/owner/add')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Owner
                    </button>
                </header>

                <div className="filter-bar">
                    <div className="search-area">
                        <svg className="search-icon-input" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search by name, email or mobile..." />
                    </div>

                    <div className="filter-actions">
                        <button className="clear-filters" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', color: 'inherit' }}>Clear filters</button>
                        <div className="view-toggle">
                            <button className="toggle-btn active">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                            <button className="toggle-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="owner-table-container">
                    <div className="owner-table-header">
                        <div>Owner Name</div>
                        <div>Contact Info</div>
                        <div>GST No</div>
                        <div>Total Area (sq ft)</div>
                        <div>KYC Status</div>
                        <div>Actions</div>
                    </div>

                    {owners.map((owner, index) => (
                        <div className="owner-row" key={index}>
                            <div className="owner-info-col">
                                <img src={owner.image} alt={owner.name} className="owner-avatar" />
                                <div className="owner-details">
                                    <h4>{owner.name}</h4>
                                    <span className="owner-id">ID: #{owner.id}</span>
                                </div>
                            </div>

                            <div className="contact-info-col">
                                <div className="contact-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    {owner.phone}
                                </div>
                                <div className="contact-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    {owner.email}
                                </div>
                            </div>

                            <div className="gst-col">{owner.gst}</div>

                            <div className="area-col">{owner.area}</div>

                            <div>
                                <span className={`kyc-badge ${owner.statusClass}`}>{owner.status}</span>
                            </div>

                            <div className="actions-col">
                                <button className="action-icon-btn" title="View" onClick={() => navigate(`/admin/owner/${owner.id}`)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                                <button className="action-icon-btn" title="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button className="action-icon-btn" title="Delete">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="table-footer">
                    <span>Showing 1 to 4 of 12 results</span>
                    <div className="pagination">
                        <span className="page-arrow">&lt;</span>
                        <span className="page-item active">1</span>
                        <span className="page-item">2</span>
                        <span className="page-item">3</span>
                        <span className="page-item">4</span>
                        <span className="page-item">5</span>
                        <span>...</span>
                        <span className="page-item">12</span>
                        <span className="page-arrow">&gt;</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default OwnerList;
