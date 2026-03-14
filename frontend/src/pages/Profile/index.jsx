import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import {
  clearAuthMessages,
  setTransactionPassword,
  updateTransactionPassword,
} from '../../features/auth/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, error, successMessage } = useSelector((state) => state.auth);
  const [setPinValue, setSetPinValue] = useState('');
  const [updatePinForm, setUpdatePinForm] = useState({
    currentTransactionPassword: '',
    newTransactionPassword: '',
  });

  const handleSetPin = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    await dispatch(setTransactionPassword({ transactionPassword: setPinValue }));
    setSetPinValue('');
  };

  const handleUpdatePin = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessages());
    await dispatch(updateTransactionPassword(updatePinForm));
    setUpdatePinForm({ currentTransactionPassword: '', newTransactionPassword: '' });
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-slate-200">Name: {user?.name}</p>
        <p className="text-sm text-slate-200">Email: {user?.email}</p>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-white">Set Transaction Password</h2>
          <form className="space-y-3" onSubmit={handleSetPin}>
            <input
              type="password"
              className="glass-input"
              placeholder="4 to 6 digit PIN"
              value={setPinValue}
              onChange={(event) => setSetPinValue(event.target.value)}
            />
            <button className="primary-btn">Set PIN</button>
          </form>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-white">Update Transaction Password</h2>
          <form className="space-y-3" onSubmit={handleUpdatePin}>
            <input
              type="password"
              className="glass-input"
              placeholder="Current PIN"
              value={updatePinForm.currentTransactionPassword}
              onChange={(event) =>
                setUpdatePinForm((prev) => ({ ...prev, currentTransactionPassword: event.target.value }))
              }
            />
            <input
              type="password"
              className="glass-input"
              placeholder="New PIN"
              value={updatePinForm.newTransactionPassword}
              onChange={(event) =>
                setUpdatePinForm((prev) => ({ ...prev, newTransactionPassword: event.target.value }))
              }
            />
            <button className="primary-btn">Update PIN</button>
          </form>
        </GlassCard>
      </div>

      {successMessage && <p className="text-sm text-emerald-200">{successMessage}</p>}
      {error && <p className="text-sm text-rose-200">{error}</p>}
    </div>
  );
}
