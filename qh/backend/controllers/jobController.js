/**
 * ============================================================
 * QuickHire — Job Controller
 * ============================================================
 * Contains all business logic for job-related API endpoints.
 *
 * Exported functions (each maps to one route):
 *  getAllJobs    — GET  /api/jobs
 *  getJobById   — GET  /api/jobs/:id
 *  createJob    — POST /api/jobs
 *  deleteJob    — DELETE /api/jobs/:id
 *  getCategories — GET /api/jobs/categories
 * ============================================================
 */

const db = require('../config/db');
const { validationResult } = require('express-validator');

// ─── getAllJobs ───────────────────────────────────────────────────────────────

/**
 * GET /api/jobs
 *
 * Returns all jobs, with optional query-string filters:
 *  ?search=keyword   — matches against title, company, or description
 *  ?category=Design  — exact category match
 *  ?location=London  — partial location match (LIKE)
 *  ?type=Full+Time   — exact employment-type match
 *
 * Results are always sorted newest-first.
 */
const getAllJobs = async (req, res) => {
  try {
    const { search, category, location, type } = req.query;

    // Start with a base query that always returns true so we can
    // safely append AND clauses without worrying about the first one
    let query  = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    // Full-text style search: matches title, company name, or description
    if (search) {
      query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Exact category filter (e.g. "Design", "Marketing")
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Partial location filter so "London" also matches "London, UK"
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    // Exact job-type filter (e.g. "Full Time", "Remote")
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);

    res.json({
      success : true,
      total   : rows.length,
      data    : rows,
    });

  } catch (error) {
    console.error('[getAllJobs]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs.' });
  }
};

// ─── getJobById ───────────────────────────────────────────────────────────────

/**
 * GET /api/jobs/:id
 *
 * Returns a single job record by its primary key.
 * Responds with 404 if no matching job is found.
 */
const getJobById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM jobs WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.json({ success: true, data: rows[0] });

  } catch (error) {
    console.error('[getJobById]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch job.' });
  }
};

// ─── createJob ────────────────────────────────────────────────────────────────

/**
 * POST /api/jobs
 *
 * Creates a new job listing (admin only — no auth middleware in this version).
 * Reads the validated body fields: title, company, location, category, type,
 * description, logo (optional).
 *
 * Returns the newly created job object so the frontend can update its UI
 * immediately without needing a separate GET request.
 */
const createJob = async (req, res) => {
  // Check if express-validator found any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, company, location, category, type, description, logo } = req.body;

    const [result] = await db.execute(
      `INSERT INTO jobs (title, company, location, category, type, description, logo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        company,
        location,
        category,
        type  || 'Full Time', // default to Full Time if not provided
        description,
        logo  || null,        // logo is optional
      ]
    );

    // Fetch the newly inserted row to return complete data (including timestamps)
    const [newJob] = await db.execute(
      'SELECT * FROM jobs WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success : true,
      message : 'Job created successfully.',
      data    : newJob[0],
    });

  } catch (error) {
    console.error('[createJob]', error.message);
    res.status(500).json({ success: false, message: 'Failed to create job.' });
  }
};

// ─── deleteJob ────────────────────────────────────────────────────────────────

/**
 * DELETE /api/jobs/:id
 *
 * Permanently removes a job listing.
 * Because the applications table has ON DELETE CASCADE on the job_id foreign key,
 * all related applications are automatically removed as well.
 *
 * Responds with 404 if the job doesn't exist.
 */
const deleteJob = async (req, res) => {
  try {
    // Verify the job exists before attempting deletion
    const [rows] = await db.execute(
      'SELECT id FROM jobs WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    await db.execute('DELETE FROM jobs WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Job deleted successfully.' });

  } catch (error) {
    console.error('[deleteJob]', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
};

// ─── getCategories ────────────────────────────────────────────────────────────

/**
 * GET /api/jobs/categories
 *
 * Returns a list of distinct job categories with the number of active
 * listings in each, sorted by count descending.
 *
 * Used by:
 *  - The "Explore by Category" section on the landing page
 *  - The category filter sidebar on the job listings page
 */
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT category, COUNT(*) AS count
       FROM jobs
       GROUP BY category
       ORDER BY count DESC`
    );

    res.json({ success: true, data: rows });

  } catch (error) {
    console.error('[getCategories]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getCategories,
};
