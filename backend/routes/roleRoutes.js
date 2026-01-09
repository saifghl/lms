const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* ===============================
   GET ALL USERS WITH ROLE + MODULES
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
                r.name AS role,
                GROUP_CONCAT(m.name) AS modules
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN role_modules rm ON r.id = rm.role_id
            LEFT JOIN modules m ON rm.module_id = m.id
            GROUP BY u.id, u.first_name, u.last_name, u.email, u.status, r.name
        `);

        // Map modules into array
        const users = rows.map(u => ({
            id: u.id,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            status: u.status,
            role: u.role,
            modules: u.modules ? u.modules.split(",") : []
        }));

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ===============================
   CREATE NEW USER
================================ */
router.post("/", async (req, res) => {
    const { first_name, last_name, email, phone, password_hash, role_id, status } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO users (first_name, last_name, email, phone, password_hash, role_id, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, phone, password_hash, role_id, status || 'active']
        );

        res.json({ message: "User created successfully", userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Creation failed" });
    }
});

/* ===============================
   UPDATE USER ROLE + STATUS
================================ */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { role_id, status } = req.body;

    try {
        await pool.query(
            `UPDATE users SET role_id = ?, status = ? WHERE id = ?`,
            [role_id, status, id]
        );

        res.json({ message: "User updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

/* ===============================
   DELETE USER
================================ */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;