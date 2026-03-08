/**
 * ============================================================
 * QuickHire — Express.js Backend Server
 * ============================================================
 * Entry point for the QuickHire REST API.
 *
 * Responsibilities:
 *  - Initialize the Express application
 *  - Register global middleware (CORS, JSON parsing)
 *  - Mount API route handlers
 *  - Start the HTTP server on the configured port
 * ============================================================
 */

const express = require('express');
const cors    = require('cors');

// Load environment variables from .env file into process.env
require('dotenv').config();

// ─── App Initialization ───────────────────────────────────────────────────────

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

/**
 * CORS (Cross-Origin Resource Sharing)
 * Allows the frontend (Next.js dev server or production URL) to communicate
 * with this backend without being blocked by browser security policies.
 */
app.use(cors({
  origin      : process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials : true,
}));

/**
 * Body parsers
 * express.json()          — parses incoming requests with JSON payloads
 * express.urlencoded()    — parses URL-encoded form data
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Route Registration ───────────────────────────────────────────────────────

const jobRoutes         = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// All job-related endpoints:         /api/jobs/*
app.use('/api/jobs', jobRoutes);

// All application-related endpoints: /api/jobs/:id/applications  &  /api/applications
app.use('/api', applicationRoutes);

// ─── Utility Endpoints ────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Simple health-check endpoint used by deployment platforms (Railway, Render)
 * to verify the server is alive and responding.
 */
app.get('/api/health', (req, res) => {
  res.json({
    success   : true,
    message   : 'QuickHire API is up and running!',
    timestamp : new Date().toISOString(),
  });
});

// ─── Error Handling Middleware ────────────────────────────────────────────────

/**
 * 404 — Route Not Found
 * Catches any request that didn't match a registered route above.
 */
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * 500 — Global Error Handler
 * Catches any unhandled errors thrown inside route handlers or middleware.
 * The `next` parameter must be present even if unused — Express identifies
 * error-handling middleware by its 4-argument signature.
 */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success : false,
    message : 'Something went wrong on the server. Please try again.',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀  QuickHire API is running`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health\n`);
});
