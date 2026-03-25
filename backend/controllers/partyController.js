const pool = require('../config/db');

// Get all parties
exports.getAllParties = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM parties ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single party by ID
exports.getPartyById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM parties WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Party not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a new party
exports.createParty = async (req, res) => {
    const {
        type, party_type, company_name, brand_name, brand_category, legal_entity_type, title, first_name, last_name,
        email, phone, alt_phone, identification_type, identification_number,
        address_line1, address_line2, city, state, postal_code, country,
        representative_designation, owner_group
    } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO parties (
                type, party_type, company_name, brand_name, brand_category, legal_entity_type, title, first_name, last_name,
                email, phone, alt_phone, identification_type, identification_number,
                address_line1, address_line2, city, state, postal_code, country,
                representative_designation, owner_group
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                type || 'Individual', party_type || 'Tenant', company_name, brand_name, brand_category, legal_entity_type, title, first_name, last_name,
                email, phone, alt_phone, identification_type, identification_number,
                address_line1, address_line2, city, state, postal_code, country,
                representative_designation, owner_group
            ]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a party
exports.updateParty = async (req, res) => {
    const {
        type, party_type, company_name, brand_name, brand_category, legal_entity_type, title, first_name, last_name,
        email, phone, alt_phone, identification_type, identification_number,
        address_line1, address_line2, city, state, postal_code, country,
        representative_designation, owner_group
    } = req.body;

    try {
        await pool.query(
            `UPDATE parties SET
                type=?, party_type=?, company_name=?, brand_name=?, brand_category=?, legal_entity_type=?, title=?, first_name=?, last_name=?,
                email=?, phone=?, alt_phone=?, identification_type=?, identification_number=?,
                address_line1=?, address_line2=?, city=?, state=?, postal_code=?, country=?,
                representative_designation=?, owner_group=?
             WHERE id=?`,
            [
                type, party_type, company_name, brand_name, brand_category, legal_entity_type, title, first_name, last_name,
                email, phone, alt_phone, identification_type, identification_number,
                address_line1, address_line2, city, state, postal_code, country,
                representative_designation, owner_group,
                req.params.id
            ]
        );
        res.json({ message: 'Party updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a party
exports.deleteParty = async (req, res) => {
    try {
        await pool.query('DELETE FROM parties WHERE id = ?', [req.params.id]);
        res.json({ message: 'Party deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
