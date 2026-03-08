/**
 * ============================================================
 * QuickHire — Application Routes
 * ============================================================
 * Defines all HTTP routes related to job applications.
 *
 * Base path (mounted in server.js): /api
 *
 * Route summary:
 *  POST /api/jobs/:job_id/applications   — submit an application
 *  GET  /api/applications                — list all applications (admin)
 *  GET  /api/jobs/:job_id/applications   — list applications for one job (admin)
 * ============================================================
 */

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');

const {
  applyForJob,
  getAllApplications,
  getJobApplications,
} = require('../controllers/applicationController');

// ─── Validation Rules ─────────────────────────────────────────────────────────

/**
 * Validation chain for POST /api/jobs/:job_id/applications.
 * Ensures all required fields are present and correctly formatted
 * before the request reaches the controller.
 */
const applicationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please enter a valid email address.'),

  body('resume_link')
    .trim()
    .notEmpty().withMessage('Resume URL is required.')
    .isURL().withMessage('Resume link must be a valid URL (e.g. https://drive.google.com/...).'),

  // cover_note is completely optional — no validation needed
  body('cover_note').optional(),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Submit a job application
router.post('/jobs/:job_id/applications', applicationValidation, applyForJob);

// Admin: view all applications across every job
router.get('/applications', getAllApplications);

// Admin: view all applications for a specific job
router.get('/jobs/:job_id/applications', getJobApplications);

module.exports = router;
