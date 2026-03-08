/**
 * Root Layout — QuickHire
 *
 * Next.js App Router requires a root layout that wraps every page.
 * This file:
 *  - Sets the <html> and <body> tags
 *  - Imports global styles (Tailwind + Google Fonts)
 *  - Defines page-level metadata used by search engines
 */
import './globals.css';

export const metadata = {
  title       : 'QuickHire — Find Your Dream Job',
  description : 'Great platform for job seekers searching for new career heights. Browse 5000+ jobs from top companies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
