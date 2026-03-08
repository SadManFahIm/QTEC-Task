/**
 * ApplyForm — QuickHire
 *
 * Application submission form displayed on the Job Detail page.
 * Handles two phases:
 *  1. Form entry — with client-side field validation
 *  2. Success state — shown after a successful API submission
 *
 * Client-side validation (before hitting the API):
 *  - name        : required
 *  - email       : required + valid email format
 *  - resume_link : required + valid URL format
 *  - cover_note  : optional
 *
 * After passing validation the form calls applyForJob() from the API lib.
 * The API may return additional validation errors (e.g. duplicate application)
 * which are shown in the apiError state.
 *
 * Props:
 *  jobId    {number} — the job being applied to
 *  jobTitle {string} — displayed in the success message
 */
'use client';

import { useState } from 'react';
import { applyForJob } from '@/lib/api';
import { CheckCircle, Loader } from 'lucide-react';

export default function ApplyForm({ jobId, jobTitle }) {
  // ── Form field state ──────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name        : '',
    email       : '',
    resume_link : '',
    cover_note  : '',
  });

  // ── UI state ─────────────────────────────────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState({}); // per-field validation messages
  const [apiError,    setApiError]    = useState('');  // server-returned error message
  const [loading,     setLoading]     = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  // ── Client-side validation ────────────────────────────────────────────────

  /**
   * Validates all form fields and returns an object of error messages.
   * An empty object means the form is valid.
   */
  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!form.resume_link.trim()) {
      errors.resume_link = 'Resume URL is required.';
    } else {
      try {
        new URL(form.resume_link); // throws if the URL is malformed
      } catch {
        errors.resume_link = 'Please enter a valid URL (e.g. https://drive.google.com/...).';
      }
    }

    return errors;
  };

  // ── Event Handlers ────────────────────────────────────────────────────────

  /**
   * Updates the matching form field and clears its error on each keystroke
   * so the user gets immediate visual feedback as they correct a mistake.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear this specific field's error (not all errors)
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Runs validation, then submits to the API if everything passes.
   * Handles both success and various error responses.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await applyForJob(jobId, form);

      if (response.success) {
        setSubmitted(true); // triggers success UI
      } else {
        // API returned a business-logic error (e.g. duplicate application)
        const message = response.message
          || response.errors?.[0]?.msg
          || 'Failed to submit application. Please try again.';
        setApiError(message);
      }
    } catch {
      // Network-level failure (backend down, etc.)
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-bold text-dark text-lg mb-2">Application Submitted!</h3>
        <p className="text-gray-500 text-sm">
          Thank you for applying to <strong>{jobTitle}</strong>.
          We will be in touch soon!
        </p>
      </div>
    );
  }

  // ── Form State ────────────────────────────────────────────────────────────

  /**
   * Helper: returns input className based on whether the field has an error.
   * Keeps the JSX below clean by avoiding repeated ternary expressions.
   */
  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
     ${fieldErrors[field]
       ? 'border-red-400 bg-red-50 focus:border-red-400'
       : 'border-gray-200 focus:border-primary'}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className={inputClass('name')}
        />
        {fieldErrors.name && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="e.g. john@example.com"
          className={inputClass('email')}
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
        )}
      </div>

      {/* Resume URL */}
      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          Resume URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="resume_link"
          value={form.resume_link}
          onChange={handleChange}
          placeholder="https://drive.google.com/your-resume"
          className={inputClass('resume_link')}
        />
        {fieldErrors.resume_link && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.resume_link}</p>
        )}
      </div>

      {/* Cover Note (optional) */}
      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5">
          Cover Note
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          name="cover_note"
          value={form.cover_note}
          onChange={handleChange}
          placeholder="Tell us why you are a great fit for this role..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                     outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* API / server error banner */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm
                   hover:bg-primary-dark transition-colors
                   disabled:opacity-70 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader size={16} className="animate-spin" />
            Submitting…
          </>
        ) : (
          'Apply Now'
        )}
      </button>
    </form>
  );
}
