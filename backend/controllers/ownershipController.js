const pool = require('../config/db');

// Assign a party as an owner to a unit
exports.assignOwner = async (req, res) => {
    const { unit_id, party_id, start_date } = req.body;

    try {
        // Check if already assigned and active
        const [existing] = await pool.query(
            'SELECT * FROM unit_ownerships WHERE unit_id = ? AND party_id = ? AND ownership_status = "Active"',
            [unit_id, party_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Party is already an active owner of this unit' });
        }

        await pool.query(
            'INSERT INTO unit_ownerships (unit_id, party_id, start_date, ownership_status) VALUES (?, ?, ?, "Active")',
            [unit_id, party_id, start_date || new Date()]
        );

        res.status(201).json({ message: 'Owner assigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
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
