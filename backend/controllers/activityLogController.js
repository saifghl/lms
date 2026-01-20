const pool = require("../config/db");

/* ================= GET LOGS ================= */
const getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extract filters
    const { module, location, search, startDate, endDate } = req.query;

    // Base query
    let query = `
            SELECT 
                l.id, l.action, l.module, l.details, l.created_at, l.ip_address,
                u.first_name, u.last_name, u.profile_image, u.location,
                r.role_name
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE 1=1
        `;
    const params = [];

    // Apply Filters
    if (module && module !== 'All Modules') {
      query += " AND l.module = ?";
      params.push(module);
    }

    if (location && location !== 'All Locations') {
      // Assuming location is stored in users table
      query += " AND u.location = ?";
      params.push(location);
    }

    if (search) {
      query += " AND (l.action LIKE ? OR l.details LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (startDate) {
      query += " AND l.created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND l.created_at <= ?";
      params.push(endDate);
    }

    // --- Get Total Count (Respecting Filters) ---
    // We construct a separate count query mirroring the main query's WHERE clause
    let countQuery = `
            SELECT COUNT(*) as total 
            FROM activity_logs l 
            LEFT JOIN users u ON l.user_id = u.id 
            WHERE 1=1
        `;
    // We can't reuse 'params' directly because we need to rebuild the WHERE clause for count
    // or just wrap the main query logic.
    // Simpler approach: Re-append the same conditions to countQuery

    if (module && module !== 'All Modules') countQuery += " AND l.module = ?";
    if (location && location !== 'All Locations') countQuery += " AND u.location = ?";
    if (search) countQuery += " AND (l.action LIKE ? OR l.details LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
    if (startDate) countQuery += " AND l.created_at >= ?";
    if (endDate) countQuery += " AND l.created_at <= ?";

    const [totalRows] = await pool.execute(countQuery, params);
    const total = totalRows[0].total;

    // Finalize Main Query
    query += " ORDER BY l.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute Main Query
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
    const { module, location, search, startDate, endDate } = req.query;

    let query = `
            SELECT 
                l.id, l.created_at, l.action, l.module, l.details,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                r.role_name
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE 1=1
        `;
    const params = [];

    // Apply Filters (Same as getActivityLogs)
    if (module && module !== 'All Modules') {
      query += " AND l.module = ?";
      params.push(module);
    }

    if (location && location !== 'All Locations') {
      query += " AND u.location = ?";
      params.push(location);
    }

    if (search) {
      query += " AND (l.action LIKE ? OR l.details LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (startDate) {
      query += " AND l.created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND l.created_at <= ?";
      params.push(endDate);
    }

    query += " ORDER BY l.created_at DESC";

    const [rows] = await pool.query(query, params);

    // Convert to CSV
    const csvHeaders = "ID,Date,User,Role,Action,Module,Details\n";
    const csvRows = rows.map(row => {
      const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
      const details = row.details ? row.details.replace(/[\r\n,]/g, ' ') : '';
      const action = row.action ? row.action.replace(/,/g, ' ') : '';
      return `${row.id},"${date}","${row.user_name || 'System'}","${row.role_name || 'N/A'}","${action}","${row.module}","${details}"`;
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
