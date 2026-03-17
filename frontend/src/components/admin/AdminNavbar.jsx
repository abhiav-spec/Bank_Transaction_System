import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function AdminNavbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/admin" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-700 font-bold text-sm">
            🏦
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">NEXA Bank</h2>
            <p className="text-xs text-slate-600">Admin Portal</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-700">System User</p>
            <h1 className="text-base font-semibold text-slate-900">Admin Dashboard</h1>
          </div>
          <div className="border-l border-slate-300 pl-8 text-right">
            <p className="text-sm font-medium text-slate-800">{user?.name || 'System Admin'}</p>
            <p className="text-xs text-slate-600">{user?.email || 'admin@bank.local'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
