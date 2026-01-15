const pool = require("../config/db");

/* ================= GET ACTIVITY LOGS ================= */
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, module: moduleName, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        al.*, 
        u.first_name, 
        u.last_name, 
        u.email as user_email, 
        u.profile_image, 
        r.role_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (moduleName && moduleName !== 'All Modules') {
      query += ` AND al.module = ?`;
      params.push(moduleName);
    }

    if (search) {
      query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR al.action LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [logs] = await pool.query(query, params);

    // Count query
    let countQuery = `SELECT COUNT(*) as total FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE 1=1`;
    const countParams = [];

    if (moduleName && moduleName !== 'All Modules') {
      countQuery += ` AND al.module = ?`;
      countParams.push(moduleName);
    }
    if (search) {
      countQuery += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR al.action LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [count] = await pool.query(countQuery, countParams);

    res.json({
      logs,
      total: count[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Get activity logs error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= EXPORT ACTIVITY LOGS ================= */
const exportActivityLogs = async (req, res) => {
  try {
    const { module: moduleName, search } = req.query;
    let query = `
            SELECT
                al.created_at,
                CONCAT(u.first_name, ' ', u.last_name) as user_name,
                r.role_name,
                al.action,
                al.module,
                al.ip_address,
                al.details
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE 1=1
        `;
    const params = [];

    if (moduleName && moduleName !== 'All Modules') {
      query += ` AND al.module = ?`;
      params.push(moduleName);
    }
    if (search) {
      query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR al.action LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY al.created_at DESC`;

    const [rows] = await pool.query(query, params);

    // Convert to CSV
    const headers = ['Date', 'User', 'Role', 'Action', 'Module', 'IP Address', 'Details'];
    const csvRows = [headers.join(',')];

    rows.forEach(row => {
      const date = new Date(row.created_at).toLocaleString();
      let details = row.details;
      try {
        if (typeof details !== 'string') details = JSON.stringify(details);
      } catch (e) { }

      const escape = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;

      csvRows.push([
        escape(date),
        escape(row.user_name),
        escape(row.role_name),
        escape(row.action),
        escape(row.module),
        escape(row.ip_address),
        escape(details)
      ].join(','));
    });

    const csvString = csvRows.join('\n');

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="activity_logs.csv"');
    res.send(csvString);

  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= CREATE ACTIVITY LOG ================= */
const createActivityLog = async (userId, action, moduleName, entityType, entityId, details, ipAddress) => {
  try {
    const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;
    // Map params to DB columns:
    // userId -> user_id
    // action -> action
    // moduleName -> module
    // entityType -> entity_type
    // entityId -> entity_id
    // details -> details
    // ipAddress -> ip_address

    await pool.query(
      `INSERT INTO activity_logs (user_id, action, module, entity_type, entity_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, action, moduleName, entityType, entityId, detailsString, ipAddress]
    );
  } catch (error) {
    console.error("Create activity log error:", error);
  }
};

module.exports = {
  getActivityLogs,
  createActivityLog,
  exportActivityLogs
};
