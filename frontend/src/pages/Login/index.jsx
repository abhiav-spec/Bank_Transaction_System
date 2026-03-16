import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import AuthNavbar from '../../components/AuthNavbar';
import { clearAuthMessages, loginUser } from '../../features/auth/authSlice';
import bgWoman from '../../assets/istockphoto-1268431528-612x612.jpg';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      setTermsError('Please agree to the Terms of Service to continue.');
      return;
    }
    setTermsError('');
    dispatch(clearAuthMessages());
    try {
      await dispatch(loginUser(form)).unwrap();
      navigate('/dashboard');
    } catch {
      return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ─── Full-page background image ─── */}
      <div className="absolute inset-0 -z-10">
        <img
          src={bgWoman}
          alt="background"
          className="h-full w-full object-cover object-center"
        />
        {/* sky-blue tinted blur overlay */}
        <div className="absolute inset-0 bg-sky-900/55 backdrop-blur-[3px]" />
        {/* subtle gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 via-cyan-300/15 to-sky-600/30" />
      </div>

      {/* ─── Navbar ─── */}
      <AuthNavbar />

      {/* ─── Main content ─── */}
      <main className="relative z-10 flex min-h-[calc(100vh-72px)] w-full items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">

          {/* Left: bank name + tagline */}
          <div className="max-w-md text-center lg:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Welcome to
            </p>
            <h1
              className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-sky-200 drop-shadow-lg"
              style={{ textShadow: '0 0 32px rgba(56,189,248,0.45)' }}
            >
              NexaBank
            </h1>
            <p className="text-base font-medium leading-relaxed text-sky-100/80">
              Your trusted partner for seamless,<br className="hidden lg:block" />
              secure &amp; smart banking — anytime, anywhere.
            </p>
            <div className="mt-6 hidden items-center gap-3 lg:flex">
              <span className="h-px w-12 bg-sky-400/60" />
              <span className="text-xs text-sky-300/70">Trusted by 1M+ customers</span>
            </div>
          </div>

          {/* Right: login card */}
          <GlassCard className="w-full max-w-[400px] space-y-6 !border-white/20 !bg-white/10 !shadow-2xl !backdrop-blur-xl">

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="text-sm text-sky-200/80">Access your NexaBank dashboard</p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-sky-200/70">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="w-full border-0 border-b border-sky-300/40 bg-transparent px-0 py-2 text-white placeholder:text-sky-300/50 focus:border-b-sky-300 focus:outline-none focus:ring-0"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-sky-200/70">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full border-0 border-b border-sky-300/40 bg-transparent px-0 py-2 text-white placeholder:text-sky-300/50 focus:border-b-sky-300 focus:outline-none focus:ring-0"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-sky-200/70">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => {
                    setAgreedToTerms(event.target.checked);
                    if (event.target.checked) {
                      setTermsError('');
                    }
                  }}
                  className="h-3.5 w-3.5 rounded border-sky-300/40 accent-sky-400"
                />
                I agree to the Terms of Service
              </label>

              {termsError && (
                <p className="text-xs text-red-300">{termsError}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-200 hover:scale-[1.02] hover:from-sky-300 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || !agreedToTerms}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/register"
                className="font-medium text-sky-300 transition hover:text-white"
              >
                Create account
              </Link>
              <Link
                to="/forgot-password"
                className="font-medium text-sky-300 transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
