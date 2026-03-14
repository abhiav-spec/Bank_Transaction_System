import { useSelector } from 'react-redux';

export default function AdminNavbar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan-100/70">System User</p>
          <h1 className="text-lg font-semibold text-white md:text-xl">Banking Admin Dashboard</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-100">{user?.name || 'System Admin'}</p>
          <p className="text-xs text-slate-300">{user?.email || 'admin@bank.local'}</p>
        </div>
      </div>
    </header>
  );
}
