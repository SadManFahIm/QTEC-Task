/**
 * app/admin/page.js — Admin Dashboard Page
 *
 * Serves the admin control panel at "/admin".
 *
 * WHY SERVER + CLIENT SPLIT?
 *   This page is a Server Component so it can:
 *     1. Fetch the initial jobs and applications lists on the server
 *        (no loading spinner on first paint)
 *     2. Pass that data down to AdminDashboard as props
 *
 *   AdminDashboard is a Client Component that:
 *     1. Holds the mutable jobs list in useState
 *     2. Handles button clicks (create / delete)
 *     3. Shows modals and toast notifications
 *
 *   This pattern avoids an extra client-side fetch on mount while
 *   still allowing rich interactivity once the page loads.
 */

import Navbar         from '@/components/layout/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getJobs, getApplications } from '@/lib/api';

export default async function AdminPage() {
  let jobs         = [];
  let applications = [];

  try {
    // Fetch both lists simultaneously for a faster initial load
    const [jobsResponse, appsResponse] = await Promise.all([
      getJobs(),
      getApplications(),
    ]);

    jobs         = jobsResponse.data || [];
    applications = appsResponse.data || [];
  } catch {
    // Backend offline — AdminDashboard will show empty states
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/*
        Pass server-fetched data as initial props.
        AdminDashboard takes ownership of the jobs array in its own state
        so it can add/remove items optimistically without refetching.
      */}
      <AdminDashboard
        initialJobs={jobs}
        initialApplications={applications}
      />
    </div>
  );
}
