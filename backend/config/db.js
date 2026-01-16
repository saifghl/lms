const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'lms_db', waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
console.log("DB Config:", { host: process.env.DB_HOST, user: process.env.DB_USER, database: process.env.DB_NAME, passwordLength: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0 });
module.exports = pool;
