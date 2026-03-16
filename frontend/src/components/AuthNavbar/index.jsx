import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── About Modal ─────────────────────────────────────────────────────────── */
function AboutModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-sky-950/70 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sky-200 transition hover:bg-white/30 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/25 ring-1 ring-sky-300/50">
            <svg className="h-6 w-6 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v9a1 1 0 001 1h14a1 1 0 001-1v-9" />
            </svg>
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-sky-200">About NexaBank</h2>
            <p className="text-xs text-sky-300/70">Your trusted digital banking partner</p>
          </div>
        </div>

        {/* description */}
        <p className="mb-6 text-sm leading-relaxed text-sky-100/80">
          NexaBank is a modern, full-stack digital banking platform designed to make personal
          finance seamless, secure, and accessible for everyone. From instant fund transfers
          to real-time balance tracking, we put your money in your hands — anytime, anywhere.
        </p>

        {/* features grid */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: '🔒', title: 'Bank-Grade Security', desc: '256-bit encryption & JWT-secured sessions protect every transaction.' },
            { icon: '⚡', title: 'Instant Transfers',   desc: 'Move funds between accounts in real-time with zero delays.' },
            { icon: '📊', title: 'Full Transparency',   desc: 'Complete ledger history — every credit and debit, always visible.' },
            { icon: '🌐', title: 'Always Available',    desc: '24/7 cloud-hosted service engineered for high availability.' },
            { icon: '👤', title: 'Multi-Account',       desc: 'Open savings & current accounts, each with its own balance.' },
            { icon: '🛡️', title: 'Admin Controls',      desc: 'System-level funding, account management & oversight built in.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
              <span className="mt-0.5 text-xl leading-none">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-sky-200">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-sky-100/65">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* footer strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="text-xs text-sky-300/60">© {new Date().getFullYear()} NexaBank. All rights reserved.</p>
          <div className="flex gap-3">
            <Link
              to="/register"
              onClick={onClose}
              className="rounded-full bg-sky-400 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-sky-300"
            >
              Open Account
            </Link>
            <Link
              to="/login"
              onClick={onClose}
              className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AuthNavbar ──────────────────────────────────────────────────────────── */
export default function AuthNavbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [aboutOpen,  setAboutOpen]    = useState(false);

  return (
    <>
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      <header className="relative z-20 w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/30 backdrop-blur-sm ring-1 ring-sky-300/60">
              <svg className="h-4 w-4 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v9a1 1 0 001 1h14a1 1 0 001-1v-9" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-wide text-sky-200 drop-shadow">
              NexaBank
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            <li>
              <button
                onClick={() => setAboutOpen(true)}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-sky-100 transition hover:bg-white/15 hover:text-white"
              >
                About Us
              </button>
            </li>
            <li>
              <Link
                to="/login"
                className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/25"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="rounded-full bg-sky-400 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-300"
              >
                Create Account
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center rounded-md p-2 text-sky-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="mx-4 mb-2 rounded-2xl bg-sky-900/80 px-5 py-4 backdrop-blur-md ring-1 ring-white/10 md:hidden">
            <ul className="flex flex-col gap-3">
              <li>
                <button
                  onClick={() => { setAboutOpen(true); setMobileOpen(false); }}
                  className="text-left text-sm font-medium text-sky-100 hover:text-white"
                >
                  About Us
                </button>
              </li>
              <li><Link to="/login"    className="text-sm font-medium text-sky-100 hover:text-white">Sign In</Link></li>
              <li><Link to="/register" className="text-sm font-semibold text-sky-300 hover:text-white">Create Account</Link></li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
