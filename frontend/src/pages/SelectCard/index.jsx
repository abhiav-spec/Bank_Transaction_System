import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountCard from '../../components/AccountCard';
import {
  fetchAccounts,
  fetchAccountBalance,
  setSelectedPaymentAccount,
} from '../../features/accounts/accountsSlice';

export default function SelectCardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);
  const balances = useSelector((state) => state.accounts.balances);
  const selectedPaymentAccountId = useSelector((state) => state.accounts.selectedPaymentAccountId);
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    accounts.forEach((account) => {
      if (balances[account._id] == null) dispatch(fetchAccountBalance(account._id));
    });
  }, [accounts, balances, dispatch]);

  useEffect(() => {
    if (!accounts.length) return;
    const selectedIdx = accounts.findIndex((account) => account._id === selectedPaymentAccountId);
    if (selectedIdx >= 0) {
      setPreviewIdx(selectedIdx);
      return;
    }
    setPreviewIdx(0);
  }, [accounts, selectedPaymentAccountId]);

  const activeAccount = accounts.find((account) => account._id === selectedPaymentAccountId);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-5">
        <h1 className="text-2xl font-bold text-gray-900">Select Card</h1>
        <p className="text-sm text-gray-600 mt-1">
          Tick one card. Only that card will be allowed for money transfer.
        </p>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-8 text-center">
          <p className="text-gray-500 text-sm">No accounts found. Create your first card to continue.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {accounts.map((account, idx) => (
              <button
                key={account._id}
                onClick={() => {
                  setPreviewIdx(idx);
                  dispatch(
                    setSelectedPaymentAccount(
                      selectedPaymentAccountId === account._id ? '' : account._id,
                    ),
                  );
                }}
                className="focus:outline-none relative"
              >
                <AccountCard
                  account={account}
                  balance={balances[account._id]}
                  active={idx === previewIdx}
                />

                <span
                  className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition ${
                    selectedPaymentAccountId === account._id
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white/90 border-gray-300 text-transparent'
                  }`}
                  aria-label={selectedPaymentAccountId === account._id ? 'Selected card' : 'Not selected'}
                >
                  ✓
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-5">
            <div>
              <p className="text-xs text-gray-500">Currently selected card for transfer</p>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {activeAccount ? `${activeAccount.fullName} (${activeAccount._id.slice(-6)})` : 'None'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
