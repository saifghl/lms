const pool = require('../config/db');

/**
 * Create a new notification
 * @param {number|null} userId - The user ID to receive the notification (null for all admins if logic supports, or specific user)
 * @param {string} title - Notification title
 * @param {string} message - Notification body
 * @param {string} type - 'info', 'success', 'warning', 'error' (Mapped to title prefix if column missing)
 */
exports.createNotification = async (userId, title, message, type = 'info') => {
    try {
        // Note: 'type' column not present in schema, using title prefix
        let finalTitle = title;
        // if (type === 'urgent' || type === 'error') finalTitle = `⚠️ ${title}`;
        // if (type === 'success') finalTitle = `✅ ${title}`;

        // Ensure title is not too long
        if (finalTitle.length > 255) finalTitle = finalTitle.substring(0, 252) + '...';

        await pool.query(
            "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
            [userId || 1, finalTitle, message] // Defaulting to user 1 (Admin) if null
        );
        console.log(`[Notification] Created: ${finalTitle}`);
    } catch (error) {
        console.error("[Notification] Creation Failed:", error.message);
    }
};
