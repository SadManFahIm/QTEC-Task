/**
 * routes/jobs.js — Job API Routes
 *
 * This file defines WHAT URLs exist and WHICH controller handles each one.
 * It also attaches express-validator rules that run BEFORE the controller —
 * if validation fails, the controller receives the errors via validationResult().
 *
 * Mounted at /api/jobs in server.js, so the full URLs are:
 *
 *   GET    /api/jobs              → list all jobs (+ search/filter via query params)
 *   GET    /api/jobs/categories   → category list with job counts
 *   GET    /api/jobs/:id          → single job detail
 *   POST   /api/jobs              → create a new job (admin)
 *   DELETE /api/jobs/:id          → delete a job (admin)
 *
 * IMPORTANT: /categories must be defined BEFORE /:id.
 * If /:id came first, Express would treat "categories" as an id value.
 */

const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getCategories,
} = require('../controllers/jobController');


// ── Validation rules for POST /api/jobs ──────────────────────
// These checks run as middleware before createJob() is called.
// If any check fails, validationResult(req) inside the controller
// will contain the errors and we return a 400 without touching the DB.
const jobValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required.')
    .isLength({ max: 255 })
    .withMessage('Job title must be 255 characters or fewer.'),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required.')
    .isLength({ max: 255 })
    .withMessage('Company name must be 255 characters or fewer.'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required.')
    .isLength({ max: 255 })
    .withMessage('Location must be 255 characters or fewer.'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required.'),

  body('type')
    .optional()
    .isIn(['Full Time', 'Part Time', 'Remote', 'Contract'])
    .withMessage('Job type must be one of: Full Time, Part Time, Remote, Contract.'),

  body('logo')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Logo must be a valid URL.'),
];


// ── Route Definitions ─────────────────────────────────────────

// GET /api/jobs?search=&category=&location=&type=
router.get('/', getAllJobs);

// GET /api/jobs/categories
// ⚠️  Must come before /:id to avoid "categories" being parsed as an id
router.get('/categories', getCategories);

// GET /api/jobs/:id
router.get('/:id', getJobById);

// POST /api/jobs  (validation middleware runs first, then createJob)
router.post('/', jobValidationRules, createJob);

// DELETE /api/jobs/:id
router.delete('/:id', deleteJob);


module.exports = router;
