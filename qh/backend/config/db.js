/**
 * ============================================================
 * QuickHire — MySQL Database Connection Pool
 * ============================================================
 * Creates and exports a mysql2 connection pool so that all
 * controllers can share pre-established database connections
 * rather than opening a new connection on every request.
 *
 * Why a pool?
 *  - Reuses existing connections → lower latency
 *  - Limits max simultaneous DB connections → avoids exhaustion
 *  - Automatically handles connection timeouts and reconnects
 * ============================================================
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Create a connection pool using values from the .env file.
 *
 * Configuration options:
 *  host             — MySQL server hostname (usually 'localhost')
 *  user             — MySQL username
 *  password         — MySQL password
 *  database         — The specific database to connect to
 *  waitForConnections — Queue requests when all connections are busy
 *  connectionLimit  — Maximum number of simultaneous connections in the pool
 *  queueLimit       — Max number of queued requests (0 = unlimited)
 */
const pool = mysql.createPool({
  host              : process.env.DB_HOST     || 'localhost',
  user              : process.env.DB_USER     || 'root',
  password          : process.env.DB_PASSWORD || '',
  database          : process.env.DB_NAME     || 'quickhire',
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
});

module.exports = pool;
