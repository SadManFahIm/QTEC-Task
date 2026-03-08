/**
 * routes/applications.js — Application API Routes
 *
 * Mounted at /api in server.js (not /api/applications) because the
 * "apply" endpoint is nested under a job:
 *
 *   POST  /api/jobs/:job_id/applications   → submit an application
 *   GET   /api/applications                → admin: list all applications
 *   GET   /api/jobs/:job_id/applications   → admin: applications for one job
 *
 * Validation runs before the controller — invalid emails or missing
 * fields are rejected here before any database call is made.
 */

const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const {
  applyForJob,
  getAllApplications,
  getJobApplications,
} = require('../controllers/applicationController');


// ── Validation rules for POST /api/jobs/:job_id/applications ─
const applicationValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ max: 255 })
    .withMessage('Name must be 255 characters or fewer.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(), // lowercases + removes dots in Gmail etc.

  body('resume_link')
    .trim()
    .notEmpty()
    .withMessage('Resume URL is required.')
    .isURL()
    .withMessage('Resume link must be a valid URL (e.g. https://drive.google.com/...).'),

  body('cover_note')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Cover note must be 2000 characters or fewer.'),
];


// ── Route Definitions ─────────────────────────────────────────

// POST /api/jobs/:job_id/applications
router.post('/jobs/:job_id/applications', applicationValidationRules, applyForJob);

// GET /api/applications  (admin: all applications across all jobs)
router.get('/applications', getAllApplications);

// GET /api/jobs/:job_id/applications  (admin: applications for a specific job)
router.get('/jobs/:job_id/applications', getJobApplications);


module.exports = router;
