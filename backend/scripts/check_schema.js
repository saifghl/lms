require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lms_db', // Adjust if known
};

async function check() {
    let connection;
    try {
        console.log("Connecting to DB...", dbConfig.host);
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query("DESCRIBE activity_logs");
        console.log("Columns in activity_logs:");
        rows.forEach(r => console.log(`- ${r.Field} (${r.Type})`));
    } catch (e) {
        console.error(e);
    } finally {
        if (connection) await connection.end();
    }
}

check();
