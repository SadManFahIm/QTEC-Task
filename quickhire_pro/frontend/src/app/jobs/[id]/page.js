/**
 * app/jobs/[id]/page.js — Job Detail Page
 *
 * Displays the full details of a single job listing and the
 * "Apply Now" form, accessed at /jobs/:id.
 *
 * LAYOUT:
 *   Two-column on desktop (lg+):
 *     Left  (2/3 width) — Job header card + description + requirements
 *     Right (1/3 width) — Sticky apply form
 *   Single column on mobile (form appears below the details).
 *
 * DATA FETCHING:
 *   getJob(params.id) runs on the server. If the job doesn't exist
 *   (404 from API) or the backend is offline, we render a graceful
 *   "not found" page instead of crashing.
 *
 * Props (from Next.js App Router):
 *   params  { id: string }  The dynamic route segment value from the URL
 */

import Link        from 'next/link';
import Navbar      from '@/components/layout/Navbar';
import Footer      from '@/components/layout/Footer';
import ApplyForm   from '@/components/jobs/ApplyForm';
import { getJob, getCategoryBadgeClass } from '@/lib/api';
import { MapPin, Briefcase, Calendar, ArrowLeft } from 'lucide-react';

export default async function JobDetailPage({ params }) {
  let job = null;

  try {
    const response = await getJob(params.id);
    job = response.data;
  } catch {
    // Job not found or backend offline
  }

  // ── 404 / Error state ─────────────────────────────────────
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-dark mb-2">Job not found</h2>
          <p className="text-gray-500 mb-8">
            This listing may have been removed, or the backend is not running.
          </p>
          <Link
            href="/jobs"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate company initials for the avatar
  const companyInitials = job.company
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Format the posting date in a readable way
  const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Breadcrumb back link ──────────────────────── */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary text-sm mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to all jobs
        </Link>

        {/* ── Two-column layout ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Job details (takes 2/3 of the width) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job header card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">

                {/* Company avatar */}
                <div className="
                  w-16 h-16 rounded-2xl flex-shrink-0
                  bg-gradient-to-br from-primary/10 to-primary/20
                  flex items-center justify-center
                ">
                  <span className="font-bold text-primary text-lg">{companyInitials}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title + type badge row */}
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="text-2xl font-extrabold text-dark">{job.title}</h1>
                      <p className="text-gray-500 font-medium mt-0.5">{job.company}</p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0">
                      {job.type}
                    </span>
                  </div>

                  {/* Meta row: location, category, date */}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <MapPin size={14} className="flex-shrink-0" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Briefcase size={14} className="flex-shrink-0" />
                      {job.category}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Calendar size={14} className="flex-shrink-0" />
                      Posted {postedDate}
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="mt-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadgeClass(job.category)}`}>
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job description + requirements card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-dark mb-4">Job Description</h2>

              {/* whitespace-pre-line preserves line breaks from the DB text */}
              <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {job.description}
              </div>

              {/* Generic requirements section — in a real app these would
                  be stored per-job in the database */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-dark mb-3">What We're Looking For</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {[
                    `Proven experience in ${job.category.toLowerCase()}`,
                    'Strong communication and collaboration skills',
                    'Ability to thrive in a fast-paced startup environment',
                    'Passion for innovation and continuous improvement',
                    'Self-motivated with excellent problem-solving skills',
                  ].map(req => (
                    <li key={req} className="flex items-start gap-2">
                      {/* Bullet dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Apply form (1/3 of the width, sticky) ── */}
          <div className="lg:col-span-1">
            {/*
              sticky top-24 keeps the form visible while the user
              scrolls through a long job description on desktop.
            */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-dark mb-1">Apply Now</h2>
              <p className="text-gray-500 text-sm mb-5">
                Fill in the form below to apply for this position.
              </p>
              {/*
                ApplyForm is a Client Component — it manages form state
                and makes the API call from the browser.
              */}
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
