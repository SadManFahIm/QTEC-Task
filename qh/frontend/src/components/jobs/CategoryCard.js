/**
 * CategoryCard — QuickHire
 *
 * Clickable card for the "Explore by Category" grid on the landing page.
 * Navigates to the Jobs page pre-filtered by the selected category.
 *
 * Props:
 *  category {string}  — category name (e.g. "Design")
 *  count    {number}  — number of active jobs in this category
 *  active   {boolean} — if true, renders with the primary (indigo) background
 */
'use client';

import Link from 'next/link';
import { getCategoryIcon } from '@/lib/api';

export default function CategoryCard({ category, count, active = false }) {
  return (
    <Link href={`/jobs?category=${encodeURIComponent(category)}`}>
      <div className={`p-5 rounded-2xl border-2 cursor-pointer
                       transition-all duration-200 hover:shadow-md group
                       ${active
                         ? 'bg-primary border-primary text-white'
                         : 'bg-white border-gray-100 hover:border-primary/30'}`}>

        {/* Category icon */}
        <div className="text-2xl mb-3">{getCategoryIcon(category)}</div>

        {/* Category name */}
        <h3 className={`font-semibold text-sm mb-1
                        ${active ? 'text-white' : 'text-dark'}`}>
          {category}
        </h3>

        {/* Job count + arrow */}
        <div className={`flex items-center justify-between text-xs
                         ${active ? 'text-white/80' : 'text-gray-500'}`}>
          <span>{count} jobs available</span>
          <span className={active ? 'text-white' : 'text-primary'}>→</span>
        </div>
      </div>
    </Link>
  );
}
