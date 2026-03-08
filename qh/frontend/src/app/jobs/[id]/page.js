/**
 * Job Detail Page — QuickHire  (/jobs/:id)
 *
 * Server Component: fetches the full job record by ID from the API.
 * Renders two main columns:
 *  - Left  (2/3 width): job header card + description + requirements
 *  - Right (1/3 width): sticky Apply Now form (ApplyForm client component)
 *
 * If the job is not found (404) or the API is unreachable, a friendly
 * error state is shown instead of crashing.
 *
 * @param {Object} params - Next.js dynamic route params ({ id: string })
 */
import Link       from 'next/link';
import Navbar     from '@/components/layout/Navbar';
import Footer     from '@/components/layout/Footer';
import ApplyForm  from '@/components/jobs/ApplyForm';
import { getJob, getCategoryBadgeClass } from '@/lib/api';
import { MapPin, Briefcase, Calendar, ArrowLeft } from 'lucide-react';

export default async function JobDetailPage({ params }) {
  let job = null;

  try {
    const response = await getJob(params.id);
    job = response.data || null;
  } catch {
    // job stays null — error state rendered below
  }

  // ── Not Found / Error State ────────────────────────────────────────────────
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-dark mb-2">Job not found</h2>
          <p className="text-gray-500 mb-6">
            This job may have been removed, or the backend is not running.
          </p>
          <Link
            href="/jobs"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold
                       hover:bg-primary-dark transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate company initials for the avatar (e.g. "Dropbox" → "DR")
  const companyInitials = job.company
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Format the posted date in a human-readable way
  const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year  : 'numeric',
    month : 'long',
    day   : 'numeric',
  });

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Breadcrumb / Back link ──────────────────────────────────────── */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary
                     text-sm mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Jobs
        </Link>

        {/* ── Two-column layout ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column: job details (2 out of 3 grid columns) ──────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">

                {/* Company avatar */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20
                                flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary text-lg">{companyInitials}</span>
                </div>

                <div className="flex-1 min-w-0">

                  {/* Title + type badge */}
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <div>
                      <h1 className="text-2xl font-extrabold text-dark">{job.title}</h1>
                      <p className="text-gray-500 font-medium">{job.company}</p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-sm font-semibold
                                     px-3 py-1.5 rounded-full flex-shrink-0">
                      {job.type}
                    </span>
                  </div>

                  {/* Meta row: location, category, date */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Briefcase size={14} />
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Calendar size={14} />
                      {postedDate}
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="mt-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full
                                     ${getCategoryBadgeClass(job.category)}`}>
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description + Requirements Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

              <h2 className="text-lg font-bold text-dark mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {job.description}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-dark mb-4">What We Are Looking For</h3>
                <ul className="space-y-2">
                  {[
                    `Proven experience in ${job.category.toLowerCase()} or a related field`,
                    'Excellent written and verbal communication skills',
                    'Ability to thrive in a fast-paced, startup environment',
                    'Strong problem-solving mindset and attention to detail',
                    'Collaborative team player who can also work independently',
                  ].map(requirement => (
                    <li key={requirement} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right column: Apply Now form (1 out of 3 grid columns) ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-dark mb-1">Apply Now</h2>
              <p className="text-gray-500 text-sm mb-5">
                Fill in the details below to apply for this position.
              </p>
              {/* ApplyForm is a Client Component — handles validation and submission */}
              <ApplyForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
