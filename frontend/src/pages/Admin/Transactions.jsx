import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import TransactionsTable from '../../components/admin/TransactionsTable';
import { fetchSystemTransactions } from '../../features/transactions/transactionsSlice';

export default function AdminTransactionsPage() {
  const dispatch = useDispatch();
  const { adminList, adminLoading, adminError } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchSystemTransactions());
  }, [dispatch]);

  return (
    <GlassCard>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
        <p className="text-sm text-slate-700">System-wide transaction logs.</p>
      </div>

      <TransactionsTable transactions={adminList} />

      {adminLoading && <p className="mt-3 text-sm text-slate-700">Loading transactions...</p>}
      {adminError && <p className="mt-3 text-sm text-red-700">{adminError}</p>}
    </GlassCard>
  );
}
