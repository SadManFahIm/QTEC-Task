/**
 * Footer — QuickHire
 *
 * Site-wide footer rendered at the bottom of every page.
 * Divided into four columns:
 *  1. Brand description
 *  2. About links
 *  3. Resource links
 *  4. Newsletter subscription input
 *
 * The newsletter form is purely presentational — no backend hook needed
 * for the assessment scope.
 */
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Four-column grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-lg">QuickHire</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Great platform for the job seeker that is searching for new career heights
              and passionate about startups. Find your dream job easier.
            </p>
          </div>

          {/* Column 2 — About Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">About</h4>
            <ul className="space-y-3">
              {['Companies', 'Pricing', 'Terms', 'Advice', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resource Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {['Help Docs', 'Guide', 'Updates', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="font-semibold mb-2 text-white">Get job notifications</h4>
            <p className="text-gray-400 text-sm mb-4">
              The latest job news and articles, sent to your inbox weekly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2
                           text-sm text-white placeholder-gray-400
                           focus:outline-none focus:border-primary transition-colors"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm
                                 font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row
                        justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2024 QuickHire. All rights reserved.</p>
          <div className="flex gap-4">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
              <Link
                key={social}
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
