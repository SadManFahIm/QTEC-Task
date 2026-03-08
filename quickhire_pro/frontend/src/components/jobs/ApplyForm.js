/**
 * components/jobs/ApplyForm.js — Job Application Form
 *
 * A controlled form with four fields:
 *   - Full Name    (required)
 *   - Email        (required, validated format)
 *   - Resume URL   (required, validated URL format)
 *   - Cover Note   (optional)
 *
 * The form uses TWO layers of validation:
 *   1. Client-side (this file) — instant feedback before any network call
 *   2. Server-side (backend)  — catches anything that slips through
 *
 * On success, the form is replaced with a confirmation message.
 * On duplicate application, a specific error is shown.
 *
 * Props:
 *   jobId    {number}  The id of the job being applied to
 *   jobTitle {string}  Used in the success message
 *
 * 'use client' is required because this component manages form state
 * and calls an API on user interaction.
 */

'use client';

import { useState }            from 'react';
import { applyForJob }         from '@/lib/api';
import { CheckCircle, Loader } from 'lucide-react';

// ── Initial empty form state ──────────────────────────────────
// Defined outside the component so it can be reused if we ever
// add a "Submit another application" reset button.
const INITIAL_FORM = {
  name:        '',
  email:       '',
  resume_link: '',
  cover_note:  '',
};

export default function ApplyForm({ jobId, jobTitle }) {
  const [form,     setForm]     = useState(INITIAL_FORM);
  const [errors,   setErrors]   = useState({});       // field-level validation errors
  const [loading,  setLoading]  = useState(false);    // disables button during API call
  const [success,  setSuccess]  = useState(false);    // toggles the success state
  const [apiError, setApiError] = useState('');       // non-field error from the API

  // ── Client-side validation ──────────────────────────────────
  /**
   * validate()
   *
   * Checks each required field and returns an object whose keys are
   * field names and values are the error messages.
   * An empty object means all fields passed.
   *
   * @returns {Object} errors
   */
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      // Simple regex — good enough for client-side; the server validates too
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.resume_link.trim()) {
      newErrors.resume_link = 'Resume URL is required.';
    } else {
      try {
        new URL(form.resume_link); // throws if not a valid URL
      } catch {
        newErrors.resume_link = 'Please enter a valid URL (e.g. https://...).';
      }
    }

    return newErrors;
  };

  // ── Controlled input handler ────────────────────────────────
  /**
   * handleChange(e)
   *
   * Updates the form state for the changed field.
   * Also clears that field's error message so the user gets
   * immediate positive feedback as they correct a mistake.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear the error for this specific field as the user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ── Form submission handler ─────────────────────────────────
  /**
   * handleSubmit(e)
   *
   * 1. Prevents the default browser form POST
   * 2. Runs client-side validation — aborts if there are errors
   * 3. Calls the API
   * 4. Handles success / server-side errors
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run client-side checks first — avoid an unnecessary network call
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError(''); // clear any previous API error

    try {
      const response = await applyForJob(jobId, form);

      if (response.success) {
        setSuccess(true); // swap form for success message
      } else {
        // The server returned a 4xx with a message (e.g. duplicate, validation)
        const message =
          response.message ||
          response.errors?.[0]?.msg ||
          'Failed to submit application. Please try again.';
        setApiError(message);
      }
    } catch {
      // Network error — server is unreachable
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ───────────────────────────────────────────
  // Replaces the form entirely once the application is submitted
  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-dark text-lg mb-2">Application Submitted!</h3>
        <p className="text-gray-500 text-sm">
          Thank you for applying to <strong>{jobTitle}</strong>.
          We'll be in touch soon!
        </p>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-dark mb-1.5">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          className={`
            w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
            ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}
          `}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-dark mb-1.5">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className={`
            w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
            ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}
          `}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>
        )}
      </div>

      {/* Resume URL */}
      <div>
        <label htmlFor="resume_link" className="block text-sm font-semibold text-dark mb-1.5">
          Resume URL <span className="text-red-400">*</span>
        </label>
        <input
          id="resume_link"
          type="url"
          name="resume_link"
          value={form.resume_link}
          onChange={handleChange}
          placeholder="https://drive.google.com/your-resume"
          className={`
            w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors
            ${errors.resume_link ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'}
          `}
        />
        {errors.resume_link && (
          <p className="text-red-500 text-xs mt-1" role="alert">{errors.resume_link}</p>
        )}
      </div>

      {/* Cover Note (optional) */}
      <div>
        <label htmlFor="cover_note" className="block text-sm font-semibold text-dark mb-1.5">
          Cover Note
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="cover_note"
          name="cover_note"
          value={form.cover_note}
          onChange={handleChange}
          placeholder="Tell us why you're a great fit for this role..."
          rows={4}
          className="
            w-full border border-gray-200 rounded-xl px-4 py-2.5
            text-sm outline-none focus:border-primary
            transition-colors resize-none
          "
        />
      </div>

      {/* API / server-level error message */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3" role="alert">
          <p className="text-red-600 text-sm">{apiError}</p>
        </div>
      )}

      {/* Submit button — disabled while the request is in flight */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full bg-primary text-white py-3 rounded-xl
          font-bold text-sm hover:bg-primary-dark
          transition-colors disabled:opacity-70
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <Loader size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          'Apply Now'
        )}
      </button>

    </form>
  );
}
