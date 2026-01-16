const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { logActivity } = require("../utils/logger");

/* ================= GET ALL USERS ================= */
const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT u.id, u.first_name, u.last_name, u.email, r.role_name, u.status, u.created_at 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
        `;
        const params = [];

        if (search) {
            query += ` WHERE (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY u.created_at DESC`;

        const [users] = await pool.execute(query, params);
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

        // Insert user (Fixed: ensure no undefined values)
        const [result] = await pool.execute(
            "INSERT INTO users (first_name, last_name, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?, ?)",
            [first_name || '', last_name || '', email, hashedPassword, roleId || null, 'active']
        );

        // Log Activity
        // Note: req.user might be undefined if this is a public signup, but usually it's an admin action.
        // If req.user is undefined, we pass null (system/public action)
        const performingUser = req.user ? req.user.id : null;
        await logActivity(performingUser, "Created User", "User Management", `Created user ${first_name} ${last_name} (${email})`);

        res.status(201).json({ message: "User created successfully", id: result.insertId });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: error.message, error: error.message });
    }
};

/* ================= UPDATE USER ================= */
const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, role_name, status, password } = req.body;

        // Resolve Role ID
        let roleId;
        if (role_name) {
            const [roleResult] = await pool.execute("SELECT id FROM roles WHERE role_name = ?", [role_name]);
            if (roleResult.length > 0) roleId = roleResult[0].id;
        }

        let query = "UPDATE users SET first_name=?, last_name=?, email=?, status=?";
        const params = [first_name, last_name, email, status];

        if (roleId) {
            query += ", role_id=?";
            params.push(roleId);
        }

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ", password_hash=?";
            params.push(hashedPassword);
        }

        query += " WHERE id=?";
        params.push(req.params.id);

        await pool.execute(query, params);

        const performingUser = req.user ? req.user.id : null;
        await logActivity(performingUser, "Updated User", "User Management", `Updated user ID ${req.params.id}`);

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

        const performingUser = req.user ? req.user.id : null;
        await logActivity(performingUser, "Deleted User", "User Management", `Deleted user ID ${req.params.id}`);

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
