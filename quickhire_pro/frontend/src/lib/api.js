/**
 * lib/api.js — Frontend API Utility Layer
 *
 * This file is the single place where the frontend talks to the backend.
 * All fetch() calls live here so that:
 *   - If the base URL or a route changes, we only update it in one place
 *   - Components stay clean — they call a named function, not raw fetch()
 *   - Error handling is consistent across every request
 *
 * NEXT.js SERVER COMPONENTS vs CLIENT COMPONENTS:
 *   Functions like getJobs() and getJob() are called from Server Components
 *   (async page.js files). They run on the server at request time, so we
 *   pass { cache: 'no-store' } to always fetch fresh data.
 *
 *   Functions like applyForJob() and createJob() are called from Client
 *   Components ('use client') in response to user actions — they use the
 *   browser's fetch() directly.
 */

// ── Base URL ──────────────────────────────────────────────────
// Read from the environment variable set in .env.local (dev)
// or the Vercel dashboard (production).
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


// ─────────────────────────────────────────────────────────────
//  JOB FETCHING
// ─────────────────────────────────────────────────────────────

/**
 * getJobs(filters)
 *
 * Fetches the full job list, optionally filtered.
 *
 * @param {Object} filters
 * @param {string} [filters.search]   - keyword search (title / company / description)
 * @param {string} [filters.category] - exact category match
 * @param {string} [filters.location] - partial location match
 * @param {string} [filters.type]     - exact type match (e.g. "Full Time")
 * @returns {Promise<{ success, total, data: Job[] }>}
 */
export async function getJobs(filters = {}) {
  // Build a query string from whichever filters were provided
  const params = new URLSearchParams();
  if (filters.search)   params.append('search',   filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.location) params.append('location', filters.location);
  if (filters.type)     params.append('type',     filters.type);

  const res = await fetch(`${API_URL}/jobs?${params.toString()}`, {
    cache: 'no-store', // always fetch fresh — jobs change frequently
  });

  if (!res.ok) throw new Error(`getJobs failed: ${res.status}`);
  return res.json();
}


/**
 * getJob(id)
 *
 * Fetches the full details of a single job by its database id.
 *
 * @param {number|string} id
 * @returns {Promise<{ success, data: Job }>}
 */
export async function getJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`getJob(${id}) failed: ${res.status}`);
  return res.json();
}


/**
 * getCategories()
 *
 * Returns each job category alongside its current listing count.
 * Used on the landing page and the filter sidebar.
 *
 * @returns {Promise<{ success, data: Array<{ category: string, count: number }> }>}
 */
export async function getCategories() {
  const res = await fetch(`${API_URL}/jobs/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`getCategories failed: ${res.status}`);
  return res.json();
}


// ─────────────────────────────────────────────────────────────
//  ADMIN — JOB MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * createJob(data)
 *
 * POSTs a new job to the backend (admin action).
 * Does NOT throw on a 4xx error — returns the JSON body instead
 * so the component can display the validation errors to the user.
 *
 * @param {{ title, company, location, category, type, description, logo? }} data
 * @returns {Promise<{ success, message, data?: Job, errors?: [] }>}
 */
export async function createJob(data) {
  const res = await fetch(`${API_URL}/jobs`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });

  return res.json(); // return body regardless of status so caller can handle errors
}


/**
 * deleteJob(id)
 *
 * Sends a DELETE request for a specific job (admin action).
 *
 * @param {number|string} id
 * @returns {Promise<{ success, message }>}
 */
export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
  });

  return res.json();
}


// ─────────────────────────────────────────────────────────────
//  APPLICATIONS
// ─────────────────────────────────────────────────────────────

/**
 * applyForJob(jobId, data)
 *
 * Submits a job application on behalf of a candidate.
 * Returns the full response body so the component can show
 * success or validation errors.
 *
 * @param {number|string} jobId
 * @param {{ name, email, resume_link, cover_note? }} data
 * @returns {Promise<{ success, message, data?: Application, errors?: [] }>}
 */
export async function applyForJob(jobId, data) {
  const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });

  return res.json();
}


/**
 * getApplications()
 *
 * Fetches all submitted applications (admin view).
 * Each row includes job_title and company from a JOIN.
 *
 * @returns {Promise<{ success, total, data: Application[] }>}
 */
export async function getApplications() {
  const res = await fetch(`${API_URL}/applications`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`getApplications failed: ${res.status}`);
  return res.json();
}


// ─────────────────────────────────────────────────────────────
//  UI HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * getCategoryBadgeClass(category)
 *
 * Maps a category string to a Tailwind CSS colour pair (bg + text).
 * Used on JobCard and JobListItem to colour-code category badges.
 *
 * @param {string} category
 * @returns {string} Tailwind class string
 */
export function getCategoryBadgeClass(category) {
  const colourMap = {
    'Marketing':     'bg-green-100 text-green-700',
    'Design':        'bg-purple-100 text-purple-700',
    'Technology':    'bg-blue-100 text-blue-700',
    'Business':      'bg-orange-100 text-orange-700',
    'Engineering':   'bg-yellow-100 text-yellow-700',
    'Human Resource':'bg-pink-100 text-pink-700',
    'Finance':       'bg-teal-100 text-teal-700',
    'Sales':         'bg-red-100 text-red-700',
  };

  return colourMap[category] || 'bg-gray-100 text-gray-700';
}


/**
 * getCategoryIcon(category)
 *
 * Returns an emoji icon for each job category.
 * Used in the CategoryCard component on the landing page.
 *
 * @param {string} category
 * @returns {string} emoji
 */
export function getCategoryIcon(category) {
  const iconMap = {
    'Design':        '✏️',
    'Sales':         '📊',
    'Marketing':     '📣',
    'Finance':       '💰',
    'Technology':    '💻',
    'Engineering':   '⚙️',
    'Business':      '💼',
    'Human Resource':'👥',
  };

  return iconMap[category] || '🏢';
}
