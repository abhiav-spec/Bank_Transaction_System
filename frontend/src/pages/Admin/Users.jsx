import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import UsersTable from '../../components/admin/UsersTable';
import { fetchAllAccountsAdmin } from '../../features/accounts/accountsSlice';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { adminAccounts, loading, error } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchAllAccountsAdmin());
  }, [dispatch]);

  const users = useMemo(() => {
    const map = new Map();

    adminAccounts.forEach((account) => {
      const userId = account.user?._id;
      if (!userId) return;

      if (!map.has(userId)) {
        map.set(userId, {
          id: userId,
          name: account.user?.name || '-',
          email: account.user?.email || account.email || '-',
          accountCount: 1,
          createdDate: account.createdAt ? new Date(account.createdAt) : null,
        });
        return;
      }

      const existing = map.get(userId);
      existing.accountCount += 1;
      if (!existing.createdDate || (account.createdAt && new Date(account.createdAt) < existing.createdDate)) {
        existing.createdDate = new Date(account.createdAt);
      }
    });

    return [...map.values()]
      .map((user) => ({
        ...user,
        createdDateLabel: user.createdDate ? user.createdDate.toLocaleDateString() : '-',
      }))
      .sort((a, b) => b.accountCount - a.accountCount);
  }, [adminAccounts]);

  return (
    <GlassCard>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Users</h2>
        <p className="text-sm text-slate-700">Registered users derived from accounts data.</p>
      </div>

      <UsersTable users={users} />

      {loading && <p className="mt-3 text-sm text-slate-700">Loading users...</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </GlassCard>
  );
}
