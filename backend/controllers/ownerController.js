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
        const { search } = req.query;
        let query = `
            SELECT 
                o.id,
                o.name,
                o.email,
                o.phone,
                o.kyc_status,
                o.created_at,
                (SELECT document_path FROM owner_documents WHERE owner_id = o.id ORDER BY uploaded_at DESC LIMIT 1) as document_path,
                (SELECT document_type FROM owner_documents WHERE owner_id = o.id ORDER BY uploaded_at DESC LIMIT 1) as document_type
            FROM owners o
        `;

        const params = [];

        if (search) {
            query += ` WHERE o.name LIKE ? OR o.email LIKE ? OR o.phone LIKE ? OR o.kyc_status LIKE ?`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY o.created_at DESC`;

        const [rows] = await pool.query(query, params);

        res.json(rows);
    } catch (err) {
        console.error("GET OWNERS ERROR:", err);
        res.status(500).json({
            message: "Failed to fetch owners",
            error: err.message,
            stack: err.stack
        });
    }
};

/* =========================
   EXPORT OWNERS REPORT
========================= */
exports.exportOwners = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                name,
                email,
                phone,
                representative_name,
                gst_number,
                total_owned_area,
                address,
                kyc_status,
                created_at
            FROM owners
            ORDER BY created_at DESC
        `);

        console.log("Exporting owners, found:", rows.length);

        // Manual CSV Generation
        const fields = [
            'id', 'name', 'email', 'phone',
            'representative_name', 'gst_number', 'total_owned_area',
            'address', 'kyc_status', 'created_at'
        ];
        const csvRows = [];

        // Header
        csvRows.push(fields.join(','));

        // Data
        for (const row of rows) {
            const values = fields.map(field => {
                const val = row[field];
                // Escape quotes and wrap in quotes if necessary
                if (val === null || val === undefined) return '';
                // Handle date formatting if needed, but string is fine
                const str = String(val).replace(/"/g, '""');
                return `"${str}"`;
            });
            csvRows.push(values.join(','));
        }

        const csv = csvRows.join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('kyc_report.csv');
        return res.send(csv);

    } catch (err) {
        console.error("EXPORT OWNERS ERROR:", err);
        res.status(500).json({ message: "Failed to export owners" });
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
        representative_phone,
        representative_email,
        address,
        unit_ids
    } = req.body;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        let totalOwnedArea = 0;

        // 1️⃣ Calculate Area if units are provided
        if (unit_ids && unit_ids.length > 0) {
            const [units] = await conn.query(
                "SELECT id, super_area FROM units WHERE id IN (?)",
                [unit_ids]
            );
            if (units.length > 0) {
                totalOwnedArea = units.reduce(
                    (sum, u) => sum + Number(u.super_area),
                    0
                );
            }
        }

        // 2️⃣ Insert owner
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
                representative_phone || null,
                representative_email || null,
                address || null,
                totalOwnedArea,
                null,
                "pending"
            ]
        );

        const ownerId = ownerResult.insertId;

        // 3️⃣ Owner-unit mapping (only if units provided)
        if (unit_ids && unit_ids.length > 0) {
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
        }

        await conn.commit();
        res.json({ message: "Owner created successfully" });

    } catch (err) {
        await conn.rollback();
        console.error("CREATE OWNER ERROR:", err);
        console.error("SQL Message:", err.sqlMessage);
        res.status(500).json({ message: "Failed to add owner: " + err.message });
    } finally {
        conn.release();
    }
};

/* =========================
   UPDATE OWNER (UPDATED)
========================= */
exports.updateOwner = async (req, res) => {
    const ownerId = req.params.id;
    const updates = req.body;

    // Allowed fields to prevent SQL injection or unwanted updates (e.g. id)
    const allowedFields = [
        'name', 'email', 'phone', 'representative_name',
        'representative_phone', 'representative_email',
        'address', 'gst_number', 'kyc_status'
    ];

    try {
        const fieldsToUpdate = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        values.push(ownerId);

        await pool.query(
            `UPDATE owners SET ${fieldsToUpdate.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: "Owner updated successfully" });
    } catch (err) {
        console.error("UPDATE OWNER ERROR:", err);
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

/* =========================
   GET KYC STATS
========================= */
exports.getKycStats = async (req, res) => {
    try {
        const [total] = await pool.query(`SELECT COUNT(*) as count FROM owners`);
        const [pending] = await pool.query(`SELECT COUNT(*) as count FROM owners WHERE kyc_status = 'pending' OR kyc_status IS NULL`);
        const [verified] = await pool.query(`SELECT COUNT(*) as count FROM owners WHERE kyc_status = 'verified'`);
        const [rejected] = await pool.query(`SELECT COUNT(*) as count FROM owners WHERE kyc_status = 'rejected'`);

        res.json({
            total: total[0].count,
            pending: pending[0].count,
            verified: verified[0].count,
            rejected: rejected[0].count
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch KYC stats" });
    }
};

/* =========================
   OWNER DOCUMENTS APIs
========================= */
exports.getOwnerDocuments = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM owner_documents WHERE owner_id = ? ORDER BY uploaded_at DESC",
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Failed to get documents" });
    }
};

exports.uploadDocument = async (req, res) => {
    // Assuming multer middleware handles file upload and puts it in req.file
    try {
        const ownerId = req.params.id;
        const { document_type } = req.body;
        const filePath = req.file ? req.file.path : null;

        if (!filePath) return res.status(400).json({ message: "No file uploaded" });

        await pool.query(
            "INSERT INTO owner_documents (owner_id, document_type, document_path) VALUES (?, ?, ?)",
            [ownerId, document_type || "General", filePath]
        );

        res.json({ message: "Document uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to upload document" });
    }
};

/* =========================
   OWNER MESSAGES APIs
========================= */
exports.sendMessage = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const { subject, message } = req.body;

        await pool.query(
            "INSERT INTO owner_messages (owner_id, subject, message) VALUES (?, ?, ?)",
            [ownerId, subject || "No Subject", message]
        );

        res.json({ message: "Message sent successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
};