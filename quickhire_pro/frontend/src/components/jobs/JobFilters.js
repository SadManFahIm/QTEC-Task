/**
 * components/jobs/JobFilters.js — Sidebar Filter Panel
 *
 * Renders a sticky sidebar with two filter groups:
 *   1. Category  (dynamically populated from the API)
 *   2. Job Type  (static enum values)
 *
 * How filtering works:
 *   Clicking a filter button calls updateFilter(), which reads the
 *   current URL search params, updates the relevant key, and pushes
 *   the new URL. Next.js re-renders the page with the new params,
 *   which triggers a fresh API call inside the Server Component (jobs/page.js).
 *
 *   This pattern (URL as the single source of truth) means:
 *   - Filters survive a page refresh
 *   - Users can copy/share a filtered URL
 *   - Back/forward browser navigation works correctly
 *
 * Props:
 *   categories     {Array<{ category, count }>}  from API
 *   activeCategory {string|undefined}            current ?category= value
 *   activeType     {string|undefined}            current ?type= value
 *
 * 'use client' is required because we use useRouter, usePathname,
 * and useSearchParams — all browser-only Next.js hooks.
 */

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Fixed set of job types that matches the database ENUM
const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

export default function JobFilters({ categories, activeCategory, activeType }) {
  const router       = useRouter();
  const pathname     = usePathname();     // e.g. "/jobs"
  const searchParams = useSearchParams(); // current query string as a ReadonlyURLSearchParams

  /**
   * updateFilter(key, value)
   *
   * Updates a single query param while preserving all others.
   * Passing an empty string removes the param entirely.
   *
   * @param {string} key    - e.g. 'category' or 'type'
   * @param {string} value  - new value; empty string = remove the filter
   */
  const updateFilter = (key, value) => {
    // Clone the existing params so we don't mutate the read-only object
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // "All" selected → remove the filter param
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">

      {/* ── Category Filter ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="font-bold text-dark mb-4">Category</h3>
        <ul className="space-y-1">

          {/* "All Categories" option — clears the category filter */}
          <li>
            <button
              onClick={() => updateFilter('category', '')}
              className={`
                w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                ${!activeCategory
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              All Categories
            </button>
          </li>

          {/* Dynamic category list from the API */}
          {categories.map(({ category, count }) => (
            <li key={category}>
              <button
                onClick={() => updateFilter('category', category)}
                className={`
                  w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                  flex justify-between items-center
                  ${activeCategory === category
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <span>{category}</span>
                {/* Show the count so users know how many results to expect */}
                <span className={`text-xs ${activeCategory === category ? 'text-white/70' : 'text-gray-400'}`}>
                  {count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Job Type Filter ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="font-bold text-dark mb-4">Job Type</h3>
        <ul className="space-y-1">

          {/* "All Types" option */}
          <li>
            <button
              onClick={() => updateFilter('type', '')}
              className={`
                w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                ${!activeType
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              All Types
            </button>
          </li>

          {JOB_TYPES.map(type => (
            <li key={type}>
              <button
                onClick={() => updateFilter('type', type)}
                className={`
                  w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                  ${activeType === type
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
