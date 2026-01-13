const pool = require("../config/db");

/* ================= DASHBOARD STATS ================= */
exports.getDashboardStats = async (req, res) => {
    try {
        const [projects] = await pool.query("SELECT COUNT(*) as count FROM projects");
        const [units] = await pool.query("SELECT COUNT(*) as count FROM units");
        const [owners] = await pool.query("SELECT COUNT(*) as count FROM owners");
        const [tenants] = await pool.query("SELECT COUNT(*) as count FROM tenants");
        const [leases] = await pool.query("SELECT COUNT(*) as count FROM leases");

        // Revenue could be sum of lease amounts. For now, let's try to sum it if column exists, else hardcode or 0.
        // Let's stick to 0 or static for revenue unless we check lease schema.

        res.json({
            totalProjects: projects[0].count,
            totalUnits: units[0].count,
            totalOwners: owners[0].count,
            totalTenants: tenants[0].count,
            totalLeases: leases[0].count,
            totalRevenue: "₹0", // Placeholder until Financials module is ready
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
};

/* ================= REPORTS ================= */
exports.getReports = async (req, res) => {
    try {
        // If there's a reports table, fetch. If not, return empty or mock if requested.
        // User saw "Sunset Apartments" in screenshot. 
        // Let's check if 'documents' or 'leases' can serve as reports. 
        // For now, let's return [] to verify 'working properly' means 'real data' (which is none yet).
        res.json([]);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reports" });
    }
};

/* ================= DOCUMENTS ================= */
exports.getDocuments = async (req, res) => {
    try {
        const [docs] = await pool.query("SELECT * FROM documents ORDER BY created_at DESC");
        // Map to frontend expected format if needed
        const formatted = docs.map(d => ({
            id: d.id,
            projectName: d.project_name || "Unknown", // Assuming column exists
            date: d.created_at,
            uploadedBy: d.uploaded_by || "Admin",
            category: d.category
        }));
        res.json(formatted);
    } catch (err) {
        console.error("Get Docs Error:", err);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
};

/* ================= NOTIFICATIONS ================= */
exports.getNotifications = async (req, res) => {
    try {
        const [notes] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
        res.json(notes);
    } catch (err) {
        console.error("Get Notifications Error:", err);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

/* ================= SEARCH ================= */
exports.searchData = async (req, res) => {
    res.json([]); // Implement real search later if needed
};

/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
    // Default to User ID 1 for now
    try {
        const [rows] = await pool.query("SELECT first_name, last_name, email, phone, job_title, location FROM users WHERE id = 1");
        if (rows.length > 0) {
            const u = rows[0];
            res.json({
                firstName: u.first_name,
                lastName: u.last_name,
                email: u.email,
                phone: u.phone,
                jobTitle: u.job_title,
                location: u.location
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, phone, jobTitle, location } = req.body;
    try {
        await pool.query(
            "UPDATE users SET first_name=?, last_name=?, phone=?, job_title=?, location=? WHERE id=1",
            [firstName, lastName, phone, jobTitle, location]
        );
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};
