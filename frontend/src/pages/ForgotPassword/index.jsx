import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { clearAuthMessages, forgotPassword } from '../../features/auth/authSlice';

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
    <div className="grid min-h-screen place-items-center p-4">
      <GlassCard className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="glass-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className="primary-btn w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        {successMessage && <p className="text-sm text-emerald-200">{successMessage}</p>}
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <Link to="/login" className="text-sm text-cyan-200">Back to login</Link>
      </GlassCard>
    </div>
  );
}
