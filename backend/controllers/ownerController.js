const pool = require("../config/db");

exports.getOwnerDetails = async (req, res) => {
    const ownerId = req.params.id;

    try {
        const [[owner]] = await pool.query(
            "SELECT * FROM owners WHERE id = ?",
            [ownerId]
        );

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        const [units] = await pool.query(`
            SELECT u.*
            FROM units u
            JOIN owner_units ou ON ou.unit_id = u.id
            WHERE ou.owner_id = ?
        `, [ownerId]);

        res.json({ owner, units });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/* =========================
   GET ALL OWNERS
========================= */
exports.getOwners = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                name,
                email,
                phone,
                total_owned_area,
                gst_number, 
                kyc_status,
                created_at
            FROM owners
            ORDER BY created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error("GET OWNERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch owners" });
    }
};
/* =========================
   GET OWNER BY ID  ✅ (FIXED)
========================= */
exports.getOwnerById = async (req, res) => {
    const ownerId = req.params.id;

    try {
        const [[owner]] = await pool.query(
            "SELECT * FROM owners WHERE id = ?",
            [ownerId]
        );

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        const [units] = await pool.query(`
            SELECT u.*
            FROM units u
            JOIN owner_units ou ON ou.unit_id = u.id
            WHERE ou.owner_id = ?
        `, [ownerId]);

        res.json({ owner, units });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/* =========================
   CREATE OWNER (UPDATED)
========================= */
exports.createOwner = async (req, res) => {
    const {
        name,
        email,
        phone,
        alternative_contact,
        representative_name,
        representative_phone,  // Added
        representative_email,  // Added
        address,
        unit_ids
    } = req.body;

    if (!unit_ids || unit_ids.length === 0) {
        return res.status(400).json({ message: "At least one unit is required" });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Fetch unit areas
        const [units] = await conn.query(
            "SELECT id, super_area FROM units WHERE id IN (?)",
            [unit_ids]
        );

        if (units.length === 0) {
            throw new Error("Invalid unit IDs");
        }

        const totalOwnedArea = units.reduce(
            (sum, u) => sum + Number(u.super_area),
            0
        );

        // 2️⃣ Insert owner (UPDATED: Added representative_phone and representative_email)
        const [ownerResult] = await conn.query(
            `INSERT INTO owners
            (name, email, phone, alternative_contact,
             representative_name, representative_phone, representative_email, address,
             total_owned_area, gst_number, kyc_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                email,
                phone,
                alternative_contact || null,
                representative_name || null,
                representative_phone || null,  // Added
                representative_email || null,  // Added
                address || null,
                totalOwnedArea,
                null,
                "pending"
            ]
        );

        const ownerId = ownerResult.insertId;

        // 3️⃣ Owner-unit mapping
        const ownerUnits = unit_ids.map(unitId => [ownerId, unitId]);
        await conn.query(
            "INSERT INTO owner_units (owner_id, unit_id) VALUES ?",
            [ownerUnits]
        );

        // 4️⃣ Mark units occupied
        await conn.query(
            "UPDATE units SET status='occupied' WHERE id IN (?)",
            [unit_ids]
        );

        await conn.commit();
        res.json({ message: "Owner created successfully" });

    } catch (err) {
        await conn.rollback();
        console.error("CREATE OWNER ERROR:", err);
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

/* =========================
   UPDATE OWNER (UPDATED)
========================= */
exports.updateOwner = async (req, res) => {
    const { name, email, phone, representative_phone, representative_email, address } = req.body;  // Added missing fields

    try {
        await pool.query(
            "UPDATE owners SET name=?, email=?, phone=?, representative_phone=?, representative_email=?, address=? WHERE id=?",
            [name, email, phone, representative_phone, representative_email, address, req.params.id]
        );

        res.json({ message: "Owner updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update owner" });
    }
};

/* =========================
   DELETE OWNER
========================= */
exports.deleteOwner = async (req, res) => {
    const ownerId = req.params.id;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Get units linked to owner
        const [rows] = await conn.query(
            "SELECT unit_id FROM owner_units WHERE owner_id = ?",
            [ownerId]
        );

        const unitIds = rows.map(r => r.unit_id);

        // 2️⃣ Mark units as vacant
        if (unitIds.length > 0) {
            await conn.query(
                "UPDATE units SET status='vacant' WHERE id IN (?)",
                [unitIds]
            );
        }

        // 3️⃣ Delete owner_units mapping
        await conn.query(
            "DELETE FROM owner_units WHERE owner_id = ?",
            [ownerId]
        );

        // 4️⃣ Delete owner
        await conn.query(
            "DELETE FROM owners WHERE id = ?",
            [ownerId]
        );

        await conn.commit();
        res.json({ message: "Owner deleted successfully" });

    } catch (err) {
        await conn.rollback();
        console.error("DELETE OWNER ERROR:", err);
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};


/* =========================
   ADD UNITS TO OWNER
========================= */
exports.addUnitsToOwner = async (req, res) => {
    const { unit_ids } = req.body;
    const ownerId = req.params.id;

    if (!unit_ids || unit_ids.length === 0) {
        return res.status(400).json({ message: "No units selected" });
    }

    const values = unit_ids.map(u => [ownerId, u]);

    try {
        await pool.query(
            "INSERT INTO owner_units (owner_id, unit_id) VALUES ?",
            [values]
        );

        await pool.query(
            "UPDATE units SET status='occupied' WHERE id IN (?)",
            [unit_ids]
        );

        res.json({ message: "Units added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to add units" });
    }
};

/* =========================
   REMOVE UNIT FROM OWNER
========================= */
exports.removeUnitFromOwner = async (req, res) => {
    const { id, unitId } = req.params;

    try {
        await pool.query(
            "DELETE FROM owner_units WHERE owner_id=? AND unit_id=?",
            [id, unitId]
        );

        await pool.query(
            "UPDATE units SET status='vacant' WHERE id=?",
            [unitId]
        );

        res.json({ message: "Unit removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove unit" });
    }
};