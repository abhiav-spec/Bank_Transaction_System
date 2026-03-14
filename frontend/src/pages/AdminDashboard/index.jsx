import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import AdminAccountTable from '../../components/AdminAccountTable';
import {
  fetchAllAccountsAdmin,
  updateAccountStatusAdmin,
} from '../../features/accounts/accountsSlice';
import { createSystemInitialFunding } from '../../features/transactions/transactionsSlice';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { adminAccounts, error } = useSelector((state) => state.accounts);
  const [fundingForm, setFundingForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchAllAccountsAdmin());
  }, [dispatch]);

  const users = useMemo(() => {
    const map = new Map();
    adminAccounts.forEach((account) => {
      const userId = account.user?._id;
      if (userId && !map.has(userId)) {
        map.set(userId, { name: account.user.name, email: account.user.email });
      }
    });
    return [...map.values()];
  }, [adminAccounts]);

  const handleStatusChange = async (accountId, status) => {
    try {
      await dispatch(updateAccountStatusAdmin({ accountId, status })).unwrap();
      setFeedback(`Account status updated to ${status}`);
    } catch (err) {
      setFeedback(err.message);
    }
  };

  const handleInitialFunding = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        createSystemInitialFunding({
          ...fundingForm,
          amount: Number(fundingForm.amount),
          idempotencyKey: `sys-${Date.now()}`,
        }),
      ).unwrap();
      setFeedback('Initial funding completed');
      setFundingForm({ fromAccount: '', toAccount: '', amount: '' });
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white">System Admin Dashboard</h1>
        <p className="text-sm text-slate-200">Manage all users, accounts, statuses and initial funding.</p>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <AdminAccountTable accounts={adminAccounts} onStatusChange={handleStatusChange} />
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h2 className="mb-3 text-lg font-semibold text-white">Users ({users.length})</h2>
            <ul className="space-y-2 text-sm text-slate-200">
              {users.map((user) => (
                <li key={user.email} className="rounded border border-white/15 p-2">
                  <p>{user.name}</p>
                  <p className="text-xs text-cyan-100">{user.email}</p>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <h2 className="mb-3 text-lg font-semibold text-white">System Initial Funding</h2>
            <form className="space-y-2" onSubmit={handleInitialFunding}>
              <input
                className="glass-input"
                placeholder="System fromAccount"
                value={fundingForm.fromAccount}
                onChange={(event) => setFundingForm((prev) => ({ ...prev, fromAccount: event.target.value }))}
                required
              />
              <input
                className="glass-input"
                placeholder="Target toAccount"
                value={fundingForm.toAccount}
                onChange={(event) => setFundingForm((prev) => ({ ...prev, toAccount: event.target.value }))}
                required
              />
              <input
                className="glass-input"
                type="number"
                min="1"
                placeholder="Amount"
                value={fundingForm.amount}
                onChange={(event) => setFundingForm((prev) => ({ ...prev, amount: event.target.value }))}
                required
              />
              <button className="primary-btn w-full">Fund Account</button>
            </form>
          </GlassCard>
        </div>
      </div>

      {feedback && <p className="text-sm text-cyan-100">{feedback}</p>}
      {error && <p className="text-sm text-rose-200">{error}</p>}
    </div>
  );
}
