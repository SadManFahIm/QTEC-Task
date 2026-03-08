/**
 * Navbar — QuickHire
 *
 * Sticky top navigation bar shown on every page.
 * Includes:
 *  - Brand logo (links back to home)
 *  - Primary navigation links
 *  - Admin panel shortcut
 *  - Hamburger menu for mobile viewports (toggles on click)
 *
 * Marked 'use client' because it uses useState for the mobile menu toggle.
 */
'use client';

import Link     from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  // Controls whether the mobile menu drawer is visible
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand Logo ────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="font-bold text-lg text-dark">QuickHire</span>
          </Link>

          {/* ── Desktop Navigation Links ──────────────────────────── */}
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

          {/* ── Desktop Auth / CTA Buttons ────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-primary font-medium transition-colors px-4 py-2"
            >
              Admin
            </Link>
            <Link
              href="/jobs"
              className="bg-primary text-white px-5 py-2 rounded-lg font-semibold
                         hover:bg-primary-dark transition-colors text-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* ── Mobile: Hamburger Icon ────────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile Menu Drawer ──────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link
                href="/jobs"
                className="text-gray-600 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
              <Link
                href="/jobs"
                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
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
