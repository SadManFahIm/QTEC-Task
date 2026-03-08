/**
 * components/admin/AdminDashboard.js — Admin Control Panel
 *
 * The full admin interface rendered inside /admin/page.js.
 * Separated into its own Client Component because it uses
 * React state heavily — the parent page.js is a Server Component
 * and can't use useState or handle events directly.
 *
 * FEATURES:
 *   - Stats row: total jobs / total applications / active categories
 *   - Tabs: "Job Listings" and "Applications"
 *   - Jobs table: view + delete each listing
 *   - Applications table: see all submitted applications with resume links
 *   - "Add New Job" modal: form to create a new listing
 *
 * WHY CLIENT COMPONENT?
 *   - useState for jobs list, modal open/close, form values, loading state
 *   - Optimistic UI updates (add/remove rows without re-fetching the page)
 *   - User interactions: button clicks, form submissions
 *
 * Props:
 *   initialJobs         {Array}  Jobs fetched on the server (page.js)
 *   initialApplications {Array}  Applications fetched on the server
 *
 * Passing data in as props avoids a redundant client-side fetch on mount.
 */

'use client';

import { useState }  from 'react';
import Link          from 'next/link';
import { createJob, deleteJob } from '@/lib/api';
import {
  Briefcase, Users, LayoutGrid,
  Plus, Trash2, Eye,
  CheckCircle, XCircle, Loader,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────
// Kept at module level so they don't get re-created on every render

const CATEGORIES = [
  'Design', 'Sales', 'Marketing', 'Finance',
  'Technology', 'Engineering', 'Business', 'Human Resource',
];

const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

// Blank form state — reused when the modal is opened or reset
const EMPTY_FORM = {
  title:       '',
  company:     '',
  location:    '',
  category:    'Design',
  type:        'Full Time',
  description: '',
  logo:        '',
};

// ─────────────────────────────────────────────────────────────

export default function AdminDashboard({ initialJobs, initialApplications }) {
  // ── Component state ────────────────────────────────────────
  const [jobs,         setJobs]         = useState(initialJobs);
  const [applications]                  = useState(initialApplications); // read-only in admin
  const [activeTab,    setActiveTab]    = useState('jobs');      // 'jobs' | 'applications'
  const [showModal,    setShowModal]    = useState(false);       // create-job modal visibility
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formErrors,   setFormErrors]   = useState({});          // per-field validation errors
  const [isCreating,   setIsCreating]   = useState(false);       // spinner on Create button
  const [deletingId,   setDeletingId]   = useState(null);        // id of the row being deleted
  const [toastMsg,     setToastMsg]     = useState('');          // success / error toast text

  // ── Count unique categories in the current job list ────────
  const activeCategoryCount = new Set(jobs.map(j => j.category)).size;

  // ── Toast helper ───────────────────────────────────────────
  /**
   * showToast(message)
   * Displays a transient message for 3 seconds then clears it.
   */
  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ── Close + reset the modal ────────────────────────────────
  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  // ── Client-side form validation ────────────────────────────
  /**
   * validateForm()
   * Returns an object of { fieldName: errorMessage } pairs.
   * Empty object = all fields valid.
   */
  const validateForm = () => {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Job title is required.';
    if (!form.company.trim())     errs.company     = 'Company name is required.';
    if (!form.location.trim())    errs.location    = 'Location is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    return errs;
  };

  // ── Create job ─────────────────────────────────────────────
  /**
   * handleCreate(e)
   * Validates, calls the API, then optimistically prepends the new
   * job to the local jobs array (no page reload needed).
   */
  const handleCreate = async (e) => {
    e.preventDefault();

    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsCreating(true);
    try {
      const res = await createJob(form);
      if (res.success) {
        // Prepend to the list so it appears at the top immediately
        setJobs(prev => [res.data, ...prev]);
        closeModal();
        showToast('✅ Job listing created successfully.');
      } else {
        showToast(`❌ ${res.message || 'Failed to create job.'}`);
      }
    } catch {
      showToast('❌ Network error. Is the backend running?');
    } finally {
      setIsCreating(false);
    }
  };

  // ── Delete job ─────────────────────────────────────────────
  /**
   * handleDelete(id)
   * Shows a native confirm dialog, then calls the API and removes
   * the row from local state on success (optimistic update).
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;

    setDeletingId(id); // triggers the loading spinner on that row
    try {
      const res = await deleteJob(id);
      if (res.success) {
        setJobs(prev => prev.filter(j => j.id !== id));
        showToast('✅ Job listing deleted successfully.');
      } else {
        showToast(`❌ ${res.message || 'Failed to delete job.'}`);
      }
    } catch {
      showToast('❌ Network error. Is the backend running?');
    } finally {
      setDeletingId(null);
    }
  };

  // ─────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage job listings and view submitted applications
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add New Job
        </button>
      </div>

      {/* ── Toast Notification ───────────────────────────── */}
      {toastMsg && (
        <div className={`
          mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium
          ${toastMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
        `}>
          {toastMsg.startsWith('✅')
            ? <CheckCircle size={18} />
            : <XCircle    size={18} />
          }
          {toastMsg.replace(/^[✅❌]\s/, '')}
        </div>
      )}

      {/* ── Stats Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {/* Total Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Briefcase size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-dark">{jobs.length}</p>
            <p className="text-gray-500 text-sm">Total Jobs</p>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-dark">{applications.length}</p>
            <p className="text-gray-500 text-sm">Applications</p>
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <LayoutGrid size={22} className="text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-dark">{activeCategoryCount}</p>
            <p className="text-gray-500 text-sm">Categories</p>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ──────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'jobs',         label: `Job Listings (${jobs.length})` },
          { key: 'applications', label: `Applications (${applications.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors
              ${activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-dark'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Jobs Table ───────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {jobs.length === 0 ? (
            // Empty state
            <div className="text-center py-16 text-gray-400">
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No job listings yet.</p>
              <p className="text-sm mt-1">Click "Add New Job" to create your first listing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Title</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">{job.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">ID: {job.id}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">{job.company}</td>
                      <td className="px-5 py-4 text-gray-500 text-sm hidden md:table-cell">{job.location}</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                          {job.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm hidden lg:table-cell">{job.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View public listing */}
                          <Link
                            href={`/jobs/${job.id}`}
                            title="View listing"
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* Delete listing */}
                          <button
                            onClick={() => handleDelete(job.id)}
                            disabled={deletingId === job.id}
                            title="Delete listing"
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === job.id
                              ? <Loader size={16} className="animate-spin" />
                              : <Trash2  size={16} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Applications Table ───────────────────────────── */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Applied For</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Resume</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">{app.name}</p>
                        <p className="text-gray-500 text-xs">{app.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm hidden md:table-cell">
                        {app.job_title}
                        <span className="text-gray-400"> @ {app.company}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm hover:underline"
                        >
                          View Resume →
                        </a>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell">
                        {new Date(app.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Create Job Modal ─────────────────────────────── */}
      {showModal && (
        /*
          Fixed overlay — covers the entire viewport.
          Clicking the dark backdrop closes the modal.
        */
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">

              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-dark">Add New Job</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Fill in the details to post a new listing</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-dark"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Create job form */}
              <form onSubmit={handleCreate} className="space-y-4">

                {/* Title + Company row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Senior Designer"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors ${formErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Company <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      placeholder="e.g. Google"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors ${formErrors.company ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {formErrors.company && <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. New York, US"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors ${formErrors.location ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>

                {/* Category + Type row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white transition-colors"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Job Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white transition-colors"
                    >
                      {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none ${formErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isCreating
                      ? <><Loader size={14} className="animate-spin" /> Creating...</>
                      : 'Create Job'
                    }
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
