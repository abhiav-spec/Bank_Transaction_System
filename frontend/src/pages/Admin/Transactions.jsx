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
        <h2 className="text-lg font-semibold text-white">Transactions</h2>
        <p className="text-sm text-slate-300">System-wide transaction logs.</p>
      </div>

      <TransactionsTable transactions={adminList} />

      {adminLoading && <p className="mt-3 text-sm text-cyan-100">Loading transactions...</p>}
      {adminError && <p className="mt-3 text-sm text-rose-200">{adminError}</p>}
    </GlassCard>
  );
}
