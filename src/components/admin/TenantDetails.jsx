import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './TenantDetails.css';

const TenantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTenant = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/tenants/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch tenant');

            const data = await res.json();
            setTenant(data);
        } catch (err) {
            console.error(err);
            setTenant(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTenant();
        }
    }, [id]);


    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
    if (!tenant) return <p style={{ padding: 20 }}>Tenant not found</p>;

    return (
        <div className="tenant-details-container">
            <Sidebar />
            <main className="tenant-details-content">
                <div className="breadcrumb">
                    <Link to="/admin/tenant">TENANT LIST</Link> &gt; DETAILS
                </div>

                <div className="tenant-header-card">
                    <h2>{tenant.company_name}</h2>
                    <span>ID: TN-{tenant.id}</span>
                    <button onClick={() => navigate(`/admin/tenant/edit/${tenant.id}`)}>Edit</button>
                </div>

                <section className="info-card">
                    <h3>Corporate Info</h3>
                    <p>Email: {tenant.contact_person_email}</p>
                    <p>Phone: {tenant.contact_person_phone}</p>
                    <p>Industry: {tenant.industry}</p>
                    <p>Area Occupied: {tenant.area_occupied} sqft</p>
                </section>

                <section className="info-card">
                    <h3>Registered Address</h3>
                    <p>
                        {tenant.street_address}, {tenant.city}, {tenant.state},{" "}
                        {tenant.country} - {tenant.zip_code}
                    </p>
                </section>

                <section className="info-card">
                    <h3>Subtenants</h3>

                    {tenant.subtenants?.length === 0 && <p>No subtenants</p>}

                    {tenant.subtenants?.map((st, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                            <strong>{st.company_name}</strong>
                            <div>{st.contact_person_name}</div>
                            <div>{st.contact_person_email}</div>
                            <div>{st.allotted_area_sqft} sqft</div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default TenantDetails;
