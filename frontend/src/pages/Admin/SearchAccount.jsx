import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import SearchBar from '../../components/admin/SearchBar';
import AccountsTable from '../../components/admin/AccountsTable';
import { fetchAllAccountsAdmin, updateAccountStatusAdmin } from '../../features/accounts/accountsSlice';

export default function SearchAccountPage() {
  const dispatch = useDispatch();
  const { adminAccounts, loading, error } = useSelector((state) => state.accounts);
  const [searchBy, setSearchBy] = useState('accountId');
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchAllAccountsAdmin());
  }, [dispatch]);

  const filteredAccounts = useMemo(() => {
    if (!query.trim()) return adminAccounts;
    const key = query.toLowerCase().trim();

    if (searchBy === 'accountId') {
      return adminAccounts.filter((account) => account._id.toLowerCase().includes(key));
    }

    if (searchBy === 'email') {
      return adminAccounts.filter((account) => (account.user?.email || account.email || '').toLowerCase().includes(key));
    }

    return adminAccounts.filter((account) => String(account.aadhaarNumber || '').includes(query.trim()));
  }, [adminAccounts, query, searchBy]);

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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Search Account</h2>
        <p className="text-sm text-slate-300">Search by Account ID, User Email, or Aadhaar Number.</p>
      </div>

      <SearchBar searchBy={searchBy} query={query} onSearchByChange={setSearchBy} onQueryChange={setQuery} />

      <div className="mt-4">
        <AccountsTable accounts={filteredAccounts} onStatusChange={onStatusChange} showActions />
      </div>

      {loading && <p className="mt-3 text-sm text-cyan-100">Loading accounts...</p>}
      {feedback && <p className="mt-3 text-sm text-cyan-100">{feedback}</p>}
      {error && <p className="mt-3 text-sm text-rose-200">{error}</p>}
    </GlassCard>
  );
}
