/**
 * controllers/applicationController.js — Application Business Logic
 *
 * Handles everything related to job applications:
 *   - Submitting a new application (candidate-facing)
 *   - Listing all applications (admin-facing)
 *   - Listing applications for a specific job (admin-facing)
 *
 * Key business rules enforced here:
 *   1. The target job must exist before we accept an application.
 *   2. An email address can only apply to the same job once
 *      (duplicate check prevents spam / accidental double-submissions).
 *   3. All required fields are validated by express-validator in the
 *      route file BEFORE this controller is called.
 */

const db                  = require('../config/db');
const { validationResult } = require('express-validator');


// ─────────────────────────────────────────────────────────────
//  POST /api/jobs/:job_id/applications  — Submit an application
// ─────────────────────────────────────────────────────────────

/**
 * applyForJob
 *
 * Accepts: name, email, resume_link, cover_note (optional)
 * from the request body, plus job_id from the URL parameter.
 *
 * Steps:
 *   1. Run express-validator checks
 *   2. Confirm the job still exists (it may have been deleted)
 *   3. Check for a duplicate (same email + same job)
 *   4. Insert the application row
 *   5. Return the created application (without sensitive DB internals)
 */
const applyForJob = async (req, res) => {
  // If any validation rule in routes/applications.js failed, return errors now
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors:  errors.array(),
    });
  }

  try {
    const { job_id }                        = req.params;
    const { name, email, resume_link, cover_note } = req.body;

    // ── Step 1: Does the job exist? ──────────────────────────
    const [jobRows] = await db.execute(
      'SELECT id, title, company FROM jobs WHERE id = ?',
      [job_id]
    );
    if (jobRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'The job you are applying to no longer exists.',
      });
    }

    // ── Step 2: Has this email already applied to this job? ──
    const [existing] = await db.execute(
      'SELECT id FROM applications WHERE job_id = ? AND email = ?',
      [job_id, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ // 409 Conflict is the correct HTTP status here
        success: false,
        message: 'You have already submitted an application for this job.',
      });
    }

    // ── Step 3: Insert the application ──────────────────────
    const [result] = await db.execute(
      `INSERT INTO applications (job_id, name, email, resume_link, cover_note)
       VALUES (?, ?, ?, ?, ?)`,
      [job_id, name, email, resume_link, cover_note || null]
    );

    res.status(201).json({
      success: true,
      message: `Your application to ${jobRows[0].company} has been submitted successfully!`,
      data: {
        id:         result.insertId,
        job_id:     Number(job_id),
        job_title:  jobRows[0].title,
        company:    jobRows[0].company,
        name,
        email,
      },
    });
  } catch (error) {
    console.error('applyForJob error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  GET /api/applications   — All applications (Admin view)
// ─────────────────────────────────────────────────────────────

/**
 * getAllApplications
 *
 * Returns every application in the system, joined with the job's
 * title and company name so the admin doesn't have to make a
 * separate request to look up each job.
 *
 * Sorted newest-first so admins immediately see the latest submissions.
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
         j.company
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );

    res.json({
      success: true,
      total:   rows.length,
      data:    rows,
    });
  } catch (error) {
    console.error('getAllApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
};


// ─────────────────────────────────────────────────────────────
//  GET /api/jobs/:job_id/applications  — Applications for one job
// ─────────────────────────────────────────────────────────────

/**
 * getJobApplications
 *
 * Returns all applications for a specific job.
 * Useful when an admin wants to review candidates for one posting.
 */
const getJobApplications = async (req, res) => {
  try {
    const { job_id } = req.params;

    const [rows] = await db.execute(
      `SELECT * FROM applications
       WHERE job_id = ?
       ORDER BY created_at DESC`,
      [job_id]
    );

    res.json({
      success: true,
      total:   rows.length,
      data:    rows,
    });
  } catch (error) {
    console.error('getJobApplications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
};


module.exports = {
  applyForJob,
  getAllApplications,
  getJobApplications,
};
