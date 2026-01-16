const pool = require('../config/db');

/**
 * Logs an activity to the database.
 * @param {number|null} userId - The ID of the user performing the action (can be null if system action).
 * @param {string} action - Short description of the action (e.g., "Created User").
 * @param {string} module - The module where it happened (e.g., "User Management").
 * @param {string|object} details - Detailed info (e.g., "Created user John Doe"). Can be an object.
 * @param {string} ipAddress - Optional IP address.
 */
const logActivity = async (userId, action, module, details, ipAddress = null) => {
    try {
        const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;

        await pool.execute(
            `INSERT INTO activity_logs (user_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
            [userId, action, module, detailsStr, ipAddress]
        );
    } catch (err) {
        console.error("Failed to log activity:", err);
        // Don't throw, we don't want to break the main flow just because logging failed
    }
};

module.exports = { logActivity };
