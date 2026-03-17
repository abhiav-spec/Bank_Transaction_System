import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountCard from '../../components/AccountCard';
import GlassCard from '../../components/GlassCard';
import { fetchAccountBalance, fetchAccounts } from '../../features/accounts/accountsSlice';

export default function AccountsPage() {
  const dispatch = useDispatch();
  const { list, balances } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    list.forEach((account) => {
      if (balances[account._id] == null) dispatch(fetchAccountBalance(account._id));
    });
  }, [dispatch, list, balances]);

  return (
    <div className="space-y-4">
      <GlassCard className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500">Manage your linked accounts and balances.</p>
        </div>
        <Link to="/accounts/create" className="primary-btn">
          Create Account
        </Link>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((account, idx) => (
          <AccountCard key={account._id} account={account} balance={balances[account._id]} active={idx === 0} />
        ))}
      </div>
    </div>
  );
}
