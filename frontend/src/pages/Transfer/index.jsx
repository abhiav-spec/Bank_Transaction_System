import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import TransferForm from '../../components/TransferForm';
import { fetchAccounts } from '../../features/accounts/accountsSlice';

export default function TransferPage() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white">Transfer Money</h1>
        <p className="text-sm text-slate-200">Send secure transfers using your transaction PIN.</p>
      </GlassCard>
      <TransferForm accounts={accounts} />
    </div>
  );
}
