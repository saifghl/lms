const pool = require("../config/db");

/* ================= GET ALL OWNERS ================= */
const getOwners = async (req, res) => {
  try {
    const [owners] = await pool.execute(`
      SELECT o.*, 
      COALESCE(SUM(u.super_area), 0) as total_area_owned,
      COUNT(DISTINCT u.id) as unit_count
      FROM owners o
      LEFT JOIN units u ON o.id = u.owner_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(owners);
  } catch (error) {
    console.error("Get owners error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET OWNER BY ID ================= */
const getOwnerById = async (req, res) => {
  try {
    const [owners] = await pool.execute("SELECT * FROM owners WHERE id = ?", [req.params.id]);
    
    if (owners.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }
    
    // Get units for this owner
    const [units] = await pool.execute(`
      SELECT u.*, p.project_name
      FROM units u
      LEFT JOIN projects p ON u.project_id = p.id
      WHERE u.owner_id = ?
    `, [req.params.id]);
    
    // Get leases for this owner
    const [leases] = await pool.execute(`
      SELECT l.*, p.project_name, u.unit_number, t.name as tenant_name
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      WHERE l.owner_id = ?
    `, [req.params.id]);
    
    const owner = owners[0];
    owner.units = units;
    owner.leases = leases;
    res.json(owner);
  } catch (error) {
    console.error("Get owner by id error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD OWNER ================= */
const addOwner = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      gst_number,
      total_area,
      status,
      image,
      address
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO owners 
      (name, phone, email, gst_number, total_area, status, image, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, gst_number, total_area || 0, status || 'pending', image, address]
    );

    res.status(201).json({ message: "Owner Added Successfully", id: result.insertId });
  } catch (error) {
    console.error("Add owner error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE OWNER ================= */
const updateOwner = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      gst_number,
      total_area,
      status,
      image,
      address
    } = req.body;

    await pool.execute(
      `UPDATE owners SET
      name=?, phone=?, email=?, gst_number=?, total_area=?, status=?, image=?, address=?
      WHERE id=?`,
      [name, phone, email, gst_number, total_area, status, image, address, req.params.id]
    );

    res.json({ message: "Owner Updated Successfully" });
  } catch (error) {
    console.error("Update owner error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE OWNER ================= */
const deleteOwner = async (req, res) => {
  try {
    await pool.execute("DELETE FROM owners WHERE id = ?", [req.params.id]);
    res.json({ message: "Owner Deleted Successfully" });
  } catch (error) {
    console.error("Delete owner error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOwners,
  getOwnerById,
  addOwner,
  updateOwner,
  deleteOwner
};

