const pool = require("../config/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

/* ================= ADD PROJECT ================= */
const addProject = async (req, res) => {
  try {
    const {
      project_name,
      location,
      address,
      project_type,
      total_floors,
      total_project_area,
      description
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Sanitize numeric fields
    const floors = total_floors ? parseInt(total_floors) : 0;
    const area = total_project_area ? parseFloat(total_project_area) : 0;

    const values = [
      project_name,
      location || null,
      address || null,
      project_type || null,
      floors,
      area,
      image,
      description || null
    ];

    console.log("DEBUG ADD PROJECT VALUES:", values);

    const [result] = await pool.execute(
      `INSERT INTO projects 
      (project_name, location, address, project_type, total_floors, total_project_area, project_image, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    res.status(201).json({ message: "Project Added Successfully", id: result.insertId });
  } catch (error) {
    console.error("Add project error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ALL PROJECTS ================= */
const getProjects = async (req, res) => {
  try {
    // Using promise-based execute() method, not callback-based query()
    const [projects] = await pool.execute("SELECT * FROM projects ORDER BY created_at DESC");
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET SINGLE PROJECT ================= */
const getProjectById = async (req, res) => {
  try {
    const [projects] = await pool.execute("SELECT * FROM projects WHERE id = ?", [req.params.id]);
    if (projects.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(projects[0]);
  } catch (error) {
    console.error("Get project by id error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE PROJECT ================= */
const updateProject = async (req, res) => {
  try {
    const {
      project_name,
      location,
      address,
      project_type,
      total_floors,
      total_project_area,
      description,
      status
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Sanitize numeric fields
    const floors = total_floors ? parseInt(total_floors) : 0;
    const area = total_project_area ? parseFloat(total_project_area) : 0;

    let sql = `
      UPDATE projects SET
      project_name=?, location=?, address=?, project_type=?,
      total_floors=?, total_project_area=?, description=?, status=?
    `;
    const values = [
      project_name,
      location || null,
      address || null,
      project_type || null,
      floors,
      area,
      description || null,
      status || 'active'
    ];

    if (image) {
      sql += ", project_image=?";
      values.push(image);
    }

    sql += " WHERE id=?";
    values.push(req.params.id);

    await pool.execute(sql, values);
    res.json({ message: "Project Updated Successfully" });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE PROJECT ================= */
const deleteProject = async (req, res) => {
  try {
    await pool.execute("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ message: "Project Deleted Successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET PROJECT UNITS ================= */
const getUnitsByProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [units] = await pool.execute(`
      SELECT 
        u.id, 
        u.unit_number, 
        u.floor_number, 
        u.super_area, 
        u.status 
      FROM units u
      WHERE u.project_id = ?
      ORDER BY u.unit_number ASC
    `, [id]);

    res.json({ data: units });
  } catch (error) {
    console.error("Get units by project error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getUnitsByProject,
  upload
};
