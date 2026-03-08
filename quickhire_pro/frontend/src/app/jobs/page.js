/**
 * app/jobs/page.js — Job Listings Page
 *
 * Renders the full searchable, filterable job directory at "/jobs".
 *
 * HOW FILTERING WORKS (URL-driven approach):
 *   The active filters live in the URL query string, not in component state.
 *   e.g. /jobs?search=designer&category=Design&type=Full+Time
 *
 *   When a user changes a filter (via SearchBar or JobFilters sidebar),
 *   those Client Components update the URL. Next.js then re-renders this
 *   Server Component with the new searchParams, which triggers a fresh
 *   API call with the updated filters.
 *
 *   Benefits of this pattern:
 *     - Filtered URLs are shareable and bookmarkable
 *     - Browser back/forward works correctly
 *     - No client-side state management needed for filter values
 *
 * Props (provided automatically by Next.js App Router):
 *   searchParams  {Object}  The parsed query string of the current URL
 *                           e.g. { search: 'designer', category: 'Design' }
 */

import Navbar      from '@/components/layout/Navbar';
import Footer      from '@/components/layout/Footer';
import JobCard     from '@/components/jobs/JobCard';
import SearchBar   from '@/components/ui/SearchBar';
import JobFilters  from '@/components/jobs/JobFilters';
import { getJobs, getCategories } from '@/lib/api';

export default async function JobsPage({ searchParams }) {
  // Destructure the active filters from the URL query string
  const { search, category, location, type } = searchParams;

  let jobs       = [];
  let categories = [];

  try {
    // Fetch jobs and categories in parallel, passing active filters to the jobs call
    const [jobsResponse, catsResponse] = await Promise.all([
      getJobs({ search, category, location, type }),
      getCategories(),
    ]);

    jobs       = jobsResponse.data || [];
    categories = catsResponse.data || [];
  } catch {
    // Backend offline — render empty state gracefully
  }

  // ── Build a human-readable description of the active filters ──
  // e.g. 'for "designer"' or 'in Design'
  const filterDescription = [
    search   && `for "${search}"`,
    category && `in ${category}`,
    location && `near ${location}`,
    type     && `(${type})`,
  ].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            Find your <span className="text-primary">dream job</span>
          </h1>

          {/* Result count line — updates dynamically with filters */}
          <p className="text-gray-500 mb-6">
            <span className="font-semibold text-dark">{jobs.length}</span> job
            {jobs.length !== 1 ? 's' : ''} available
            {filterDescription && (
              <span className="text-gray-400"> {filterDescription}</span>
            )}
          </p>

          {/* Pre-filled search bar — reflects the current ?search= and ?location= values */}
          <SearchBar
            defaultSearch={search   || ''}
            defaultLocation={location || ''}
          />
        </div>
      </div>

      {/* ── Main Content: Sidebar + Job Grid ─────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Sidebar — hidden on mobile, visible on large screens */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <JobFilters
              categories={categories}
              activeCategory={category}
              activeType={type}
            />
          </aside>

          {/* Job Grid */}
          <div className="flex-1 min-w-0">
            {jobs.length > 0 ? (
              <>
                {/* Sort bar */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-500 text-sm">
                    Showing <span className="font-semibold text-dark">{jobs.length}</span> result{jobs.length !== 1 ? 's' : ''}
                  </p>
                  {/* Sort control — UI only (actual sorting happens server-side in a full impl.) */}
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-primary transition-colors">
                    <option>Most recent</option>
                    <option>Oldest first</option>
                  </select>
                </div>

                {/* Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            ) : (
              // Empty state — shown when filters return no results
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-dark mb-2">No jobs found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Try adjusting your search terms or filters.
                  Make sure the backend server is running on{' '}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    localhost:5000
                  </code>.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
