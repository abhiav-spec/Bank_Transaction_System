import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import StatsCard from '../../components/admin/StatsCard';
import AccountsTable from '../../components/admin/AccountsTable';
import { fetchAllAccountsAdmin, updateAccountStatusAdmin } from '../../features/accounts/accountsSlice';
import { fetchSystemTransactions } from '../../features/transactions/transactionsSlice';

export default function AdminOverviewPage() {
  const dispatch = useDispatch();
  const { adminAccounts, loading, error } = useSelector((state) => state.accounts);
  const { adminList } = useSelector((state) => state.transactions);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchAllAccountsAdmin());
    dispatch(fetchSystemTransactions());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalAccounts = adminAccounts.length;
    const totalUsers = new Set(adminAccounts.map((account) => account.user?._id).filter(Boolean)).size;
    const totalTransactions = adminList.length;
    const active = adminAccounts.filter((account) => account.status === 'active').length;
    const frozen = adminAccounts.filter((account) => account.status === 'Freeze').length;
    const suspended = adminAccounts.filter((account) => account.status === 'suspended').length;

    return { totalUsers, totalAccounts, totalTransactions, active, frozen, suspended };
  }, [adminAccounts, adminList]);

  const handleStatusChange = async (accountId, status) => {
    try {
      await dispatch(updateAccountStatusAdmin({ accountId, status })).unwrap();
      setFeedback(`Account status updated to ${status}`);
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Total Accounts" value={stats.totalAccounts} />
        <StatsCard title="Total Transactions" value={stats.totalTransactions} />
        <StatsCard title="Active Accounts" value={stats.active} accent="text-emerald-200" />
        <StatsCard title="Frozen Accounts" value={stats.frozen} accent="text-amber-200" />
        <StatsCard title="Suspended Accounts" value={stats.suspended} accent="text-rose-200" />
      </div>

      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Accounts</h2>
          {loading && <span className="text-xs text-cyan-100">Loading...</span>}
        </div>
        <AccountsTable accounts={adminAccounts.slice(0, 10)} onStatusChange={handleStatusChange} showActions />
      </GlassCard>

      {feedback && <p className="text-sm text-cyan-100">{feedback}</p>}
      {error && <p className="text-sm text-rose-200">{error}</p>}
    </div>
  );
}
