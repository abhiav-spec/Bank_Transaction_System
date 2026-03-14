import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAdmin } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-white/20 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/dashboard" className="text-lg font-semibold text-cyan-200">
          NeoBank Console
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-100">
          {token && user ? (
            <>
              <span className="hidden sm:inline">{user.name}</span>
              {isAdmin && (
                <Link to="/admin" className="rounded-md border border-cyan-300/30 px-3 py-1 hover:bg-cyan-300/10">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-md border border-rose-300/30 px-3 py-1 text-rose-200 hover:bg-rose-300/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md border border-white/30 px-3 py-1 hover:bg-white/10">
                Login
              </Link>
              <Link to="/register" className="rounded-md border border-white/30 px-3 py-1 hover:bg-white/10">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
