const pool = require("../config/db");

// Get Review Stats (Counts for tabs)
exports.getReviewStats = async (req, res) => {
    try {
        const [projects] = await pool.query("SELECT COUNT(*) as count FROM projects WHERE status = 'pending'");
        const [units] = await pool.query("SELECT COUNT(*) as count FROM units WHERE status = 'under_maintenance'"); // Example criteria
        const [owners] = await pool.query("SELECT COUNT(*) as count FROM owners WHERE status = 'inactive'"); // Example criteria
        const [tenants] = await pool.query("SELECT COUNT(*) as count FROM tenants WHERE status = 'inactive'"); // Example criteria
        const [leases] = await pool.query("SELECT COUNT(*) as count FROM leases WHERE status = 'draft'");

        res.json({
            projects: projects[0].count,
            units: units[0].count,
            owners: owners[0].count,
            tenants: tenants[0].count,
            leases: leases[0].count
        });
    } catch (err) {
        console.error("Review stats error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Pending Items by Type
exports.getPendingItems = async (req, res) => {
    try {
        const { type } = req.query; // 'lease', 'project', etc.
        let query = "";

        switch (type) {
            case 'lease':
                query = `
                    SELECT l.id, t.company_name as tenant_name, l.monthly_rent, l.lease_start, l.lease_end, l.created_at
                    FROM leases l
                    JOIN tenants t ON l.tenant_id = t.id
                    WHERE l.status = 'draft'
                    ORDER BY l.created_at DESC
                `;
                break;
            // Add other cases as needed
            default:
                return res.json([]);
        }

        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Pending items error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
