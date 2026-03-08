/**
 * ============================================================
 * QuickHire — Application Controller
 * ============================================================
 * Handles all business logic related to job applications.
 *
 * Exported functions:
 *  applyForJob         — POST /api/jobs/:job_id/applications
 *  getAllApplications   — GET  /api/applications  (admin view)
 *  getJobApplications  — GET  /api/jobs/:job_id/applications
 * ============================================================
 */

const db = require('../config/db');
const { validationResult } = require('express-validator');

// ─── applyForJob ──────────────────────────────────────────────────────────────

/**
 * POST /api/jobs/:job_id/applications
 *
 * Submits a new application for a specific job.
 *
 * Business rules enforced here:
 *  1. The target job must exist.
 *  2. A candidate cannot apply to the same job twice (duplicate check by email).
 *
 * Required body fields: name, email, resume_link
 * Optional body field:  cover_note
 */
const applyForJob = async (req, res) => {
  // Reject the request early if express-validator found issues
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { job_id }                          = req.params;
    const { name, email, resume_link, cover_note } = req.body;

    // ── Rule 1: Job must exist ────────────────────────────────────────────────
    const [job] = await db.execute(
      'SELECT id, title, company FROM jobs WHERE id = ?',
      [job_id]
    );
    if (job.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // ── Rule 2: No duplicate applications from the same email ─────────────────
    const [existing] = await db.execute(
      'SELECT id FROM applications WHERE job_id = ? AND email = ?',
      [job_id, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success : false,
        message : 'You have already applied for this position.',
      });
    }

    // ── Insert the new application ────────────────────────────────────────────
    const [result] = await db.execute(
      `INSERT INTO applications (job_id, name, email, resume_link, cover_note)
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, name, email, resume_link, cover_note || null]
    );

    res.status(201).json({
      success : true,
      message : 'Application submitted successfully!',
      data    : {
        id         : result.insertId,
        job_id,
        job_title  : job[0].title,
        company    : job[0].company,
        name,
        email,
      },
    });

  } catch (error) {
    console.error('[applyForJob]', error.message);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

// ─── getAllApplications ───────────────────────────────────────────────────────

/**
 * GET /api/applications
 *
 * Returns every application in the system, joined with the corresponding
 * job title and company name for display in the admin dashboard.
 *
 * Sorted newest-first so admins see the most recent submissions at the top.
 */
const getAllApplications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT
         a.id,
         a.name,
         a.email,
         a.resume_link,
         a.cover_note,
         a.created_at,
         j.id      AS job_id,
         j.title   AS job_title,
         j.company AS company
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );

    res.json({ success: true, total: rows.length, data: rows });

  } catch (error) {
    console.error('[getAllApplications]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
};

/**
 * GET /api/jobs/:job_id/applications
 *
 * Returns all applications for a specific job.
 * Useful for admins who want to review applicants for a single listing.
 */
const getJobApplications = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM applications
       WHERE job_id = ?
       ORDER BY created_at DESC`,
      [req.params.job_id]
    );

    res.json({ success: true, total: rows.length, data: rows });

  } catch (error) {
    console.error('[getJobApplications]', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  applyForJob,
  getAllApplications,
  getJobApplications,
};
