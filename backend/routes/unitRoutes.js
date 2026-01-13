const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const unitController = require("../controllers/unitController");

/* ================= MULTER CONFIG ================= */
const uploadDir = path.join(__dirname, "..", "uploads", "units");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith("image/")
            ? cb(null, true)
            : cb(new Error("Only image files allowed"));
    }
});

/* ================= ROUTES ================= */
router.get("/", unitController.getUnits);
router.post("/", upload.array("images", 5), unitController.createUnit);
router.get("/:id", unitController.getUnitById);
router.put("/:id", unitController.updateUnit);
router.delete("/:id", unitController.deleteUnit);

module.exports = router;
