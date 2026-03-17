import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';

/* ── Searchable pages ─────────────────────────────── */
const SEARCH_ITEMS = [
  { label: 'Dashboard',       keywords: ['dashboard', 'home', 'overview'],            to: '/dashboard' },
  { label: 'Transactions',    keywords: ['transaction', 'history', 'payment', 'txn'], to: '/transactions' },
  { label: 'Cards',           keywords: ['card', 'account', 'accounts'],               to: '/accounts' },
  { label: 'Select Card',     keywords: ['select card', 'choose card', 'payment card'], to: '/select-card' },
  { label: 'Quick Transfer', keywords: ['transfer', 'quick transfer', 'send', 'report', 'analytics'], to: '/transfer' },
  { label: 'Profile / Settings', keywords: ['profile', 'setting', 'pin', 'password', 'change'], to: '/profile' },
  { label: 'Create Account',  keywords: ['create', 'new account', 'open'],             to: '/accounts/create' },
];

/* ── Icons ─────────────────────────────────────────── */
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.9-4.55M6 11c0-3.314 2.686-6 6-6a6 6 0 016 6v3.159c0 .538.214 1.055.595 1.436L19 17H9m0 0v1a3 3 0 006 0v-1m-6 0h6" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);

/* ── Helpers ─────────────────────────────────────── */
function fmtAmount(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
}
function fmtDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function shortId(id) {
  return id ? `…${String(id).slice(-6)}` : '—';
}
const STATUS_COLOR = {
  completed: 'text-green-600 bg-green-50',
  pending:   'text-yellow-600 bg-yellow-50',
  failed:    'text-red-600 bg-red-50',
  reversed:  'text-gray-500 bg-gray-100',
};

/* ─────────────────────────────────────────────────── */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const transactions = useSelector((state) => state.transactions.list);

  /* ── Search state ── */
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  /* ── Notification state ── */
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  /* ── Filtered search results ── */
  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q)),
      )
    : [];

  /* ── Latest 6 notifications ── */
  const latestTxns = Array.isArray(transactions) ? transactions.slice(0, 6) : [];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-56 z-30 h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center px-4 md:px-6 gap-4 shadow-[0_8px_30px_rgba(15,23,42,0.15)]">

      {/* ── Search ── */}
      <div className="flex-1 max-w-sm ml-10 lg:ml-0 relative" ref={searchRef}>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <IconSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            placeholder="Search pages…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400"
          />
        </div>

        {/* Search dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {results.map((item) => (
              <button
                key={item.to}
                onMouseDown={() => {
                  navigate(item.to);
                  setQuery('');
                  setShowResults(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* No-results hint */}
        {showResults && q.length > 0 && results.length === 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-gray-400">
            No pages found for &quot;{query}&quot;
          </div>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3 ml-auto">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
            aria-label="Notifications"
          >
            <IconBell />
            {latestTxns.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Recent Transactions</span>
                <button
                  onClick={() => { navigate('/transactions'); setShowNotifs(false); }}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  View all
                </button>
              </div>

              {latestTxns.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No transactions yet</div>
              ) : (
                <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {latestTxns.map((txn) => (
                    <li key={txn._id} className="px-4 py-3 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {fmtAmount(txn.amount)}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {shortId(txn.fromAccount)} → {shortId(txn.toAccount)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{fmtDate(txn.createdAt)}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${STATUS_COLOR[txn.status] || 'text-gray-500 bg-gray-100'}`}>
                          {txn.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {token && user ? (
          <>
            {/* Add new card button */}
            <Link
              to="/accounts/create"
              className="hidden sm:inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
            >
              <IconPlus />
              Add new card
            </Link>

            {/* User avatar + name */}
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-white/20 transition"
              title="Open settings"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {user.name}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
            >
              <IconLogout />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link to="/register" className="primary-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
