import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../../features/transactions/transactionsSlice';

export default function TransferForm({ accounts }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fromAccount: '',
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
    try {
      await dispatch(createTransaction({ ...form, amount: Number(form.amount), idempotencyKey })).unwrap();
      setMessage('Transfer completed successfully.');
      setForm({ fromAccount: '', toAccount: '', amount: '', transactionPassword: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-5">
      <h3 className="text-lg font-semibold">Transfer Money</h3>

      <select
        required
        name="fromAccount"
        value={form.fromAccount}
        onChange={onChange}
        className="glass-input"
      >
        <option value="">Select from account</option>
        {accounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account.fullName} ({account._id.slice(-6)})
          </option>
        ))}
      </select>

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

      {message && <p className="text-sm text-cyan-100">{message}</p>}
    </form>
  );
}
