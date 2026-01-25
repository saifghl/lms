require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('../config/db');

const checkSchema = async () => {
    try {
        const connection = await pool.getConnection();
        const tables = ['owners', 'tenants', 'leases', 'units'];

        for (const table of tables) {
            console.log(`\n--- ${table} ---`);
            try {
                const [columns] = await connection.query(`SHOW COLUMNS FROM ${table}`);
                console.log(columns.map(c => `${c.Field} (${c.Type})`).join(', '));
            } catch (e) {
                console.log(`Table ${table} likely does not exist.`);
            }
        }
        connection.release();
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkSchema();
