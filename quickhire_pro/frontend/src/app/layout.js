/**
 * app/layout.js — Root Layout
 *
 * Next.js App Router requires a root layout that wraps every page.
 * This is the outermost shell of the application — it renders the
 * <html> and <body> tags, and includes the global CSS file.
 *
 * The `metadata` export tells Next.js what to put in the <head>:
 * title and description are used for SEO and browser tabs.
 *
 * Any UI placed here (e.g. a persistent header or analytics script)
 * would appear on EVERY page without needing to be imported separately.
 * We chose to import Navbar/Footer per-page instead for more control.
 */

import './globals.css';

export const metadata = {
  title:       'QuickHire — Find Your Dream Job',
  description: 'Great platform for job seekers searching for new career heights and passionate about startups.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning is not needed here since we don't
        have theme toggling, but it's good to know it exists if you
        add dark mode later.
      */}
      <body>{children}</body>
    </html>
  );
}
