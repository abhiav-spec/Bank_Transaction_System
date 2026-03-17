import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthNavbar from '../../components/AuthNavbar';
import GlassCard from '../../components/GlassCard';
import { clearAuthMessages, forgotPassword } from '../../features/auth/authSlice';
import bgBanking from '../../assets/istockphoto-1268431528-612x612.jpg';

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    await dispatch(forgotPassword({ email }));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={bgBanking} alt="background" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-sky-900/55 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/30 via-cyan-300/15 to-sky-600/30" />
      </div>

      <AuthNavbar />

      <main className="relative z-10 flex min-h-[calc(100vh-72px)] w-full items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md text-center lg:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Need Help?</p>
            <h1
              className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-sky-200 drop-shadow-lg"
              style={{ textShadow: '0 0 32px rgba(56,189,248,0.45)' }}
            >
              Password Recovery
            </h1>
            <p className="text-base font-medium leading-relaxed text-sky-100/80">
              Enter your registered email and we’ll send you a secure reset link.
            </p>
          </div>

          <GlassCard className="w-full max-w-[420px] space-y-5 !border-white/20 !bg-white/10 !shadow-2xl !backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
              <p className="text-sm text-sky-200/80">Receive a reset link via email</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-sky-200/70">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-0 border-b border-sky-300/40 bg-transparent px-0 py-2 text-white placeholder:text-sky-300/50 focus:border-b-sky-300 focus:outline-none focus:ring-0"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2.5 font-semibold text-white shadow-lg shadow-sky-500/30 transition-all duration-200 hover:scale-[1.02] hover:from-sky-300 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {successMessage && (
              <p className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">{successMessage}</p>
            )}
            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>
            )}

            <Link to="/login" className="text-sm font-medium text-sky-300 transition hover:text-white">
              Back to Sign In
            </Link>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
