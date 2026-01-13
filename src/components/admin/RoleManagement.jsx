import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./RoleManagement.css";
// import api from services
import { userAPI } from "../../services/api";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Create User State
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_name: "User"
  });

  const fetchUsers = () => {
    userAPI.getUsers()
      .then(res => {
        const data = res.data;
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role_name,
          roleClass: user.role_name?.toLowerCase().replace(/\s+/g, "-"),
          isAll: ["admin", "administrator", "super admin"]
            .includes(user.role_name?.toLowerCase()),
          status: (user.status || "active").toLowerCase()
        }));

        setUsers(formattedUsers);
      })
      .catch(err => console.error("Failed to load users", err));
  };

  /* =============================
     LOAD USERS FROM DATABASE
  ============================== */
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.createUser(newUser);
      alert("User created successfully");
      setShowModal(false);
      setNewUser({ first_name: "", last_name: "", email: "", password: "", role_name: "User" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to create user";
      alert(msg);
    }
  };

  /* =============================
     SEARCH FILTER
  ============================== */
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="role-management-container">
      <Sidebar />

      {/* SEARCH BAR */}
      <div className="top-search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <main className="role-content">

        {/* HEADER */}
        <header className="role-header">
          <div className="role-title">
            <h2>Role Management</h2>
            <p>Manage user access, assign roles, and configure module permissions.</p>
          </div>

          <button className="create-user-btn" onClick={() => setShowModal(true)}>
            + Create New User
          </button>
        </header>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '20px', borderRadius: '8px', minWidth: '400px'
            }}>
              <h3>Create New User</h3>
              <form onSubmit={handleCreateUser}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={newUser.first_name}
                  onChange={e => setNewUser({ ...newUser, first_name: e.target.value })}
                  required
                  style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px", boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newUser.last_name}
                  onChange={e => setNewUser({ ...newUser, last_name: e.target.value })}
                  required
                  style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px", boxSizing: 'border-box' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px", boxSizing: 'border-box' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px", boxSizing: 'border-box' }}
                />
                <select
                  value={newUser.role_name}
                  onChange={e => setNewUser({ ...newUser, role_name: e.target.value })}
                  style={{ display: "block", width: "100%", marginBottom: "20px", padding: "8px", boxSizing: 'border-box' }}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Lease Manager">Lease Manager</option>
                  <option value="Manager">Manager</option>
                </select>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: '4px', cursor: 'pointer' }}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✅ STATS SECTION */}
        <section className="stats-grid">
          <div className="stats-card">
            <h3>Total Users</h3>
            <div className="stat-value">{users.length}</div>
          </div>

          <div className="stats-card">
            <h3>Active Administrators</h3>
            <div className="stat-value">
              {users.filter(
                u => u.role?.toLowerCase().includes("admin") && u.status === "active"
              ).length}
            </div>
          </div>

          <div className="stats-card">
            <h3>Lease Managers</h3>
            <div className="stat-value">
              {users.filter(u => u.role?.toLowerCase().includes("manager")).length}
            </div>
          </div>

          <div className="stats-card">
            <h3>Pending Invites</h3>
            <div className="stat-value">0</div>
          </div>
        </section>

        {/* USERS TABLE */}
        <section className="role-table-container">

          {/* TABLE HEADER */}
          <div className="role-table-header">
            <div></div>
            <div>User Info</div>
            <div>Role</div>
            <div>Module Access</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {filteredUsers.map(user => (
            <div className="user-row" key={user.id}>

              {/* RADIO */}
              <div className="checkbox-wrapper">
                <input type="radio" />
              </div>

              {/* USER INFO */}
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

              {/* ROLE */}
              <div>
                <span className={`role-badge ${user.roleClass}`}>
                  {user.role}
                </span>
              </div>

              {/* MODULE ACCESS */}
              <div className="module-access">
                {user.isAll ? (
                  <div className="toggle-group">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                    <span>All</span>
                  </div>
                ) : (
                  ["Lease", "Finance", "Maintenance"].map((m, i) => (
                    <div className="toggle-group" key={i}>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                      <span>{m}</span>
                    </div>
                  ))
                )}
              </div>

              {/* ✅ STATUS AFTER MODULE ACCESS */}
              <div className="status-column">
                <span className={`status ${user.status}`}>
                  {user.status === "inactive" ? "Inactive" : "Active"}
                </span>
              </div>

              {/* ACTIONS */}
              <div>
                <button className="action-btn">⋮</button>
              </div>

            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="table-footer">
          Showing {filteredUsers.length} of {users.length} users
        </footer>

      </main>
    </div>
  );
};

export default RoleManagement;
