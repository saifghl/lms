import React from 'react';
import RepSidebar from './RepSidebar';
import './SearchFilters.css';

const SearchFilters = () => {
    // Mock Data for Results
    const results = [
        {
            id: 'P-1024',
            name: 'Sunset Apartments',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2535&auto=format&fit=crop',
            owner: 'kabir singh',
            status: 'Active',
            category: 'Lease',
            action: 'view'
        },
        {
            id: 'P-1045',
            name: 'Lakeside Commercial',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
            owner: 'Rabi Deshmukh',
            status: 'Active',
            category: 'Reporting',
            action: 'hide'
        },
        {
            id: 'P-1102',
            name: 'Downtown Lofts',
            image: 'https://images.unsplash.com/photo-1460317442991-0ec2aa5a398f?q=80&w=2696&auto=format&fit=crop',
            owner: 'Mahesh Pawar',
            status: 'Active',
            category: 'Property',
            action: 'view'
        },
        {
            id: 'P-1120',
            name: 'Oakwood Residence',
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop',
            owner: 'Rishi Singh',
            status: 'Approved',
            category: 'Lease',
            action: 'view'
        },
        {
            id: 'P-1155',
            name: 'Miami Bay Villa',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
            owner: 'Asdesh pawar',
            status: 'Expiring Soon',
            category: 'Lease',
            action: 'hide'
        }
    ];

    return (
        <div className="search-filters-container">
            <RepSidebar />
            <main className="search-filters-content">
                <div className="search-filters-header">
                    <h2>Search & Filters</h2>
                    <p>Find projects, units, tenants, and lease documents across your portfolio.</p>
                </div>

                <div className="big-search-bar">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="" />
                </div>

                <div className="advanced-filter-section">
                    <div className="filter-header">
                        <h3>Advanced Filter</h3>
                        <span className="reset-default">Reset Default</span>
                    </div>

                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>Project Name</label>
                            <input type="text" placeholder="e.g." />
                        </div>
                        <div className="filter-group">
                            <label>Owner Name</label>
                            <input type="text" placeholder="e.g." />
                        </div>
                        <div className="filter-group">
                            <label>Tenant Name</label>
                            <input type="text" placeholder="e.g." />
                        </div>
                        <div className="filter-group">
                            <label>Unit Number</label>
                            <input type="text" placeholder="e.g." />
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <input type="text" placeholder="e.g." />
                        </div>
                        <div className="filter-group">
                            <label>Lease dates</label>
                            <div className="date-inputs">
                                <input type="text" placeholder="e.g." />
                                <input type="text" placeholder="e.g." />
                            </div>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="btn-clear">clear</button>
                        <button className="btn-apply">Apply filters</button>
                    </div>
                </div>

                <div className="results-content">
                    <div className="results-header">
                        <h2>Results</h2>
                    </div>

                    <div className="results-table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Project Name</th>
                                    <th>Name /ID</th>
                                    <th>Status</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="project-cell">
                                                <img src={item.image} alt={item.name} className="project-img" />
                                                <div className="project-info">
                                                    <h4>{item.name}</h4>
                                                    <span className="project-id">ID: #{item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.owner}</td>
                                        <td><span className="status-text">{item.status}</span></td>
                                        <td>{item.category}</td>
                                        <td>
                                            {item.action === 'view' ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-area">
                        <span>Showing 1 to 5 of 42 results</span>
                        <div className="pagination-controls">
                            <div className="page-arrow">&lt;</div>
                            <div className="page-num active">1</div>
                            <div className="page-num">2</div>
                            <div className="page-num">3</div>
                            <div className="page-num">4</div>
                            <div className="page-num">5</div>
                            <div className="page-num">..</div>
                            <div className="page-num">42</div>
                            <div className="page-arrow">&gt;</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchFilters;
