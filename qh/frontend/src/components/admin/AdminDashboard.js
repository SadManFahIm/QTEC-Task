/**
 * AdminDashboard — QuickHire
 *
 * Full-featured admin panel rendered client-side.
 * Receives initial data from the server component (admin/page.js)
 * and manages state locally so UI updates are instant.
 *
 * Features:
 *  - Stats overview (total jobs, applications, categories)
 *  - Tab switching: Job Listings | Applications
 *  - Jobs table with View and Delete actions
 *  - Applications table with applicant details and resume links
 *  - "Add New Job" modal form with validation
 *
 * Props:
 *  initialJobs         {Array} — job records fetched server-side
 *  initialApplications {Array} — application records fetched server-side
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

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Design', 'Sales', 'Marketing', 'Finance',
  'Technology', 'Engineering', 'Business', 'Human Resource',
];

const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

/** Default/reset state for the "Add New Job" form */
const EMPTY_FORM = {
  title       : '',
  company     : '',
  location    : '',
  category    : 'Design',
  type        : 'Full Time',
  description : '',
  logo        : '',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard({ initialJobs, initialApplications }) {

  // ── Data state ─────────────────────────────────────────────────────────────
  const [jobs,         setJobs]         = useState(initialJobs);
  const [applications]                  = useState(initialApplications);

  // ── UI / interaction state ─────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState('jobs');   // 'jobs' | 'applications'
  const [showModal,    setShowModal]    = useState(false);    // create-job modal visibility
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [formErrors,   setFormErrors]   = useState({});
  const [submitting,   setSubmitting]   = useState(false);    // create-job button loading
  const [deletingId,   setDeletingId]   = useState(null);     // which job row is being deleted
  const [toast,        setToast]        = useState('');       // success/error feedback message

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Shows a feedback message for 3 seconds then clears it.
   * @param {string} message
   */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  /** Closes the modal and resets form + error state */
  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  // ─── Form Validation ────────────────────────────────────────────────────────

  /**
   * Validates the "Add New Job" form fields.
   * Returns an object of error strings; empty object = valid.
   */
  const validateForm = () => {
    const errors = {};
    if (!form.title.trim())       errors.title       = 'Job title is required.';
    if (!form.company.trim())     errors.company     = 'Company name is required.';
    if (!form.location.trim())    errors.location    = 'Location is required.';
    if (!form.description.trim()) errors.description = 'Description is required.';
    return errors;
  };

  // ─── Event Handlers ─────────────────────────────────────────────────────────

  /**
   * Handles the "Add New Job" form submission.
   * Validates locally, calls the API, then updates local job list on success.
   */
  const handleCreateJob = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await createJob(form);

      if (response.success) {
        // Prepend new job so it appears at the top of the table
        setJobs(prev => [response.data, ...prev]);
        closeModal();
        showToast('✅ Job created successfully!');
      } else {
        showToast('❌ Failed to create job. Check your input.');
      }
    } catch {
      showToast('❌ Network error. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handles the delete action for a job row.
   * Asks for confirmation before making the API call.
   * @param {number} id — job primary key
   */
  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this job? This will also remove all associated applications.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await deleteJob(id);

      if (response.success) {
        setJobs(prev => prev.filter(job => job.id !== id));
        showToast('✅ Job deleted successfully.');
      } else {
        showToast('❌ Failed to delete job.');
      }
    } catch {
      showToast('❌ Network error. Is the backend running?');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage job listings and review submitted applications
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5
                     rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add New Job
        </button>
      </div>

      {/* ── Toast Notification ───────────────────────────────────────────── */}
      {toast && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-medium
                         ${toast.startsWith('✅')
                           ? 'bg-green-50 text-green-700 border border-green-200'
                           : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {toast.startsWith('✅') ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.replace(/^[✅❌]\s/, '')}
        </div>
      )}

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

        <StatCard
          icon={<Briefcase size={24} className="text-primary" />}
          iconBg="bg-primary/10"
          value={jobs.length}
          label="Total Jobs"
        />
        <StatCard
          icon={<Users size={24} className="text-green-600" />}
          iconBg="bg-green-100"
          value={applications.length}
          label="Total Applications"
        />
        <StatCard
          icon={<LayoutGrid size={24} className="text-orange-600" />}
          iconBg="bg-orange-100"
          value={new Set(jobs.map(j => j.category)).size}
          label="Active Categories"
        />
      </div>

      {/* ── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'jobs',         label: `Job Listings (${jobs.length})` },
          { key: 'applications', label: `Applications (${applications.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors
                       ${activeTab === tab.key
                         ? 'border-primary text-primary'
                         : 'border-transparent text-gray-500 hover:text-dark'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Jobs Table ───────────────────────────────────────────────────── */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {jobs.length === 0 ? (
            <EmptyState icon={<Briefcase size={40} />} message="No jobs yet. Click 'Add New Job' to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <Th>Job Title</Th>
                    <Th>Company</Th>
                    <Th hidden="md">Location</Th>
                    <Th hidden="lg">Category</Th>
                    <Th hidden="lg">Type</Th>
                    <Th align="right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">

                      {/* Title */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">{job.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4 text-gray-600 text-sm">{job.company}</td>

                      {/* Location — hidden on small screens */}
                      <td className="px-5 py-4 text-gray-500 text-sm hidden md:table-cell">
                        {job.location}
                      </td>

                      {/* Category badge — hidden on small screens */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs bg-primary/10 text-primary font-semibold
                                         px-2.5 py-1 rounded-full">
                          {job.category}
                        </span>
                      </td>

                      {/* Type — hidden on small screens */}
                      <td className="px-5 py-4 text-gray-500 text-sm hidden lg:table-cell">
                        {job.type}
                      </td>

                      {/* Action buttons */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* View job (opens public detail page) */}
                          <Link
                            href={`/jobs/${job.id}`}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10
                                       rounded-lg transition-colors"
                            title="View job listing"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* Delete job */}
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deletingId === job.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                                       rounded-lg transition-colors disabled:opacity-50"
                            title="Delete job"
                          >
                            {deletingId === job.id
                              ? <Loader size={16} className="animate-spin" />
                              : <Trash2 size={16} />}
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

      {/* ── Applications Table ───────────────────────────────────────────── */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {applications.length === 0 ? (
            <EmptyState icon={<Users size={40} />} message="No applications received yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <Th>Applicant</Th>
                    <Th hidden="md">Applied For</Th>
                    <Th hidden="lg">Resume</Th>
                    <Th hidden="lg">Date</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">

                      {/* Applicant name + email */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">{app.name}</p>
                        <p className="text-gray-500 text-xs">{app.email}</p>
                      </td>

                      {/* Job title + company */}
                      <td className="px-5 py-4 text-gray-600 text-sm hidden md:table-cell">
                        <p className="font-medium">{app.job_title}</p>
                        <p className="text-gray-400 text-xs">{app.company}</p>
                      </td>

                      {/* Resume link */}
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

                      {/* Submission date */}
                      <td className="px-5 py-4 text-gray-500 text-xs hidden lg:table-cell">
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

      {/* ── Create Job Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">

              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">Add New Job</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-400
                             hover:text-dark transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateJob} noValidate className="space-y-4">

                {/* Title + Company row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Job Title"
                    required
                    error={formErrors.title}
                  >
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Senior Designer"
                      className={fieldInputClass(formErrors.title)}
                    />
                  </FormField>

                  <FormField label="Company" required error={formErrors.company}>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      placeholder="e.g. Google"
                      className={fieldInputClass(formErrors.company)}
                    />
                  </FormField>
                </div>

                {/* Location */}
                <FormField label="Location" required error={formErrors.location}>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. New York, US"
                    className={fieldInputClass(formErrors.location)}
                  />
                </FormField>

                {/* Category + Type row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Category">
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                                 text-sm outline-none focus:border-primary bg-white"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Job Type">
                    <select
                      value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                                 text-sm outline-none focus:border-primary bg-white"
                    >
                      {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </FormField>
                </div>

                {/* Description */}
                <FormField label="Description" required error={formErrors.description}>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    className={`${fieldInputClass(formErrors.description)} resize-none`}
                  />
                </FormField>

                {/* Modal action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-2.5
                               rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold
                               text-sm hover:bg-primary-dark transition-colors
                               disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting
                      ? <><Loader size={14} className="animate-spin" /> Creating…</>
                      : 'Create Job'}
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

// ─── Small Sub-components ─────────────────────────────────────────────────────

/** Stat overview card */
function StatCard({ icon, iconBg, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-dark">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

/** Table header cell */
function Th({ children, align = 'left', hidden }) {
  const visibility = hidden === 'md' ? 'hidden md:table-cell'
                   : hidden === 'lg' ? 'hidden lg:table-cell'
                   : '';
  return (
    <th className={`px-5 py-3 text-${align} text-xs font-semibold
                    text-gray-500 uppercase tracking-wide bg-gray-50
                    border-b border-gray-100 ${visibility}`}>
      {children}
    </th>
  );
}

/** Form field wrapper with label and error message */
function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-dark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/** Returns input className with error state applied */
function fieldInputClass(error) {
  return `w-full border rounded-xl px-4 py-2.5 text-sm outline-none
          focus:border-primary transition-colors
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;
}

/** Empty state placeholder for tables */
function EmptyState({ icon, message }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="flex justify-center mb-3 opacity-30">{icon}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
