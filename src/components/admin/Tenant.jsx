import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Tenant.css';

const Tenant = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddTenant = () => {
        navigate('/admin/tenant/add');
    };

    useEffect(() => {
        fetchTenants();
        // eslint-disable-next-line
    }, [search]);

    const fetchTenants = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            const res = await fetch(
                `http://localhost:5000/api/tenants?search=${search}`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {}
                }
            );

            const text = await res.text(); // 🔴 IMPORTANT
            console.log('Tenant API RAW response:', text);

            if (!res.ok) {
                throw new Error(text || 'Failed to fetch tenants');
            }

            const data = JSON.parse(text);
            setTenants(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error('Fetch tenants error:', err);
            setTenants([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tenant-container">
            <Sidebar />

            <main className="tenant-content">
                <div className="breadcrumb">HOME &gt; TENANT</div>

                <header className="tenant-header">
                    <div className="tenant-title">
                        <h2>Tenant List</h2>
                        <p>Manage and view all registered tenants and their current status.</p>
                    </div>

                    <button className="add-tenant-btn" onClick={handleAddTenant}>
                        + Add Tenants
                    </button>
                </header>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search Tenant by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <section className="tenant-table-container">
                    <div className="tenant-table-header">
                        <div>Tenant Name</div>
                        <div>Contact</div>
                        <div>Email</div>
                        <div>Area Occupied</div>
                        <div style={{ textAlign: 'center' }}>Actions</div>
                    </div>

                    {loading && <p style={{ padding: 20 }}>Loading...</p>}

                    {!loading && tenants.length === 0 && (
                        <p style={{ padding: 20 }}>No tenants found</p>
                    )}

                    {tenants.map((tenant) => (
                        <div className="tenant-row" key={tenant.id}>
                            <div>
                                <h4>{tenant.company_name}</h4>
                                <span>ID: TN-{tenant.id}</span>
                            </div>
                            <div>{tenant.contact_person_phone}</div>
                            <div>{tenant.contact_person_email}</div>
                            <div>{tenant.area_occupied || 0} sqft</div>
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => navigate(`/admin/tenant/${tenant.id}`)}>
                                    👁
                                </button>

                                <button className="action-icon-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>

                                <button onClick={() => navigate(`/admin/tenant/edit/${tenant.id}`)}>
                                    ✏️

                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Tenant;
