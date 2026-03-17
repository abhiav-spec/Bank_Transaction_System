import { NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin', label: 'Dashboard Overview' },
  { to: '/admin/search-account', label: 'Search Account' },
  { to: '/admin/all-accounts', label: 'All Accounts' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/transactions', label: 'Transactions' },
  { to: '/admin/system-funding', label: 'System Funding' },
];

export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="w-full rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur-xl lg:sticky lg:top-24 lg:h-fit lg:w-72">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-700">Bank Control Panel</p>
      <nav className="space-y-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-blue-300/30 text-slate-900 font-medium' : 'text-slate-700 hover:bg-white/40'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="block w-full rounded-xl border border-red-300/40 px-3 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-300/20"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
