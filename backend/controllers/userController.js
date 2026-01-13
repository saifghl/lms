const pool = require("../config/db");
const bcrypt = require("bcryptjs");

/* ================= GET ALL USERS ================= */
const getUsers = async (req, res) => {
    try {
        // Updated to join roles table to get role_name
        const [users] = await pool.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, r.role_name, u.status, u.created_at 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ================= CREATE USER (ADMIN) ================= */
const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role_name } = req.body;

        // Check if user exists
        const [existing] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Get Role ID
        const requestedRole = role_name || 'User';
        let [roleResult] = await pool.execute("SELECT id FROM roles WHERE role_name = ?", [requestedRole]);

        let roleId;
        if (roleResult.length > 0) {
            roleId = roleResult[0].id;
        } else {
            // Fallback: Create role if not exists (or error out, but creating is safer for now)
            // Ideally roles should be pre-seeded.
            // Let's default to the first role found or NULL
            const [anyRole] = await pool.execute("SELECT id FROM roles LIMIT 1");
            if (anyRole.length > 0) roleId = anyRole[0].id;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user (Fixed: password_hash, role_id)
        const [result] = await pool.execute(
            "INSERT INTO users (first_name, last_name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword, roleId, 'active']
        );

        res.status(201).json({ message: "User created successfully", id: result.insertId });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: error.message, error: error.message });
    }
};

/* ================= UPDATE USER ================= */
const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, role_name, status } = req.body;

        // Resolve Role ID
        let roleId;
        if (role_name) {
            const [roleResult] = await pool.execute("SELECT id FROM roles WHERE role_name = ?", [role_name]);
            if (roleResult.length > 0) roleId = roleResult[0].id;
        }

        // Update (handling optional role_id update)
        if (roleId) {
            await pool.execute(
                "UPDATE users SET first_name=?, last_name=?, email=?, role_id=?, status=? WHERE id=?",
                [first_name, last_name, email, roleId, status, req.params.id]
            );
        } else {
            await pool.execute(
                "UPDATE users SET first_name=?, last_name=?, email=?, status=? WHERE id=?",
                [first_name, last_name, email, status, req.params.id]
            );
        }

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: error.message });
    }
};

/* ================= DELETE USER ================= */
const deleteUser = async (req, res) => {
    try {
        await pool.execute("DELETE FROM users WHERE id=?", [req.params.id]);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
