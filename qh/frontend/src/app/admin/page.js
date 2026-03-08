/**
 * Admin Page — QuickHire  (/admin)
 *
 * Server Component: fetches jobs and applications from the API,
 * then passes the data down to the AdminDashboard client component.
 *
 * Keeping the data fetch in a Server Component means the initial
 * page load is fast and fully rendered — the client component then
 * takes over for interactive actions (create/delete).
 */
import Navbar         from '@/components/layout/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getJobs, getApplications } from '@/lib/api';

export default async function AdminPage() {
  let jobs         = [];
  let applications = [];

  try {
    // Fetch both datasets concurrently to minimise loading time
    const [jobsRes, appsRes] = await Promise.all([
      getJobs(),
      getApplications(),
    ]);
    jobs         = jobsRes.data || [];
    applications = appsRes.data || [];
  } catch {
    // If the API is down, the dashboard renders with empty arrays
    // and the toast system will show an error when the user tries to interact
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/*
        AdminDashboard is a Client Component.
        We pass the server-fetched data as props so the initial render
        is pre-populated — no loading spinner on first visit.
      */}
      <AdminDashboard
        initialJobs={jobs}
        initialApplications={applications}
      />
    </div>
  );
}
