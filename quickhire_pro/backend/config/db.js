/**
 * config/db.js — MySQL Connection Pool
 *
 * Instead of opening a new database connection for every request
 * (which is slow and wastes resources), we use a CONNECTION POOL.
 *
 * A pool keeps a set of reusable connections open. When a request
 * needs the database, it borrows a connection from the pool, uses it,
 * then returns it — all automatically.
 *
 * We export the pool so any controller can import it and run queries
 * with: const [rows] = await pool.execute('SELECT ...', [params]);
 *
 * Credentials are loaded from the .env file — never hardcode passwords!
 */

const mysql  = require('mysql2/promise'); // promise-based MySQL driver
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'quickhire',

  // Maximum number of connections kept open at once.
  // 10 is a safe default for small-to-medium applications.
  connectionLimit: 10,

  // If all connections are busy, new requests wait in a queue.
  // Setting this to true prevents errors like "No connections available".
  waitForConnections: true,

  // 0 means the queue can grow indefinitely (no hard cap on waiting requests).
  queueLimit: 0,
});

// Test the connection once at startup so we know immediately if credentials are wrong.
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release(); // return the connection back to the pool
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('   Make sure MySQL is running and .env credentials are correct.');
  });

module.exports = pool;
