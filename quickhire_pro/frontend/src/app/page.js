/**
 * app/page.js — Landing Page (Home)
 *
 * This is the root page of the application, served at "/".
 * It's an ASYNC SERVER COMPONENT — Next.js renders it on the server,
 * fetches all data before sending HTML to the browser, giving us
 * fast initial load times and good SEO.
 *
 * PAGE SECTIONS (top to bottom):
 *   1. Navbar
 *   2. Hero — headline, search bar, popular tags
 *   3. Company logos strip — social proof
 *   4. Explore by Category — 8 category cards
 *   5. CTA Banner — "Start posting jobs today"
 *   6. Featured Jobs — 8 latest job cards (2×4 grid)
 *   7. Latest Jobs Open — compact list of 8 jobs
 *   8. Footer
 *
 * DATA FETCHING:
 *   Both API calls are made in parallel with Promise.all() so the
 *   total wait time is max(jobsTime, catsTime) rather than their sum.
 *   If the backend is offline, errors are caught silently and the page
 *   renders with empty state messages instead of crashing.
 */

import Link          from 'next/link';
import Navbar        from '@/components/layout/Navbar';
import Footer        from '@/components/layout/Footer';
import JobCard       from '@/components/jobs/JobCard';
import JobListItem   from '@/components/jobs/JobListItem';
import CategoryCard  from '@/components/jobs/CategoryCard';
import SearchBar     from '@/components/ui/SearchBar';
import { getJobs, getCategories } from '@/lib/api';

// ── Static company logo data ──────────────────────────────────
// Shown in the "social proof" strip below the hero.
// Styled purely with Tailwind to mimic the Figma design without images.
const COMPANY_LOGOS = [
  { name: 'Vodafone', className: 'font-bold text-red-600 tracking-tight' },
  { name: 'intel',    className: 'font-bold text-blue-700 italic text-xl' },
  { name: 'TESLA',    className: 'font-bold text-gray-900 tracking-[0.3em]' },
  { name: 'AMD',      className: 'font-bold text-black text-xl' },
  { name: 'Talkit',   className: 'font-bold text-gray-700 tracking-wide' },
];

// ── Fallback categories shown when the backend is offline ─────
const FALLBACK_CATEGORIES = [
  'Design', 'Sales', 'Marketing', 'Finance',
  'Technology', 'Engineering', 'Business', 'Human Resource',
];

// ─────────────────────────────────────────────────────────────

export default async function HomePage() {
  // ── Fetch data from the backend ──────────────────────────
  let jobs       = [];
  let categories = [];

  try {
    // Run both requests simultaneously — faster than awaiting them sequentially
    const [jobsResponse, catsResponse] = await Promise.all([
      getJobs(),
      getCategories(),
    ]);

    jobs       = jobsResponse.data || [];
    categories = catsResponse.data || [];
  } catch {
    // Backend is offline or unreachable — page renders with empty/fallback state
    // No need to crash — we show helpful empty-state messages instead
  }

  // Slice the job list for each section
  const featuredJobs = jobs.slice(0, 8); // "Featured Jobs" grid (up to 8)
  const latestJobs   = jobs.slice(0, 8); // "Latest Jobs Open" list (up to 8)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
          Large heading + search bar + popular tags.
          Decorative circles in the background are purely visual.
          ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white pt-12 pb-20">

        {/* Decorative background circles — pointer-events-none so they
            don't interfere with clicks */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 right-20 w-64 h-64 border border-primary/10 rounded-full" />
          <div className="absolute top-32 right-32 w-40 h-40 border border-primary/10 rounded-full" />
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 border border-gray-100 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy + search */}
            <div className="relative z-10">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-dark leading-tight mb-6">
                Discover<br />
                more than<br />
                {/* Wavy underline drawn with an inline SVG — pure CSS alternative */}
                <span className="text-primary relative">
                  5000+ Jobs
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 6 Q50 2 100 6 Q150 10 200 6"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-gray-500 text-base mb-8 max-w-md leading-relaxed">
                Great platform for the job seeker that searching for new career
                heights and passionate about startups.
              </p>

              {/* SearchBar is a Client Component — handles input state */}
              <SearchBar />

              {/* Popular search tags */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-gray-400 text-sm">Popular:</span>
                {['UI Designer', 'UX Researcher', 'Android', 'Admin'].map(tag => (
                  <Link
                    key={tag}
                    href={`/jobs?search=${encodeURIComponent(tag)}`}
                    className="text-sm text-gray-600 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — decorative illustration placeholder */}
            <div className="hidden lg:flex justify-center items-end relative" aria-hidden="true">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-primary/5 rounded-3xl" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-8">
                  <div className="text-8xl mb-2">👨‍💼</div>
                  <div className="bg-white rounded-xl px-4 py-2 shadow-lg inline-block">
                    <span className="font-bold text-primary text-sm">5000+ Jobs Available</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — COMPANY LOGOS STRIP
          Social proof: companies that have used QuickHire.
          ════════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400 text-sm mb-6 text-center tracking-wide uppercase text-xs">
            Companies we helped grow
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {COMPANY_LOGOS.map(company => (
              <span
                key={company.name}
                className={`text-lg ${company.className} opacity-50 hover:opacity-100 transition-opacity cursor-default`}
              >
                {company.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — EXPLORE BY CATEGORY
          8 clickable category cards. "Marketing" is highlighted
          as the active/featured category by default.
          If the backend is offline, we render fallback categories
          with randomised counts.
          ════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-dark">
              Explore by <span className="text-primary">category</span>
            </h2>
            <Link href="/jobs" className="text-primary font-semibold text-sm hover:underline">
              Show all jobs →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categories.length > 0 ? categories.slice(0, 8) : FALLBACK_CATEGORIES.map(c => ({ category: c, count: 0 }))).map(cat => (
              <CategoryCard
                key={cat.category}
                category={cat.category}
                count={cat.count}
                active={cat.category === 'Marketing'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — CTA BANNER
          Promotional block encouraging admins to post jobs.
          Contains a mock dashboard widget for visual interest.
          ════════════════════════════════════════════════════ */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 md:p-14 items-center">

              {/* Left — headline + CTA button */}
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                  Start posting<br />jobs today
                </h2>
                <p className="text-white/70 mb-6 text-sm">
                  Start posting jobs for only $10.
                </p>
                <Link
                  href="/admin"
                  className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Sign Up For Free
                </Link>
              </div>

              {/* Right — mock dashboard widget (purely decorative) */}
              <div className="hidden md:flex justify-center" aria-hidden="true">
                <div className="bg-white/10 rounded-2xl p-6 w-full max-w-xs">
                  <div className="bg-white rounded-xl p-4 shadow-lg mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">76</div>
                      <div>
                        <div className="font-bold text-dark text-sm">New Applications</div>
                        <div className="text-xs text-gray-400">Today</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-3/4 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 rounded-xl p-3 text-white">
                      <div className="font-bold text-xl">24</div>
                      <div className="text-xs text-white/70">Active Jobs</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-white">
                      <div className="font-bold text-xl">12</div>
                      <div className="text-xs text-white/70">Hired</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — FEATURED JOBS
          Up to 8 jobs in a responsive 4-column card grid.
          Shows an empty state with instructions if no data.
          ════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-dark">
              Featured <span className="text-primary">jobs</span>
            </h2>
            <Link href="/jobs" className="text-primary font-semibold text-sm hover:underline">
              Show all jobs →
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            // Empty state — guides developers to start the backend
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-4">💼</div>
              <p className="font-semibold text-dark mb-1">No jobs found</p>
              <p className="text-gray-500 text-sm">
                Make sure the backend is running on{' '}
                <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                  http://localhost:5000
                </code>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6 — LATEST JOBS OPEN
          Same job data in a compact two-column list layout.
          ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-dark">
              Latest <span className="text-primary">jobs open</span>
            </h2>
            <Link href="/jobs" className="text-primary font-semibold text-sm hover:underline">
              Show all jobs →
            </Link>
          </div>

          {latestJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestJobs.map(job => (
                <JobListItem key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Connect to the backend to see the latest jobs.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
