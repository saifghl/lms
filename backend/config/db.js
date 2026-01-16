const path = require("path");
const mysql = require("mysql2/promise");

// Load .env (for local development)
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // ✅ REQUIRED for Clever Cloud MySQL
  ssl: {
    rejectUnauthorized: false,
  },
});

// Log only safe info
console.log("✅ DB Config Loaded:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  passwordLength: process.env.DB_PASSWORD
    ? process.env.DB_PASSWORD.length
    : 0,
});

// Optional: Test DB connection immediately
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("DB Config:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    passwordLength: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0
});

module.exports = pool;
