const pool = require("../config/db");

/* ================= GET ALL LEASES ================= */
const getLeases = async (req, res) => {
  try {
    const [leases] = await pool.execute(`
      SELECT l.*, p.project_name, u.unit_number, t.name as tenant_name, o.name as owner_name
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      LEFT JOIN owners o ON l.owner_id = o.id
      ORDER BY l.created_at DESC
    `);
    res.json(leases);
  } catch (error) {
    console.error("Get leases error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET LEASE BY ID ================= */
const getLeaseById = async (req, res) => {
  try {
    const [leases] = await pool.execute(`
      SELECT l.*, p.project_name, u.unit_number, t.name as tenant_name, o.name as owner_name
      FROM leases l
      LEFT JOIN projects p ON l.project_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN tenants t ON l.tenant_id = t.id
      LEFT JOIN owners o ON l.owner_id = o.id
      WHERE l.id = ?
    `, [req.params.id]);
    
    if (leases.length === 0) {
      return res.status(404).json({ message: "Lease not found" });
    }
    
    // Get escalations
    const [escalations] = await pool.execute(
      "SELECT * FROM rent_escalations WHERE lease_id = ? ORDER BY effective_date",
      [req.params.id]
    );
    
    const lease = leases[0];
    lease.escalations = escalations;
    res.json(lease);
  } catch (error) {
    console.error("Get lease by id error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD LEASE ================= */
const addLease = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const {
        lease_type,
        rent_model,
        project_id,
        unit_id,
        tenant_id,
        owner_id,
        sub_lease_area,
        lease_start_date,
        lease_end_date,
        rent_commencement_date,
        duration_months,
        lockin_period_months,
        notice_period_months,
        monthly_rent,
        mgr,
        revenue_share_percentage,
        applicable_on,
        payment_due_day,
        billing_frequency,
        cam_charges,
        security_deposit,
        deposit_type,
        currency,
        parent_lease_id,
        escalations
      } = req.body;

      // Generate lease number
      const leaseNumber = `L-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const [result] = await connection.execute(
        `INSERT INTO leases 
        (lease_number, lease_type, rent_model, project_id, unit_id, tenant_id, owner_id,
         sub_lease_area, lease_start_date, lease_end_date, rent_commencement_date,
         duration_months, lockin_period_months, notice_period_months, monthly_rent,
         mgr, revenue_share_percentage, applicable_on, payment_due_day, billing_frequency,
         cam_charges, security_deposit, deposit_type, currency, parent_lease_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [leaseNumber, lease_type, rent_model, project_id, unit_id, tenant_id, owner_id,
         sub_lease_area, lease_start_date, lease_end_date, rent_commencement_date,
         duration_months, lockin_period_months, notice_period_months, monthly_rent,
         mgr, revenue_share_percentage, applicable_on, payment_due_day, billing_frequency,
         cam_charges, security_deposit, deposit_type, currency || 'INR', parent_lease_id]
      );

      const leaseId = result.insertId;

      // Add escalations if provided
      if (escalations && escalations.length > 0) {
        for (const esc of escalations) {
          await connection.execute(
            "INSERT INTO rent_escalations (lease_id, effective_date, increase_type, value) VALUES (?, ?, ?, ?)",
            [leaseId, esc.effectiveDate, esc.increaseType, esc.value]
          );
        }
      }

      // Update unit status
      await connection.execute(
        "UPDATE units SET unit_status = 'leased', current_tenant_id = ? WHERE id = ?",
        [tenant_id, unit_id]
      );

      await connection.commit();
      res.status(201).json({ message: "Lease Created Successfully", id: leaseId, lease_number: leaseNumber });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Add lease error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE LEASE ================= */
const updateLease = async (req, res) => {
  try {
    const {
      lease_type,
      rent_model,
      project_id,
      unit_id,
      tenant_id,
      owner_id,
      sub_lease_area,
      lease_start_date,
      lease_end_date,
      rent_commencement_date,
      duration_months,
      lockin_period_months,
      notice_period_months,
      monthly_rent,
      mgr,
      revenue_share_percentage,
      applicable_on,
      payment_due_day,
      billing_frequency,
      cam_charges,
      security_deposit,
      deposit_type,
      currency,
      status,
      escalations
    } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.execute(
        `UPDATE leases SET
        lease_type=?, rent_model=?, project_id=?, unit_id=?, tenant_id=?, owner_id=?,
        sub_lease_area=?, lease_start_date=?, lease_end_date=?, rent_commencement_date=?,
        duration_months=?, lockin_period_months=?, notice_period_months=?, monthly_rent=?,
        mgr=?, revenue_share_percentage=?, applicable_on=?, payment_due_day=?, billing_frequency=?,
        cam_charges=?, security_deposit=?, deposit_type=?, currency=?, status=?
        WHERE id=?`,
        [lease_type, rent_model, project_id, unit_id, tenant_id, owner_id,
         sub_lease_area, lease_start_date, lease_end_date, rent_commencement_date,
         duration_months, lockin_period_months, notice_period_months, monthly_rent,
         mgr, revenue_share_percentage, applicable_on, payment_due_day, billing_frequency,
         cam_charges, security_deposit, deposit_type, currency || 'INR', status || 'active', req.params.id]
      );

      // Update escalations
      if (escalations) {
        await connection.execute("DELETE FROM rent_escalations WHERE lease_id = ?", [req.params.id]);
        for (const esc of escalations) {
          await connection.execute(
            "INSERT INTO rent_escalations (lease_id, effective_date, increase_type, value) VALUES (?, ?, ?, ?)",
            [req.params.id, esc.effectiveDate, esc.increaseType, esc.value]
          );
        }
      }

      await connection.commit();
      res.json({ message: "Lease Updated Successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Update lease error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE LEASE ================= */
const deleteLease = async (req, res) => {
  try {
    await pool.execute("DELETE FROM leases WHERE id = ?", [req.params.id]);
    res.json({ message: "Lease Deleted Successfully" });
  } catch (error) {
    console.error("Delete lease error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLeases,
  getLeaseById,
  addLease,
  updateLease,
  deleteLease
};

