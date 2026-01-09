const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const multer = require("multer");

/* ===============================
   FILE UPLOAD CONFIG
================================ */
const upload = multer({
  dest: "uploads/"
});

/* ===============================
   GET USER PROFILE
================================ */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, job_title, location, profile_image
       FROM users
       WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   UPDATE USER PROFILE
================================ */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, job_title, location } = req.body;

  try {
    await pool.query(
      `UPDATE users SET
        first_name=?,
        last_name=?,
        phone=?,
        job_title=?,
        location=?
       WHERE id=?`,
      [first_name, last_name, phone, job_title, location, id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* ===============================
   UPLOAD PROFILE PHOTO
================================ */
router.put("/photo/:id", upload.single("photo"), async (req, res) => {
  const { id } = req.params;
  const imagePath = `/uploads/${req.file.filename}`;

  try {
    await pool.query(
      "UPDATE users SET profile_image=? WHERE id=?",
      [imagePath, id]
    );

    res.json({ image: imagePath });
  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ===============================
   REMOVE PROFILE PHOTO
================================ */
router.delete("/photo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE users SET profile_image=NULL WHERE id=?",
      [id]
    );

    res.json({ message: "Photo removed" });
  } catch {
    res.status(500).json({ message: "Remove failed" });
  }
});

/* ===============================
   UPDATE PASSWORD
================================ */
router.put("/password/:id", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const [[user]] = await pool.query(
      "SELECT password FROM users WHERE id=?",
      [id]
    );

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password=? WHERE id=?",
      [hashed, id]
    );

    res.json({ message: "Password updated" });
  } catch {
    res.status(500).json({ message: "Password update failed" });
  }
});

module.exports = router;
