/**
 * JobFilters — QuickHire
 *
 * Sidebar filter panel on the /jobs listings page.
 * Lets users narrow results by:
 *  - Category (dynamic list from the database)
 *  - Job Type  (hardcoded enum list matching the database ENUM)
 *
 * Each click updates the URL query parameters and triggers a
 * server re-render via Next.js App Router — no manual API calls needed.
 *
 * Props:
 *  categories     {Array}  — [{ category: string, count: number }]
 *  activeCategory {string} — currently selected category (from URL)
 *  activeType     {string} — currently selected job type (from URL)
 */
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const JOB_TYPES = ['Full Time', 'Part Time', 'Remote', 'Contract'];

export default function JobFilters({ categories, activeCategory, activeType }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  /**
   * Updates a single filter key in the URL without losing other parameters.
   * Passing an empty/falsy value removes that key from the URL.
   *
   * @param {string} key   - query param name ('category' | 'type')
   * @param {string} value - new value, or '' to clear the filter
   */
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">

      {/* ── Category Filter ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="font-bold text-dark mb-4 text-sm uppercase tracking-wide">
          Category
        </h3>
        <ul className="space-y-1">

          {/* "All" option resets the category filter */}
          <li>
            <button
              onClick={() => updateFilter('category', '')}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                         ${!activeCategory
                           ? 'bg-primary text-white font-semibold'
                           : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Categories
            </button>
          </li>

          {categories.map(cat => (
            <li key={cat.category}>
              <button
                onClick={() => updateFilter('category', cat.category)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                           flex justify-between items-center
                           ${activeCategory === cat.category
                             ? 'bg-primary text-white font-semibold'
                             : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span>{cat.category}</span>
                {/* Job count shown subtly next to the label */}
                <span className={`text-xs
                                  ${activeCategory === cat.category
                                    ? 'text-white/70'
                                    : 'text-gray-400'}`}>
                  {cat.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Job Type Filter ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h3 className="font-bold text-dark mb-4 text-sm uppercase tracking-wide">
          Job Type
        </h3>
        <ul className="space-y-1">

          <li>
            <button
              onClick={() => updateFilter('type', '')}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                         ${!activeType
                           ? 'bg-primary text-white font-semibold'
                           : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Types
            </button>
          </li>

          {JOB_TYPES.map(type => (
            <li key={type}>
              <button
                onClick={() => updateFilter('type', type)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                           ${activeType === type
                             ? 'bg-primary text-white font-semibold'
                             : 'text-gray-600 hover:bg-gray-50'}`}
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
