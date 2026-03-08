/**
 * components/layout/Navbar.js — Site-wide Navigation Bar
 *
 * Renders a sticky top navigation bar with:
 *   - QuickHire logo (links to home)
 *   - Desktop navigation links (Find Jobs, Browse Companies)
 *   - Admin link and primary CTA button
 *   - Hamburger menu for mobile screens
 *
 * 'use client' is required because this component uses React state
 * (useState) to toggle the mobile menu open/closed.
 * Server Components cannot use hooks — only Client Components can.
 */

'use client';

import Link     from 'next/link';
import { useState } from 'react';
import { Menu, X }  from 'lucide-react';

export default function Navbar() {
  // Controls whether the mobile dropdown menu is visible
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close the mobile menu after a link is tapped
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm select-none">Q</span>
            </div>
            <span className="font-bold text-lg text-dark">QuickHire</span>
          </Link>

          {/* ── Desktop Navigation Links ─────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Browse Companies
            </Link>
          </div>

          {/* ── Desktop Action Buttons ───────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin link — plain text so it doesn't compete with the CTA */}
            <Link
              href="/admin"
              className="text-gray-600 hover:text-primary font-medium transition-colors px-4 py-2"
            >
              Admin
            </Link>

            {/* Primary CTA — stands out with the brand colour */}
            <Link
              href="/jobs"
              className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
            >
              Find Jobs
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ──────────────────── */}
          {/* Hidden on md+ screens, shown on small screens only */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* ── Mobile Dropdown Menu ─────────────────────────
            Conditionally rendered when isMobileMenuOpen === true.
            Each link closes the menu on click via closeMobileMenu().  */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <Link
                href="/jobs"
                className="text-gray-600 hover:text-primary font-medium px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Find Jobs
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary font-medium px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Admin Panel
              </Link>
              <Link
                href="/jobs"
                className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-center mt-2 hover:bg-primary-dark transition-colors"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
