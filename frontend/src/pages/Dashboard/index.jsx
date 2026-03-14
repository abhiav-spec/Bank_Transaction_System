import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import AccountCard from '../../components/AccountCard';
import TransactionTable from '../../components/TransactionTable';
import ThreeBackground from '../../components/ThreeBackground';
import { fetchAccounts, fetchAccountBalance } from '../../features/accounts/accountsSlice';
import { fetchTransactions } from '../../features/transactions/transactionsSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);
  const balances = useSelector((state) => state.accounts.balances);
  const transactions = useSelector((state) => state.transactions.list);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    accounts.forEach((account) => {
      if (balances[account._id] == null) dispatch(fetchAccountBalance(account._id));
    });
  }, [accounts, balances, dispatch]);

  return (
    <div className="relative space-y-4">
      <ThreeBackground />
      <GlassCard className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Banking Dashboard</h1>
          <p className="text-sm text-slate-200">Track balances, transfers and account activity.</p>
        </div>
        <Link to="/transfer" className="primary-btn">Quick Transfer</Link>
      </GlassCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {accounts.slice(0, 3).map((account) => (
          <AccountCard key={account._id} account={account} balance={balances[account._id]} />
        ))}
      </section>

      <TransactionTable transactions={transactions.slice(0, 8)} />
    </div>
  );
}
