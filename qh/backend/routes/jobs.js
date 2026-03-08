/**
 * ============================================================
 * QuickHire — Job Routes
 * ============================================================
 * Defines all HTTP routes related to job listings and maps
 * them to the corresponding controller functions.
 *
 * Base path (mounted in server.js): /api/jobs
 *
 * Route summary:
 *  GET    /api/jobs              — list all jobs (with optional filters)
 *  GET    /api/jobs/categories   — list categories + job counts
 *  GET    /api/jobs/:id          — get a single job by ID
 *  POST   /api/jobs              — create a new job (admin)
 *  DELETE /api/jobs/:id          — delete a job by ID (admin)
 *
 * Note: /categories must be registered BEFORE /:id so that Express
 * does not try to interpret "categories" as a numeric ID parameter.
 * ============================================================
 */

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');

const {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getCategories,
} = require('../controllers/jobController');

// ─── Validation Rules ─────────────────────────────────────────────────────────

/**
 * Validation chain applied to the POST /api/jobs endpoint.
 * express-validator runs these checks before the request reaches the controller.
 * The controller then calls validationResult(req) to read the outcome.
 */
const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required.'),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required.'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required.'),

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
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Logo must be a valid URL if provided.'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// IMPORTANT: /categories must come before /:id to avoid route conflicts
router.get('/categories',    getCategories);

router.get('/',              getAllJobs);
router.get('/:id',           getJobById);
router.post('/',             jobValidation, createJob);
router.delete('/:id',        deleteJob);

module.exports = router;
