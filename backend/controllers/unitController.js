const pool = require("../config/db");

/* ================= GET ALL UNITS ================= */
const getUnits = async (req, res) => {
  try {
    const [units] = await pool.execute(`
      SELECT u.*, p.project_name, t.name as tenant_name, o.name as owner_name
      FROM units u
      LEFT JOIN projects p ON u.project_id = p.id
      LEFT JOIN tenants t ON u.current_tenant_id = t.id
      LEFT JOIN owners o ON u.owner_id = o.id
      ORDER BY u.created_at DESC
    `);
    res.json(units);
  } catch (error) {
    console.error("Get units error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET UNIT BY ID ================= */
const getUnitById = async (req, res) => {
  try {
    const [units] = await pool.execute(`
      SELECT u.*, p.project_name, t.name as tenant_name, o.name as owner_name
      FROM units u
      LEFT JOIN projects p ON u.project_id = p.id
      LEFT JOIN tenants t ON u.current_tenant_id = t.id
      LEFT JOIN owners o ON u.owner_id = o.id
      WHERE u.id = ?
    `, [req.params.id]);
    
    if (units.length === 0) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json(units[0]);
  } catch (error) {
    console.error("Get unit by id error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD UNIT ================= */
const addUnit = async (req, res) => {
  try {
    const {
      unit_number,
      floor_number,
      project_id,
      super_area,
      carpet_area,
      covered_area,
      unit_status,
      unit_plc,
      projected_rent,
      images,
      owner_id
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO units 
      (unit_number, floor_number, project_id, super_area, carpet_area, covered_area, 
       unit_status, unit_plc, projected_rent, images, owner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [unit_number, floor_number, project_id, super_area, carpet_area, covered_area,
       unit_status, unit_plc, projected_rent, images, owner_id]
    );

    res.status(201).json({ message: "Unit Added Successfully", id: result.insertId });
  } catch (error) {
    console.error("Add unit error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE UNIT ================= */
const updateUnit = async (req, res) => {
  try {
    const {
      unit_number,
      floor_number,
      project_id,
      super_area,
      carpet_area,
      covered_area,
      unit_status,
      unit_plc,
      projected_rent,
      images,
      owner_id,
      current_tenant_id
    } = req.body;

    await pool.execute(
      `UPDATE units SET
      unit_number=?, floor_number=?, project_id=?, super_area=?, carpet_area=?, 
      covered_area=?, unit_status=?, unit_plc=?, projected_rent=?, images=?, 
      owner_id=?, current_tenant_id=?
      WHERE id=?`,
      [unit_number, floor_number, project_id, super_area, carpet_area, covered_area,
       unit_status, unit_plc, projected_rent, images, owner_id, current_tenant_id, req.params.id]
    );

    res.json({ message: "Unit Updated Successfully" });
  } catch (error) {
    console.error("Update unit error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE UNIT ================= */
const deleteUnit = async (req, res) => {
  try {
    await pool.execute("DELETE FROM units WHERE id = ?", [req.params.id]);
    res.json({ message: "Unit Deleted Successfully" });
  } catch (error) {
    console.error("Delete unit error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUnits,
  getUnitById,
  addUnit,
  updateUnit,
  deleteUnit
};

