/**
 * controllers/jobController.js — Job Business Logic
 *
 * Controllers are the "brain" of each API endpoint.
 * They receive a validated request, talk to the database,
 * and send back a structured JSON response.
 *
 * We keep database queries here (not in the route files) so that:
 *   - Route files stay small and readable
 *   - Logic can be unit-tested independently
 *   - Multiple routes could reuse the same controller function
 *
 * Every function follows the same pattern:
 *   1. Read inputs from req.query / req.params / req.body
 *   2. Build and execute a MySQL query
 *   3. Return a consistent JSON shape: { success, data, message }
 *   4. Catch any unexpected errors and forward them as 500 responses
 */

const db                  = require('../config/db');
const { validationResult } = require('express-validator');


// ─────────────────────────────────────────────────────────────
//  GET /api/jobs   — List all jobs (with optional filtering)
// ─────────────────────────────────────────────────────────────

/**
 * getAllJobs
 *
 * Supports four optional query parameters:
 *   ?search=designer     →  matches title, company, or description
 *   ?category=Design     →  exact category match
 *   ?location=london     →  partial location match
 *   ?type=Full+Time      →  exact type match
 *
 * We build the SQL query dynamically by appending WHERE clauses
 * only when a filter is actually provided. Using parameterised
 * queries (? placeholders) prevents SQL injection attacks.
 */
const getAllJobs = async (req, res) => {
  try {
    const { search, category, location, type } = req.query;

    // Start with a base query that always returns results
    let query  = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    // Full-text search across the three most relevant columns
    if (search) {
      query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Exact match for category (values come from a fixed enum)
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Partial match for location so "New York" also matches "New York, US"
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    // Exact match for job type (Full Time / Part Time / Remote / Contract)
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    // Always show newest jobs first
    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);

    res.json({
      success: true,
      total:   rows.length,
      data:    rows,
    });
  } catch (error) {
    console.error('getAllJobs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  GET /api/jobs/:id   — Single job detail
// ─────────────────────────────────────────────────────────────

/**
 * getJobById
 *
 * Fetches one job by its primary key.
 * Returns 404 if no row matches so the frontend can show
 * a "job not found" page instead of crashing.
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT * FROM jobs WHERE id = ?',
      [id]
    );

    // No matching row → 404
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Job with id ${id} was not found.`,
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('getJobById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  POST /api/jobs   — Create a new job (Admin only)
// ─────────────────────────────────────────────────────────────

/**
 * createJob
 *
 * Expects a JSON body with: title, company, location, category,
 * description, type (optional), logo (optional).
 *
 * express-validator runs its checks before this function is called
 * (see routes/jobs.js). We just need to check the result here and
 * return the validation errors if any field failed.
 *
 * After inserting, we SELECT the newly created row and return it
 * so the frontend immediately has the full object (including the
 * auto-generated id and created_at timestamp).
 */
const createJob = async (req, res) => {
  // Check if any validation rule failed (defined in routes/jobs.js)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please fix the errors below.',
      errors:  errors.array(), // e.g. [{ field: 'title', msg: 'Required' }]
    });
  }

  try {
    const { title, company, location, category, type, description, logo } = req.body;

    // Insert the new job row
    const [result] = await db.execute(
      `INSERT INTO jobs (title, company, location, category, type, description, logo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        company,
        location,
        category,
        type        || 'Full Time', // default if not provided
        description,
        logo        || null,        // logo is optional
      ]
    );

    // Fetch the freshly created row so we can return the complete object
    const [newJob] = await db.execute(
      'SELECT * FROM jobs WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Job listing created successfully.',
      data:    newJob[0],
    });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to create job.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  DELETE /api/jobs/:id   — Remove a job listing (Admin only)
// ─────────────────────────────────────────────────────────────

/**
 * deleteJob
 *
 * Soft-checks that the job exists before deleting so we can return
 * a meaningful 404 rather than silently doing nothing.
 *
 * Because the applications table has ON DELETE CASCADE set on its
 * foreign key, all applications linked to this job are automatically
 * deleted too — no extra query needed.
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the job exists before trying to delete it
    const [rows] = await db.execute('SELECT id FROM jobs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Job with id ${id} was not found.`,
      });
    }

    await db.execute('DELETE FROM jobs WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Job listing deleted successfully.',
    });
  } catch (error) {
    console.error('deleteJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  GET /api/jobs/categories   — Category list with job counts
// ─────────────────────────────────────────────────────────────

/**
 * getCategories
 *
 * Returns each distinct category alongside the number of active
 * job listings in that category. Used to populate the "Explore
 * by Category" section on the landing page and the filter sidebar.
 *
 * Sorted by count DESC so the most popular categories appear first.
 */
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         category,
         COUNT(*) AS count
       FROM jobs
       GROUP BY category
       ORDER BY count DESC`
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};


module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getCategories,
};
