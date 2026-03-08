/**
 * Job Listings Page — QuickHire  (/jobs)
 *
 * Server Component: reads filter values from URL search params,
 * fetches matching jobs from the API, and renders the results.
 *
 * Layout:
 *  - Search bar header with result count
 *  - Two-column layout: filter sidebar (desktop) + job card grid
 *
 * URL parameters handled:
 *  ?search=keyword
 *  ?category=Design
 *  ?location=London
 *  ?type=Full+Time
 */
import Navbar      from '@/components/layout/Navbar';
import Footer      from '@/components/layout/Footer';
import JobCard     from '@/components/jobs/JobCard';
import SearchBar   from '@/components/ui/SearchBar';
import JobFilters  from '@/components/jobs/JobFilters';
import { getJobs, getCategories } from '@/lib/api';

export default async function JobsPage({ searchParams }) {
  const { search, category, location, type } = searchParams;

  let jobs       = [];
  let categories = [];

  try {
    // Fetch jobs (with active filters) and categories concurrently
    const [jobsRes, catsRes] = await Promise.all([
      getJobs({ search, category, location, type }),
      getCategories(),
    ]);
    jobs       = jobsRes.data       || [];
    categories = catsRes.data       || [];
  } catch {
    // Render empty state if backend is unreachable
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            Find your <span className="text-primary">dream job</span>
          </h1>
          <p className="text-gray-500 mb-6">
            <span className="font-semibold text-dark">{jobs.length}</span> jobs available
            {search   && <span> matching &ldquo;{search}&rdquo;</span>}
            {category && <span> in {category}</span>}
          </p>
          <SearchBar defaultSearch={search || ''} defaultLocation={location || ''} />
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Sidebar — hidden below lg breakpoint */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <JobFilters
              categories={categories}
              activeCategory={category}
              activeType={type}
            />
          </aside>

          {/* Job grid */}
          <div className="flex-1">
            {jobs.length > 0 ? (
              <>
                {/* Sort / results info bar */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-500 text-sm">
                    Showing <span className="font-semibold text-dark">{jobs.length}</span> results
                  </p>
                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2
                                     text-gray-600 bg-white focus:outline-none focus:border-primary">
                    <option>Most recent</option>
                    <option>Oldest first</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-dark mb-2">No jobs found</h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or clearing the filters.
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
