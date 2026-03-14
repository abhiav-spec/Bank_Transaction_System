import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import FundingForm from '../../components/admin/FundingForm';
import { fetchAccounts, fetchAllAccountsAdmin } from '../../features/accounts/accountsSlice';
import { clearTransactionMessages, createSystemInitialFunding } from '../../features/transactions/transactionsSlice';

export default function SystemFundingPage() {
  const dispatch = useDispatch();
  const { list, adminAccounts } = useSelector((state) => state.accounts);
  const { loading, error, successMessage } = useSelector((state) => state.transactions);
  const [localFeedback, setLocalFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchAllAccountsAdmin());
    return () => {
      dispatch(clearTransactionMessages());
    };
  }, [dispatch]);

  const systemAccounts = useMemo(() => list || [], [list]);

  const handleFunding = async (payload) => {
    try {
      await dispatch(createSystemInitialFunding(payload)).unwrap();
      setLocalFeedback('System funding completed successfully.');
      dispatch(fetchAccounts());
      dispatch(fetchAllAccountsAdmin());
    } catch (err) {
      setLocalFeedback(err.message);
    }
  };

  return (
    <GlassCard className="max-w-3xl">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">System Funding</h2>
        <p className="text-sm text-slate-300">Send funds from bank system account to any user account.</p>
      </div>

      <FundingForm fromAccounts={systemAccounts} toAccounts={adminAccounts} onSubmit={handleFunding} loading={loading} />

      {successMessage && <p className="mt-3 text-sm text-emerald-200">{successMessage}</p>}
      {localFeedback && <p className="mt-3 text-sm text-cyan-100">{localFeedback}</p>}
      {error && <p className="mt-3 text-sm text-rose-200">{error}</p>}
    </GlassCard>
  );
}
