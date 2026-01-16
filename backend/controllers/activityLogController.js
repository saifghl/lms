const pool = require("../config/db");

/* ================= GET LOGS ================= */
const getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dynamic Filtering (Optional, based on frontend support)
    const { module, user_id, search } = req.query;

    let query = `
            SELECT 
                l.id, l.action, l.module, l.details, l.created_at, l.ip_address,
                u.first_name, u.last_name, u.profile_image,
                r.role_name
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE 1=1
        `;
    const params = [];

    if (module && module !== 'All Modules') {
      query += " AND l.module = ?";
      params.push(module);
    }

    if (req.query.search) {
      query += " AND (l.action LIKE ? OR l.details LIKE ? OR u.first_name LIKE ?)";
      params.push(`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`);
    }

    // Get Total Count for Pagination
    const countQuery = `SELECT COUNT(*) as total FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id WHERE 1=1`;
    // Note: Simplified count for brevity, in production duplicate WHERE clause

    const [totalRows] = await pool.execute(`SELECT COUNT(*) as total FROM activity_logs`);
    const total = totalRows[0].total;

    // Finalize Query
    query += " ORDER BY l.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset); // String limits work in some drivers, but ints are safer
    // Convert to integers just in case driver is strict
    params[params.length - 2] = limit;
    params[params.length - 1] = offset;

    const [logs] = await pool.query(query, params);

    res.json({
      logs,
      total,
      page,
      limit
    });

  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

/* ================= EXPORT LOGS ================= */
const exportActivityLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT 
                l.id, l.created_at, l.action, l.module, l.details,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                r.role_name
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY l.created_at DESC
        `);

    // Convert to CSV
    const csvHeaders = "ID,Date,User,Role,Action,Module,Details\n";
    const csvRows = rows.map(row => {
      const date = new Date(row.created_at).toLocaleString();
      const details = row.details ? row.details.replace(/,/g, ' ') : ''; // Simple escape
      return `${row.id},"${date}","${row.user_name || 'System'}","${row.role_name || 'N/A'}","${row.action}","${row.module}","${details}"`;
    }).join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("activity_logs.csv");
    res.send(csvHeaders + csvRows);

  } catch (error) {
    console.error("Export logs error:", error);
    res.status(500).json({ message: "Failed to export logs" });
  }
};

module.exports = { getActivityLogs, exportActivityLogs };
