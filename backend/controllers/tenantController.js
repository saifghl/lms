const pool = require("../config/db");

/* ================= GET ALL TENANTS ================= */
const getTenants = async (req, res) => {
  try {
    const [tenants] = await pool.execute(`
      SELECT t.*, 
      COALESCE(SUM(l.monthly_rent), 0) as total_rent,
      COUNT(l.id) as lease_count
      FROM tenants t
      LEFT JOIN leases l ON t.id = l.tenant_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
    res.json(tenants);
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET TENANT BY ID ================= */
const getTenantById = async (req, res) => {
  try {
    const [tenants] = await pool.execute("SELECT * FROM tenants WHERE id = ?", [req.params.id]);
    
    if (tenants.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Get leases for this tenant
    const [leases] = await pool.execute(`
      SELECT l.*, p.project_name, u.unit_number
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      WHERE l.tenant_id = ?
    `, [req.params.id]);
    
    const tenant = tenants[0];
    tenant.leases = leases;
    res.json(tenant);
  } catch (error) {
    console.error("Get tenant by id error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD TENANT ================= */
const addTenant = async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      area_occupied,
      status,
      company_name,
      gst_number,
      address
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO tenants 
      (name, contact, email, area_occupied, status, company_name, gst_number, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, contact, email, area_occupied || 0, status || 'pending', company_name, gst_number, address]
    );

    res.status(201).json({ message: "Tenant Added Successfully", id: result.insertId });
  } catch (error) {
    console.error("Add tenant error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE TENANT ================= */
const updateTenant = async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      area_occupied,
      status,
      company_name,
      gst_number,
      address
    } = req.body;

    await pool.execute(
      `UPDATE tenants SET
      name=?, contact=?, email=?, area_occupied=?, status=?, 
      company_name=?, gst_number=?, address=?
      WHERE id=?`,
      [name, contact, email, area_occupied, status, company_name, gst_number, address, req.params.id]
    );

    res.json({ message: "Tenant Updated Successfully" });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE TENANT ================= */
const deleteTenant = async (req, res) => {
  try {
    await pool.execute("DELETE FROM tenants WHERE id = ?", [req.params.id]);
    res.json({ message: "Tenant Deleted Successfully" });
  } catch (error) {
    console.error("Delete tenant error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTenants,
  getTenantById,
  addTenant,
  updateTenant,
  deleteTenant
};

