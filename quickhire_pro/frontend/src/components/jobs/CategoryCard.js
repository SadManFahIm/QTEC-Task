/**
 * components/jobs/CategoryCard.js — Category Explore Card
 *
 * Displays a single job category as a clickable card.
 * Used in the "Explore by Category" grid on the landing page.
 *
 * Clicking the card navigates to /jobs?category=<name> so the
 * user immediately sees filtered results.
 *
 * Props:
 *   category  {string}   Category name (e.g. "Design")
 *   count     {number}   Number of active jobs in this category
 *   active    {boolean}  When true, renders the card with a filled
 *                        primary-colour background (highlighting the
 *                        currently selected category)
 *
 * 'use client' is needed because <Link> with programmatic navigation
 * and the hover state need to run in the browser.
 * Actually, Link alone doesn't need 'use client' — but keeping it
 * consistent with interactive siblings is fine.
 */

import Link from 'next/link';
import { getCategoryIcon } from '@/lib/api';

export default function CategoryCard({ category, count, active = false }) {
  return (
    <Link href={`/jobs?category=${encodeURIComponent(category)}`}>
      <div className={`
        p-5 rounded-2xl border-2 cursor-pointer
        transition-all duration-200 hover:shadow-md group
        ${active
          ? 'bg-primary border-primary text-white'        // active state
          : 'bg-white border-gray-100 hover:border-primary/30' // default state
        }
      `}>
        {/* Category emoji icon */}
        <div className="text-2xl mb-3" aria-hidden="true">
          {getCategoryIcon(category)}
        </div>

        {/* Category name */}
        <h3 className={`font-semibold text-sm mb-1 ${active ? 'text-white' : 'text-dark'}`}>
          {category}
        </h3>

        {/* Job count + arrow */}
        <div className={`flex items-center justify-between text-xs ${active ? 'text-white/80' : 'text-gray-500'}`}>
          <span>{count} jobs available</span>
          {/* Arrow nudges right on hover to signal it's clickable */}
          <span className={`
            transition-transform group-hover:translate-x-1
            ${active ? 'text-white' : 'text-primary'}
          `}>
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
