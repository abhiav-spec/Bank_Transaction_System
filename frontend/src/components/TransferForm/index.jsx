import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createTransaction } from '../../features/transactions/transactionsSlice';

export default function TransferForm({ accounts }) {
  const dispatch = useDispatch();
  const selectedPaymentAccountId = useSelector((state) => state.accounts.selectedPaymentAccountId);
  const selectedAccount = accounts.find((account) => account._id === selectedPaymentAccountId);
  const [form, setForm] = useState({
    fromAccount: selectedPaymentAccountId || '',
    toAccount: '',
    amount: '',
    transactionPassword: '',
  });
  const [message, setMessage] = useState('');

  const idempotencyKey = useMemo(() => `txn-${Date.now()}`, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPaymentAccountId) {
      setMessage('Please select a payment card from Dashboard first.');
      return;
    }
    try {
      await dispatch(createTransaction({ ...form, fromAccount: selectedPaymentAccountId, amount: Number(form.amount), idempotencyKey })).unwrap();
      setMessage('Transfer completed successfully.');
      setForm({ fromAccount: selectedPaymentAccountId, toAccount: '', amount: '', transactionPassword: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-5">
      <h3 className="text-lg font-semibold text-gray-800">Transfer Money</h3>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5">
        <p className="text-xs font-medium text-indigo-700">Selected payment card</p>
        {selectedAccount ? (
          <p className="text-sm text-indigo-900 mt-1">
            {selectedAccount.fullName} ({selectedAccount._id.slice(-6)})
          </p>
        ) : (
          <p className="text-sm text-indigo-900 mt-1">
            No card selected.
            {' '}
            <Link to="/select-card" className="underline">Go to Select Card page</Link>
          </p>
        )}
      </div>

      <input
        required
        name="toAccount"
        value={form.toAccount}
        onChange={onChange}
        className="glass-input"
        placeholder="Receiver account ID"
      />

      <input
        required
        type="number"
        min="1"
        name="amount"
        value={form.amount}
        onChange={onChange}
        className="glass-input"
        placeholder="Amount"
      />

      <input
        required
        type="password"
        name="transactionPassword"
        value={form.transactionPassword}
        onChange={onChange}
        className="glass-input"
        placeholder="Transaction PIN"
      />

      <button type="submit" className="primary-btn w-full">
        Send Money
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
