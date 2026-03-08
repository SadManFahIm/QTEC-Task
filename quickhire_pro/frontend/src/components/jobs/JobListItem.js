/**
 * components/jobs/JobListItem.js — Compact Job Row
 *
 * A horizontal list-style job entry used in the "Latest Jobs Open"
 * section on the landing page. More compact than JobCard —
 * shows logo + title + company + location + badge in one row.
 *
 * Props:
 *   job  {Object}  A job row from the API.
 */

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCategoryBadgeClass } from '@/lib/api';

export default function JobListItem({ job }) {
  // Generate two-letter initials avatar (same logic as JobCard)
  const companyInitials = job.company
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="
        flex items-center justify-between p-4
        bg-white border border-gray-100 rounded-xl
        hover:shadow-md hover:border-primary/20
        transition-all duration-200 group
      ">

        {/* Left side: avatar + job info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="
            w-10 h-10 rounded-xl flex-shrink-0
            bg-gradient-to-br from-primary/10 to-primary/20
            flex items-center justify-center
          ">
            <span className="font-bold text-primary text-xs">{companyInitials}</span>
          </div>

          <div className="min-w-0">
            {/* min-w-0 allows the text to truncate inside a flex container */}
            <h4 className="
              font-semibold text-dark text-sm truncate
              group-hover:text-primary transition-colors
            ">
              {job.title}
            </h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500">{job.company}</span>
              <span className="text-gray-300 mx-1">·</span>
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Right side: type badge + category badge */}
        <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0 ml-3">
          <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">
            {job.type}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryBadgeClass(job.category)}`}>
            {job.category}
          </span>
        </div>

      </div>
    </Link>
  );
}
