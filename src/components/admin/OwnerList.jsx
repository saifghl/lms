import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './OwnerList.css';
import { ownerAPI } from '../../services/api';

const ITEMS_PER_PAGE = 4;

const OwnerList = () => {
    const navigate = useNavigate();

    const [owners, setOwners] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    /* =====================
       FETCH OWNERS
    ====================== */
    useEffect(() => {
        ownerAPI.getAll()
            .then(res => setOwners(res.data))
            .catch(err => {
                console.error('Error fetching owners:', err);
                setOwners([]);
            });
    }, []);

    /* =====================
       SEARCH FILTER
    ====================== */
    const filteredOwners = owners.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search)
    );

    /* =====================
       PAGINATION
    ====================== */
    const totalPages = Math.ceil(filteredOwners.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOwners = filteredOwners.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    /* =====================
       DELETE OWNER
    ====================== */
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this owner?'
        );
        if (!confirmDelete) return;

        try {
            await ownerAPI.delete(id);
            setOwners(prev => prev.filter(o => o.id !== id));
        } catch (err) {
            alert('Failed to delete owner');
        }
    };

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

                    <button
                        className="btn-add-owner"
                        onClick={() => navigate('/admin/owner/add')}
                    >
                        + Add Owner
                    </button>
                </header>

                {/* SEARCH */}
                <div className="filter-bar">
                    <div className="search-area">
                        <input
                            type="text"
                            placeholder="Search by name, email or mobile..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="owner-table-container">
                    <div className="owner-table-header">
                        <div>Owner Name</div>
                        <div>Contact Info</div>
                        <div>GST No</div>
                        <div>Total Area (sq ft)</div>
                        <div>Actions</div>
                    </div>

                    {paginatedOwners.map(owner => (
                        <div className="owner-row" key={owner.id}>
                            <div className="owner-info-col">
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt={owner.name}
                                    className="owner-avatar"
                                />
                                <div className="owner-details">
                                    <h4>{owner.name}</h4>
                                    <span>ID: #{owner.id}</span>
                                </div>
                            </div>

                            <div className="contact-info-col">
                                <div>{owner.phone}</div>
                                <div>{owner.email}</div>
                            </div>

                            <div className="gst-col">
                                {owner.gst_number || 'N/A'}
                            </div>

                            <div className="area-col">
                                {owner.total_owned_area}
                            </div>

                            {/* ✅ ICON ACTIONS */}
                            <div className="actions-col">
                                <button
                                    className="action-icon view"
                                    onClick={() =>
                                        navigate(`/admin/owner/${owner.id}`)
                                    }
                                    title="View"
                                >
                                    👁
                                </button>
                                <button className="action-icon-btn" title="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>

                                <button
                                    className="action-icon delete"
                                    onClick={() => handleDelete(owner.id)}
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <footer className="table-footer">
                    <span>
                        Showing {startIndex + 1} to{' '}
                        {Math.min(startIndex + ITEMS_PER_PAGE, filteredOwners.length)} of{' '}
                        {filteredOwners.length} results
                    </span>

                    <div className="pagination">
                        <span
                            className="page-arrow"
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        >
                            &lt;
                        </span>

                        {[...Array(totalPages)].map((_, i) => (
                            <span
                                key={i}
                                className={`page-item ${
                                    currentPage === i + 1 ? 'active' : ''
                                }`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </span>
                        ))}

                        <span
                            className="page-arrow"
                            onClick={() =>
                                setCurrentPage(p => Math.min(p + 1, totalPages))
                            }
                        >
                            &gt;
                        </span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default OwnerList;
