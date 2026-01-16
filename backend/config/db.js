const mysql = require("mysql2/promise");

// ⚠️ Render already injects env variables → no need for dotenv here
// dotenv is only needed locally, not on Render

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // ✅ Required for Clever Cloud MySQL
  ssl: {
    rejectUnauthorized: false,
  },
});

// Safe log
console.log("✅ DB Config Loaded:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  passwordLength: process.env.DB_PASSWORD
    ? process.env.DB_PASSWORD.length
    : 0,
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
