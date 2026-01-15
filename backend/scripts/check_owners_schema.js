const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../config/db');

async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE owners");
        console.log("Columns in owners table:");
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkSchema();
