import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAccess, hydrateAuthFromStorage, logoutUser } from './features/auth/authSlice';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import DashboardPage from './pages/Dashboard';
import AccountsPage from './pages/Accounts';
import CreateAccountPage from './pages/CreateAccount';
import TransferPage from './pages/Transfer';
import TransactionsPage from './pages/Transactions';
import ProfilePage from './pages/Profile';
import SelectCardPage from './pages/SelectCard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminNavbar from './components/admin/AdminNavbar';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminOverviewPage from './pages/Admin/Overview';
import SearchAccountPage from './pages/Admin/SearchAccount';
import AllAccountsPage from './pages/Admin/AllAccounts';
import AdminUsersPage from './pages/Admin/Users';
import AdminTransactionsPage from './pages/Admin/Transactions';
import SystemFundingPage from './pages/Admin/SystemFunding';
import bgWoman from './assets/istockphoto-1268431528-612x612.jpg';

function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { token, isAdmin, adminChecked, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (!adminChecked) return <div className="min-h-screen grid place-items-center text-white">Checking access...</div>;
  if (!isAdmin || user?.role !== 'system') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function UserRoute() {
  const { token, isAdmin, adminChecked, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (!adminChecked) return <div className="min-h-screen grid place-items-center text-white">Checking access...</div>;
  if (isAdmin && user?.role === 'system') return <Navigate to="/admin" replace />;
  return <Outlet />;
}

function AppLayout() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Login-like background for all user pages after authentication */}
      <div className="absolute inset-0 -z-10">
        <img
          src={bgWoman}
          alt="dashboard background"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-sky-900/55 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-sky-600/20" />
      </div>

      {/* Fixed left sidebar */}
      <Sidebar />
      {/* Main area offset by sidebar width */}
      <div className="flex-1 flex flex-col lg:ml-56">
        <Navbar />
        {/* Content below the fixed top header (h-16) */}
        <main className="flex-1 mt-16 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen text-white">
      <AdminNavbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-6 pt-6 md:px-6 lg:flex-row">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { token, isAdmin, adminChecked, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (!adminChecked) return <div className="min-h-screen grid place-items-center text-white">Loading...</div>;
  if (isAdmin && user?.role === 'system') return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
}

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(checkAdminAccess());
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<UserRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/create" element={<CreateAccountPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/select-card" element={<SelectCardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverviewPage />} />
            <Route path="/admin/search-account" element={<SearchAccountPage />} />
            <Route path="/admin/all-accounts" element={<AllAccountsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
            <Route path="/admin/system-funding" element={<SystemFundingPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
