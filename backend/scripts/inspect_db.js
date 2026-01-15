require('dotenv').config();
const pool = require('../config/db');

async function inspect() {
    try {
        const [tables] = await pool.query("SHOW TABLES");
        console.log("Tables found:", tables.map(t => Object.values(t)[0]));

        for (const t of tables) {
            const tableName = Object.values(t)[0];
            const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
            console.log(`\nTable: ${tableName}`);
            columns.forEach(c => console.log(` - ${c.Field} (${c.Type})`));
        }
        process.exit(0);
    } catch (err) {
        console.error("DB Error:", err.message);
        process.exit(1);
    }
}

inspect();
