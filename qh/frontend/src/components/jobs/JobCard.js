/**
 * JobCard — QuickHire
 *
 * Card component used in the "Featured Jobs" grid on the landing page
 * and the main job listings page.
 *
 * Displays:
 *  - Company initials avatar (generated from company name)
 *  - Job title, company, location
 *  - Short description snippet (line-clamped to 2 lines)
 *  - Employment type badge
 *  - Category badge with colour coding
 *
 * Clicking anywhere on the card navigates to the full job detail page.
 *
 * Props:
 *  job {Object} — a single job record from the database
 */
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCategoryBadgeClass } from '@/lib/api';

export default function JobCard({ job }) {
  /**
   * Generate a 2-letter abbreviation from the company name.
   * e.g. "Dropbox" → "DR", "Class Pass" → "CL"
   */
  const initials = job.company
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 h-full
                      hover:shadow-lg hover:border-primary/20
                      transition-all duration-200 cursor-pointer group">

        {/* ── Card Header: avatar + title + type badge ─────────────── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">

            {/* Company avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20
                            flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-primary text-sm">{initials}</span>
            </div>

            <div>
              <h3 className="font-semibold text-dark text-sm line-clamp-1
                             group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-500 text-xs">{job.company}</p>
            </div>
          </div>

          {/* Employment type badge — always visible */}
          <span className="text-xs bg-green-50 text-green-700 font-medium
                           px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            {job.type}
          </span>
        </div>

        {/* ── Location ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">{job.location}</span>
        </div>

        {/* ── Description snippet ──────────────────────────────────── */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* ── Category badge ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                           ${getCategoryBadgeClass(job.category)}`}>
            {job.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
