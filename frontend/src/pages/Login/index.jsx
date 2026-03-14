import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBackground from '../../components/ThreeBackground';
import GlassCard from '../../components/GlassCard';
import { clearAuthMessages, loginUser } from '../../features/auth/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    try {
      await dispatch(loginUser(form)).unwrap();
      navigate('/dashboard');
    } catch {
      return null;
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center p-4">
      <ThreeBackground />
      <GlassCard className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="glass-input"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="glass-input"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button type="submit" className="primary-btn w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <div className="flex justify-between text-sm text-slate-200">
          <Link to="/register" className="text-cyan-200">Create account</Link>
          <Link to="/forgot-password" className="text-cyan-200">Forgot password?</Link>
        </div>
      </GlassCard>
    </div>
  );
}
