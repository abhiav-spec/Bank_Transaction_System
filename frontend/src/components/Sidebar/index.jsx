import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transfer', label: 'Transfer Money' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/profile', label: 'Profile' },
];

export default function Sidebar() {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return (
    <aside className="sticky top-24 hidden h-fit w-60 rounded-2xl border border-white/20 bg-slate-900/45 p-4 backdrop-blur-xl lg:block">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-200 hover:bg-white/10'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-cyan-300/20 text-cyan-100' : 'text-slate-200 hover:bg-white/10'
              }`
            }
          >
            Admin Dashboard
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
