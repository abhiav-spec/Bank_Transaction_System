import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import TransactionTable from '../../components/TransactionTable';
import { fetchTransactions } from '../../features/transactions/transactionsSlice';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.list);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <p className="text-sm text-slate-200">Complete transfer history across your accounts.</p>
      </GlassCard>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
