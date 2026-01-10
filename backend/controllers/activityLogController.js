const pool = require("../config/db");

/* ================= GET ACTIVITY LOGS ================= */
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const [logs] = await pool.execute(`
      SELECT al.*, u.full_name as user_name, u.email as user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    const [count] = await pool.execute("SELECT COUNT(*) as total FROM activity_logs");
    
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

/* ================= CREATE ACTIVITY LOG ================= */
const createActivityLog = async (userId, action, tableName, recordId, details, ipAddress) => {
  try {
    await pool.execute(
      `INSERT INTO activity_logs (user_id, action, table_name, record_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, tableName, recordId, JSON.stringify(details), ipAddress]
    );
  } catch (error) {
    console.error("Create activity log error:", error);
  }
};

module.exports = {
  getActivityLogs,
  createActivityLog
};

