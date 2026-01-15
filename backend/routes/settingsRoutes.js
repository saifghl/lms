const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

/* ===============================
   MULTER CONFIG (SAFE)
================================ */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images allowed"));
};

const upload = multer({ storage, fileFilter });

/* ===============================
   GET CURRENT USER PROFILE (Default)
================================ */
router.get("/", async (req, res) => {
    // Default to ID 1 or 3 for demo (since Settings.jsx used 3)
    const id = 1;
    try {
        const [rows] = await pool.query(
            `SELECT id, first_name, last_name, email, phone, job_title, location, profile_image
             FROM users WHERE id = ?`,
            [id]
        );

        if (!rows.length) {
            // If ID 1 doesn't exist, try to return the first user
            const [anyUser] = await pool.query("SELECT * FROM users LIMIT 1");
            if (anyUser.length) return res.json(anyUser[0]);

            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ===============================
   UPDATE CURRENT PROFILE (Default)
================================ */
router.put("/", async (req, res) => {
    const id = 1; // Default
    const { first_name, last_name, phone, job_title, location } = req.body;

    try {
        // Build dynamic query to only update provided fields
        let fields = [];
        let values = [];

        if (first_name !== undefined) { fields.push("first_name = ?"); values.push(first_name); }
        if (last_name !== undefined) { fields.push("last_name = ?"); values.push(last_name); }
        if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }
        if (job_title !== undefined) { fields.push("job_title = ?"); values.push(job_title); }
        if (location !== undefined) { fields.push("location = ?"); values.push(location); }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        values.push(id);
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

        await pool.query(sql, values);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

/* ===============================
   GET USER PROFILE BY ID
================================ */
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, first_name, last_name, email, phone, job_title, location, profile_image
             FROM users WHERE id = ?`,
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ===============================
   UPDATE PROFILE BY ID
================================ */
router.put("/:id", async (req, res) => {
    const { first_name, last_name, phone, job_title, location } = req.body;

    try {
        let fields = [];
        let values = [];

        if (first_name !== undefined) { fields.push("first_name = ?"); values.push(first_name); }
        if (last_name !== undefined) { fields.push("last_name = ?"); values.push(last_name); }
        if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }
        if (job_title !== undefined) { fields.push("job_title = ?"); values.push(job_title); }
        if (location !== undefined) { fields.push("location = ?"); values.push(location); }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        values.push(req.params.id);
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

        await pool.query(sql, values);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

/* ===============================
   UPLOAD PROFILE PHOTO
================================ */
router.post("/:id/photo", upload.single("photo"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    try {
        await pool.query(
            "UPDATE users SET profile_image = ? WHERE id = ?",
            [imagePath, req.params.id]
        );

        res.json({ image: imagePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Photo upload failed" });
    }
});

/* ===============================
   REMOVE PROFILE PHOTO
================================ */
router.delete("/:id/photo", async (req, res) => {
    try {
        // 1️⃣ Get current photo path
        const [rows] = await pool.query(
            "SELECT profile_image FROM users WHERE id = ?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const imagePath = rows[0].profile_image;

        // 2️⃣ Delete file from uploads folder
        if (imagePath) {
            const fullPath = path.join(__dirname, "..", imagePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // 3️⃣ Clear DB reference
        await pool.query(
            "UPDATE users SET profile_image = NULL WHERE id = ?",
            [req.params.id]
        );

        res.json({ message: "Photo removed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to remove photo" });
    }
});

/* ===============================
   UPDATE PASSWORD
================================ */
router.put("/:id/password", async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both passwords required" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT password_hash FROM users WHERE id = ?",
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            rows[0].password_hash
        );

        if (!isMatch) {
            return res.status(401).json({ message: "Current password incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [hashed, req.params.id]
        );

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Password update failed" });
    }
});

module.exports = router;
