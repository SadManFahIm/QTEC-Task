/**
 * server.js — QuickHire Application Entry Point
 *
 * This file bootstraps the Express server. It sets up:
 *   - CORS (so our Next.js frontend can talk to this API)
 *   - JSON body parsing (so we can read req.body)
 *   - Route mounting (jobs + applications)
 *   - A health-check endpoint (useful for deployment platforms)
 *   - Global 404 and error handlers
 *
 * Start with:  npm run dev   (uses nodemon for auto-restart)
 *              npm start     (production)
 */

const express = require('express');
const cors    = require('cors');
require('dotenv').config(); // Load .env variables into process.env

const app = express();

// ─────────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────────

/**
 * CORS — Cross-Origin Resource Sharing
 * Allows requests from our frontend (localhost:3000 in dev, Vercel URL in prod).
 * Without this, the browser will block API calls from a different origin.
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // allow cookies / auth headers if needed later
}));

// Parse incoming JSON request bodies  →  makes req.body available
app.use(express.json());

// Parse URL-encoded form data  (e.g. traditional HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────

const jobRoutes         = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// All job-related endpoints live under /api/jobs
// e.g. GET /api/jobs, POST /api/jobs, DELETE /api/jobs/:id
app.use('/api/jobs', jobRoutes);

// Application endpoints are mixed:
//   POST  /api/jobs/:job_id/applications  (apply for a job)
//   GET   /api/applications               (admin: view all applications)
app.use('/api', applicationRoutes);

// ─────────────────────────────────────────────
//  HEALTH CHECK
// ─────────────────────────────────────────────

/**
 * GET /api/health
 * Quick endpoint to verify the server is up and running.
 * Useful for Railway, Render, or any deployment health probe.
 */
app.get('/api/health', (req, res) => {
  res.json({
    success:   true,
    message:   'QuickHire API is running!',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
//  ERROR HANDLERS  (must be defined AFTER routes)
// ─────────────────────────────────────────────

/**
 * 404 — Route Not Found
 * Catches any request that didn't match an existing route.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * 500 — Global Error Handler
 * Express calls this whenever next(err) is invoked in any route/middleware.
 * Having a single, central error handler keeps error formatting consistent.
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
  });
});

// ─────────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 QuickHire API is running`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health\n`);
});
