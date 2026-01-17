const mysql = require("mysql2/promise");

const dbConfig = process.env.DATABASE_URL
  ? {
    uri: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
  : {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected using DATABASE_URL");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
