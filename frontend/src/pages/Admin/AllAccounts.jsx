import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import AccountsTable from '../../components/admin/AccountsTable';
import { fetchAllAccountsAdmin, updateAccountStatusAdmin } from '../../features/accounts/accountsSlice';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Frozen', value: 'Freeze' },
  { label: 'Suspended', value: 'suspended' },
];

export default function AllAccountsPage() {
  const dispatch = useDispatch();
  const { adminAccounts, loading, error } = useSelector((state) => state.accounts);
  const [activeFilter, setActiveFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchAllAccountsAdmin());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return adminAccounts;
    return adminAccounts.filter((account) => account.status === activeFilter);
  }, [adminAccounts, activeFilter]);

  const onStatusChange = async (accountId, status) => {
    try {
      await dispatch(updateAccountStatusAdmin({ accountId, status })).unwrap();
      setFeedback(`Account status updated to ${status}`);
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <GlassCard>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">All Accounts</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                activeFilter === filter.value
                  ? 'border-blue-300 bg-blue-200/40 text-slate-900'
                  : 'border-slate-300 text-slate-700 hover:bg-white/60'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <AccountsTable accounts={filtered} onStatusChange={onStatusChange} showActions />

      {loading && <p className="mt-3 text-sm text-slate-700">Loading accounts...</p>}
      {feedback && <p className="mt-3 text-sm text-emerald-700">{feedback}</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </GlassCard>
  );
}
