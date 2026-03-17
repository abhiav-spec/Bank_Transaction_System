import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

/* ─── Inline SVG Icons ─────────────────────────────────────── */
const IconDashboard = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
  </svg>
);
const IconTransactions = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);
const IconCards = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="5" width="20" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
  </svg>
);
const IconSelectCard = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M3 12h18M3 16.5h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12l2 2 4-4" transform="translate(-2 2)" />
  </svg>
);
const IconReports = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-5 4 3 4-6" />
  </svg>
);
const IconSettings = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const IconAdmin = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
const IconMenu = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconClose = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { to: '/transactions', label: 'Transactions', Icon: IconTransactions },
  { to: '/accounts', label: 'Cards', Icon: IconCards },
  { to: '/select-card', label: 'Select Card', Icon: IconSelectCard },
  { to: '/transfer', label: 'Quick Transfer', Icon: IconReports },
  { to: '/profile', label: 'Settings', Icon: IconSettings },
];

function SidebarContent({ isAdmin, onClose }) {
  const homeRoute = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-6 mb-2">
        <Link
          to={homeRoute}
          onClick={onClose || undefined}
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#b8e66b] flex items-center justify-center">
            <span className="text-[#1a2130] font-black text-sm">N</span>
          </div>
          <span className="text-slate-800 font-bold text-base tracking-tight">NexaBank</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 lg:hidden">
            <IconClose />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <IconAdmin />
            <span>Admin Dashboard</span>
          </NavLink>
        )}
      </nav>

      {/* Footer tag */}
      <div className="px-5 py-4">
        <p className="text-xs text-slate-500">© 2026 NexaBank</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger trigger (shown in Navbar area, rendered here for overlay) */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/20 text-slate-800 backdrop-blur-md border border-white/30 p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <IconMenu />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white/15 backdrop-blur-xl border-r border-white/25 shadow-[0_8px_30px_rgba(15,23,42,0.16)] transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent isAdmin={isAdmin} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-white/15 backdrop-blur-xl border-r border-white/25 shadow-[0_8px_30px_rgba(15,23,42,0.16)]">
        <SidebarContent isAdmin={isAdmin} onClose={null} />
      </aside>
    </>
  );
}
