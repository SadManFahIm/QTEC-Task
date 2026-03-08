/**
 * components/ui/SearchBar.js — Job Search Input
 *
 * A two-field search bar (keyword + location) with a submit button.
 * On submit it navigates to /jobs with the search terms as query params,
 * which triggers the server to fetch filtered results.
 *
 * Props:
 *   defaultSearch   {string}  Pre-fill the keyword field (used on /jobs page
 *                             to reflect the current active search)
 *   defaultLocation {string}  Pre-fill the location field
 *
 * 'use client' is required because:
 *   - useState tracks the input values
 *   - useRouter provides programmatic navigation on form submit
 *
 * WHY NOT A REAL <form> POST?
 * We navigate client-side with router.push() so the page transition is
 * instant (no full reload). Next.js App Router re-renders only the parts
 * of the UI that depend on the new search params.
 */

'use client';

import { useState }    from 'react';
import { useRouter }   from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

export default function SearchBar({ defaultSearch = '', defaultLocation = '' }) {
  // Controlled inputs — React owns the input values
  const [keyword,  setKeyword]  = useState(defaultSearch);
  const [location, setLocation] = useState(defaultLocation);

  const router = useRouter();

  /**
   * handleSearch — runs when the user clicks "Search my job"
   * or presses Enter inside an input field.
   *
   * Builds a URLSearchParams object from the current field values
   * (skipping empty strings) and pushes /jobs?... into the history.
   */
  const handleSearch = (e) => {
    e.preventDefault(); // prevent the default browser form submission

    const params = new URLSearchParams();
    if (keyword.trim())  params.set('search',   keyword.trim());
    if (location.trim()) params.set('location',  location.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="
        flex flex-col sm:flex-row gap-2
        bg-white border-2 border-gray-100 rounded-xl p-2
        shadow-sm max-w-xl
      "
    >
      {/* ── Keyword field ──────────────────────────────── */}
      <div className="flex items-center gap-2 flex-1 px-2">
        <Search size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
        <input
          type="text"
          placeholder="Job title or keyword"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="flex-1 text-sm outline-none text-dark placeholder-gray-400 bg-transparent"
          aria-label="Search by job title or keyword"
        />
      </div>

      {/* ── Divider (desktop only) ─────────────────────── */}
      <div className="hidden sm:flex items-center px-3 border-l border-gray-200">
        <MapPin size={18} className="text-gray-400 flex-shrink-0 mr-2" aria-hidden="true" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-32 text-sm outline-none text-dark placeholder-gray-400 bg-transparent"
          aria-label="Filter by location"
        />
      </div>

      {/* ── Submit button ──────────────────────────────── */}
      <button
        type="submit"
        className="
          bg-primary text-white px-5 py-2.5 rounded-lg
          text-sm font-semibold whitespace-nowrap
          hover:bg-primary-dark transition-colors
        "
      >
        Search my job
      </button>
    </form>
  );
}
