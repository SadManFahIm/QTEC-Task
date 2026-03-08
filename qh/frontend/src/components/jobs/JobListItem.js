/**
 * JobListItem — QuickHire
 *
 * Compact horizontal list item used in the "Latest Jobs Open" section
 * on the landing page. More space-efficient than the full JobCard.
 *
 * Displays: company avatar, job title, company + location, and tag badges.
 *
 * Props:
 *  job {Object} — a single job record from the database
 */
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCategoryBadgeClass } from '@/lib/api';

export default function JobListItem({ job }) {
  const initials = job.company
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="flex items-center justify-between p-4 bg-white border border-gray-100
                      rounded-xl hover:shadow-md hover:border-primary/20
                      transition-all duration-200 group">

        {/* ── Left: avatar + title + company/location ───────────────── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20
                          flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-primary text-xs">{initials}</span>
          </div>

          <div className="min-w-0">
            <h4 className="font-semibold text-dark text-sm truncate
                           group-hover:text-primary transition-colors">
              {job.title}
            </h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500">{job.company}</span>
              <span className="text-gray-300 mx-1">·</span>
              <MapPin size={11} className="text-gray-400" />
              <span className="text-xs text-gray-500">{job.location}</span>
            </div>
          </div>
        </div>

        {/* ── Right: type + category badges ────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0 ml-3">
          <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full">
            {job.type}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                           ${getCategoryBadgeClass(job.category)}`}>
            {job.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
