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
   GET USER PROFILE
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
   UPDATE PROFILE
================================ */
router.put("/:id", async (req, res) => {
    const { first_name, last_name, phone, job_title, location } = req.body;

    try {
        await pool.query(
            `UPDATE users SET
             first_name = ?, last_name = ?, phone = ?, job_title = ?, location = ?
             WHERE id = ?`,
            [first_name, last_name, phone, job_title, location, req.params.id]
        );

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
/* ===============================
   REMOVE PROFILE PHOTO (FIXED)
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
