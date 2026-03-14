import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import { clearAuthMessages, resetPassword } from '../../features/auth/authSlice';

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const tokenFromUrl = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    await dispatch(resetPassword({ token, newPassword }));
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <GlassCard className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Reset token"
            className="glass-input"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="glass-input"
            required
          />
          <button className="primary-btn w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
        {successMessage && <p className="text-sm text-emerald-200">{successMessage}</p>}
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <Link to="/login" className="text-sm text-cyan-200">Back to login</Link>
      </GlassCard>
    </div>
  );
}
