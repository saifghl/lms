const db = require('../config/db');

exports.getFilterOptions = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM filter_options WHERE status = "active"';
    let params = [];
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY option_value ASC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

exports.addFilterOption = async (req, res) => {
  try {
    const { category, option_value } = req.body;
    if (!category || !option_value) {
      return res.status(400).json({ success: false, error: 'Category and option_value are required' });
    }
    const [result] = await db.execute(
      'INSERT INTO filter_options (category, option_value) VALUES (?, ?)',
      [category, option_value]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Filter option added' });
  } catch (error) {
    console.error('Error adding filter option:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'Option already exists for this category' });
    }
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

exports.deleteFilterOption = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM filter_options WHERE id = ?', [id]);
    res.json({ success: true, message: 'Filter option deleted' });
  } catch (error) {
    console.error('Error deleting filter option:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};
