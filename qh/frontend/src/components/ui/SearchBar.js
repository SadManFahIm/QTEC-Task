/**
 * SearchBar — QuickHire
 *
 * Keyword + location search form used in two places:
 *  - Hero section of the landing page
 *  - Top of the Job Listings page
 *
 * On submit, redirects the user to /jobs with the search and
 * location values encoded as URL query parameters. This keeps
 * search state in the URL (shareable, browser-back-button friendly).
 *
 * Props:
 *  defaultSearch   {string} — pre-fills the keyword field (used on /jobs)
 *  defaultLocation {string} — pre-fills the location field
 */
'use client';

import { useState }        from 'react';
import { useRouter }       from 'next/navigation';
import { Search, MapPin }  from 'lucide-react';

export default function SearchBar({ defaultSearch = '', defaultLocation = '' }) {
  const [search,   setSearch]   = useState(defaultSearch);
  const [location, setLocation] = useState(defaultLocation);
  const router = useRouter();

  /**
   * Builds the query string from current field values and pushes
   * the user to the /jobs route. Empty fields are omitted from the URL.
   */
  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search.trim())   params.set('search',   search.trim());
    if (location.trim()) params.set('location', location.trim());

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 bg-white border-2 border-gray-100
                 rounded-xl p-2 shadow-sm max-w-xl"
    >
      {/* ── Keyword Input ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-1 px-2">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Job title or keyword"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none text-dark placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* ── Location Input (hidden on mobile to save space) ────────── */}
      <div className="hidden sm:flex items-center gap-2 px-3 border-l border-gray-200">
        <MapPin size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-32 text-sm outline-none text-dark placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* ── Submit Button ─────────────────────────────────────────── */}
      <button
        type="submit"
        className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold
                   hover:bg-primary-dark transition-colors whitespace-nowrap"
      >
        Search my job
      </button>
    </form>
  );
}
