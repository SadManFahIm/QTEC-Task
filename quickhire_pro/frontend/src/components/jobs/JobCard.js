/**
 * components/jobs/JobCard.js — Featured Job Card
 *
 * Displays a single job as a clickable card.
 * Used in the "Featured Jobs" grid on the landing page
 * and in the main /jobs listing grid.
 *
 * Props:
 *   job  {Object}  A job row returned from the API.
 *                  Expected fields: id, title, company, location,
 *                  type, description, category.
 *
 * Design decisions:
 *   - Company initials avatar instead of a logo image — avoids
 *     broken-image states and looks consistent for all companies.
 *   - line-clamp-2 on description keeps card height uniform in the grid.
 *   - The entire card is wrapped in a <Link> so the click target is
 *     the full card area, not just the title text.
 *
 * This is a Server Component — no useState/useEffect needed.
 */

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCategoryBadgeClass } from '@/lib/api';

export default function JobCard({ job }) {
  // Generate a 2-letter avatar from the company name
  // e.g. "San Francisco Startup" → "SF"
  const companyInitials = job.company
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    /*
      Wrapping the entire card in <Link> means the whole card is
      keyboard-navigable and accessible as a single interactive element.
    */
    <Link href={`/jobs/${job.id}`}>
      <div className="
        bg-white border border-gray-100 rounded-2xl p-5 h-full
        hover:shadow-lg hover:border-primary/20
        transition-all duration-200 cursor-pointer group
      ">

        {/* ── Card Header: Logo + Title + Job Type Badge ─── */}
        <div className="flex items-start justify-between mb-3">

          {/* Company avatar + job title stacked */}
          <div className="flex items-center gap-3">
            {/* Gradient avatar with company initials */}
            <div className="
              w-12 h-12 rounded-xl flex-shrink-0
              bg-gradient-to-br from-primary/10 to-primary/20
              flex items-center justify-center
            ">
              <span className="font-bold text-primary text-sm">
                {companyInitials}
              </span>
            </div>

            <div>
              {/* Job title — turns primary colour on card hover */}
              <h3 className="
                font-semibold text-dark text-sm line-clamp-1
                group-hover:text-primary transition-colors
              ">
                {job.title}
              </h3>
              <p className="text-gray-500 text-xs">{job.company}</p>
            </div>
          </div>

          {/* Job type badge — e.g. "Full Time" */}
          <span className="
            text-xs bg-green-50 text-green-700 font-medium
            px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0
          ">
            {job.type}
          </span>
        </div>

        {/* ── Location row ──────────────────────────────── */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{job.location}</span>
        </div>

        {/* ── Description preview ───────────────────────── */}
        {/* line-clamp-2 truncates text after 2 lines, keeping all cards the same height */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* ── Category badge ────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className={`
            text-xs font-medium px-2.5 py-1 rounded-full
            ${getCategoryBadgeClass(job.category)}
          `}>
            {job.category}
          </span>
        </div>

      </div>
    </Link>
  );
}
