const pool = require('../config/db');

// Assign parties as owners to a unit (Joint Owners)
exports.assignOwner = async (req, res) => {
    const { unit_id, owners, start_date } = req.body; // owners: [{party_id, share_percentage}]

    if (!Array.isArray(owners) || owners.length === 0 || owners.length > 4) {
        return res.status(400).json({ message: 'Must provide 1 to 4 joint owners.' });
    }

    const totalShare = owners.reduce((sum, o) => sum + Number(o.share_percentage || 0), 0);
    if (Math.abs(totalShare - 100) > 0.01) {
        return res.status(400).json({ message: 'Total share percentage must be exactly 100%.' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Optional: Ensure all existing active are removed or just check?
        // Let's rely on removeOwner to remove previous owners.
        
        // Check if any of these parties is already an active owner
        for (const owner of owners) {
            const [existing] = await conn.query(
                'SELECT * FROM unit_ownerships WHERE unit_id = ? AND party_id = ? AND ownership_status = "Active"',
                [unit_id, owner.party_id]
            );
            if (existing.length > 0) {
                await conn.rollback();
                return res.status(400).json({ message: 'One or more parties is already an active owner.' });
            }
        }

        const assignDate = start_date || new Date();
        for (const owner of owners) {
            await conn.query(
                'INSERT INTO unit_ownerships (unit_id, party_id, start_date, ownership_status, share_percentage) VALUES (?, ?, ?, "Active", ?)',
                [unit_id, owner.party_id, assignDate, owner.share_percentage]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Owners assigned successfully' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        conn.release();
    }
};

// Remove an owner (mark as Inactive/Sold)
exports.removeOwner = async (req, res) => {
    const { unit_id, party_id, end_date, status } = req.body; // status can be 'Inactive' or 'Sold'

    try {
        await pool.query(
            'UPDATE unit_ownerships SET ownership_status = ?, end_date = ? WHERE unit_id = ? AND party_id = ? AND ownership_status = "Active"',
            [status || 'Inactive', end_date || new Date(), unit_id, party_id]
        );

        res.json({ message: 'Owner removed/updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get owners for a unit
exports.getOwnersByUnit = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT uo.*, p.first_name, p.last_name, p.company_name, p.type 
             FROM unit_ownerships uo 
             JOIN parties p ON uo.party_id = p.id 
             WHERE uo.unit_id = ? ORDER BY uo.ownership_status ASC, uo.start_date DESC`,
            [req.params.unitId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get units owned by a party
exports.getUnitsByParty = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT uo.*, u.unit_number, pr.project_name 
             FROM unit_ownerships uo 
             JOIN units u ON uo.unit_id = u.id 
             JOIN projects pr ON u.project_id = pr.id
             WHERE uo.party_id = ?`,
            [req.params.partyId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all ownership document types
exports.getDocumentTypes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ownership_document_types WHERE is_active = TRUE');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a new document type
exports.addDocumentType = async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query('INSERT INTO ownership_document_types (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Document type added successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Document type already exists' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Upload an ownership document
exports.uploadOwnershipDocument = async (req, res) => {
    try {
        console.log("Upload Request Body:", req.body);
        console.log("Upload Request File:", req.file);

        const { unit_id, party_id, document_type_id, document_date } = req.body || {};
        const file_path = req.file ? `/uploads/${req.file.filename}` : null;

        if (!file_path) {
            console.error("Upload Error: No file found in request");
            return res.status(400).json({ message: 'No file uploaded' });
        }

        await pool.query(
            `INSERT INTO unit_ownership_documents 
            (unit_id, party_id, document_type_id, document_date, file_path) 
            VALUES (?, ?, ?, ?, ?)`,
            [unit_id, party_id, document_type_id, document_date, file_path]
        );

        res.status(201).json({ message: 'Document uploaded successfully', file_path });
    } catch (err) {
        console.error("Upload Controller Error:", err);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
};

// Get documents for a specific ownership (unit + party)
exports.getOwnershipDocuments = async (req, res) => {
    try {
        const { unitId, partyId } = req.params;
        const [rows] = await pool.query(
            `SELECT uod.*, odt.name as document_type_name 
             FROM unit_ownership_documents uod
             LEFT JOIN ownership_document_types odt ON uod.document_type_id = odt.id
             WHERE uod.unit_id = ? AND uod.party_id = ?
             ORDER BY uod.document_date ASC`,
            [unitId, partyId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
