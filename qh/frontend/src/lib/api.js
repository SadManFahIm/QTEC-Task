/**
 * ============================================================
 * QuickHire — API Utility Library
 * ============================================================
 * Centralises every HTTP call to the backend so that:
 *  - The API base URL is defined in one place
 *  - Components never contain raw fetch() logic
 *  - Swapping the backend URL only requires updating .env.local
 * ============================================================
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Job Fetching ─────────────────────────────────────────────────────────────

/**
 * Fetch all jobs, with optional server-side filters.
 * @param {Object} filters - { search, category, location, type }
 */
export async function getJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search)   params.append('search',   filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.location) params.append('location', filters.location);
  if (filters.type)     params.append('type',     filters.type);

  const res = await fetch(`${API_URL}/jobs?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch jobs (${res.status})`);
  return res.json();
}

/**
 * Fetch a single job by its database ID.
 * @param {number|string} id
 */
export async function getJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch job ${id} (${res.status})`);
  return res.json();
}

/**
 * Fetch job categories with the count of active listings in each.
 * Used by the landing page and the filter sidebar.
 */
export async function getCategories() {
  const res = await fetch(`${API_URL}/jobs/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch categories (${res.status})`);
  return res.json();
}

// ─── Admin — Job Management ───────────────────────────────────────────────────

/**
 * Create a new job listing (admin only).
 * @param {Object} data - { title, company, location, category, type, description, logo? }
 */
export async function createJob(data) {
  const res = await fetch(`${API_URL}/jobs`, {
    method  : 'POST',
    headers : { 'Content-Type': 'application/json' },
    body    : JSON.stringify(data),
  });
  return res.json();
}

/**
 * Permanently delete a job listing (admin only).
 * Associated applications are cascade-deleted by the database.
 * @param {number|string} id
 */
export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' });
  return res.json();
}

// ─── Applications ─────────────────────────────────────────────────────────────

/**
 * Submit a job application.
 * @param {number|string} jobId
 * @param {Object} data - { name, email, resume_link, cover_note? }
 */
export async function applyForJob(jobId, data) {
  const res = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
    method  : 'POST',
    headers : { 'Content-Type': 'application/json' },
    body    : JSON.stringify(data),
  });
  return res.json();
}

/**
 * Fetch all applications across every job (admin dashboard).
 */
export async function getApplications() {
  const res = await fetch(`${API_URL}/applications`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch applications (${res.status})`);
  return res.json();
}

// ─── UI Helper Utilities ──────────────────────────────────────────────────────

/**
 * Returns Tailwind CSS classes for a category badge pill.
 * Each category has a distinct colour for quick visual scanning.
 * @param {string} category
 */
export function getCategoryBadgeClass(category) {
  const colorMap = {
    'Marketing'     : 'bg-green-100 text-green-700',
    'Design'        : 'bg-purple-100 text-purple-700',
    'Technology'    : 'bg-blue-100 text-blue-700',
    'Business'      : 'bg-orange-100 text-orange-700',
    'Engineering'   : 'bg-yellow-100 text-yellow-700',
    'Human Resource': 'bg-pink-100 text-pink-700',
    'Finance'       : 'bg-teal-100 text-teal-700',
    'Sales'         : 'bg-red-100 text-red-700',
  };
  return colorMap[category] || 'bg-gray-100 text-gray-700';
}

/**
 * Returns an emoji icon representing a job category.
 * Displayed on the category cards of the landing page.
 * @param {string} category
 */
export function getCategoryIcon(category) {
  const iconMap = {
    'Design'        : '✏️',
    'Sales'         : '📊',
    'Marketing'     : '📣',
    'Finance'       : '💰',
    'Technology'    : '💻',
    'Engineering'   : '⚙️',
    'Business'      : '💼',
    'Human Resource': '👥',
  };
  return iconMap[category] || '🏢';
}
