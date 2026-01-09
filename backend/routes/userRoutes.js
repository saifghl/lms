const express = require("express");
const router = express.Router();   // ✅ THIS LINE WAS MISSING
const pool = require("../config/db");

/* ===============================
   GET ALL USERS WITH ROLES
================================ */
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.status,
                r.name AS role_name
            FROM users u
            JOIN roles r ON u.role_id = r.id
        `);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
