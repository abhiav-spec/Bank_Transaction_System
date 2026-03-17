import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createTransaction } from '../../features/transactions/transactionsSlice';
import api from '../../services/api';

export default function TransferForm({ accounts }) {
  const dispatch = useDispatch();
  const selectedPaymentAccountId = useSelector((state) => state.accounts.selectedPaymentAccountId);
  const selectedAccount = accounts.find((account) => account._id === selectedPaymentAccountId);
  const [form, setForm] = useState({
    fromAccount: selectedPaymentAccountId || '',
    toAccountPhone: '',
    toAccount: '',
    amount: '',
    transactionPassword: '',
  });
  const [message, setMessage] = useState('');
  const [recipientAccounts, setRecipientAccounts] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [searching, setSearching] = useState(false);

  const idempotencyKey = useMemo(() => `txn-${Date.now()}`, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const searchRecipient = async () => {
    if (!form.toAccountPhone.trim()) {
      setMessage('Please enter a phone number');
      return;
    }

    setSearching(true);
    setMessage('');
    try {
      const response = await api.get('/api/accounts/search', {
        params: { phone: form.toAccountPhone }
      });
      
      if (response.data.status && response.data.data) {
        setRecipientAccounts(response.data.data);
        setSelectedRecipient(null);
        setForm((prev) => ({ ...prev, toAccount: '' }));
      }
    } catch (error) {
      setMessage(error.message || 'No accounts found with this phone number');
      setRecipientAccounts([]);
      setSelectedRecipient(null);
    } finally {
      setSearching(false);
    }
  };

  const selectRecipient = (account) => {
    setSelectedRecipient(account);
    setForm((prev) => ({ ...prev, toAccount: account._id }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPaymentAccountId) {
      setMessage('Please select a payment card from Dashboard first.');
      return;
    }
    if (!selectedRecipient) {
      setMessage('Please search and select a recipient account.');
      return;
    }
    try {
      await dispatch(createTransaction({ ...form, fromAccount: selectedPaymentAccountId, amount: Number(form.amount), idempotencyKey })).unwrap();
      setMessage('Transfer completed successfully.');
      setForm({ fromAccount: selectedPaymentAccountId, toAccountPhone: '', toAccount: '', amount: '', transactionPassword: '' });
      setSelectedRecipient(null);
      setRecipientAccounts([]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card space-y-4 p-5">
      <h3 className="text-lg font-semibold text-gray-800">Transfer Money</h3>

      <div className="rounded-xl border border-blue-300 bg-blue-100/40 backdrop-blur-sm px-3 py-2.5">
        <p className="text-xs font-medium text-blue-800">From (Selected payment card)</p>
        {selectedAccount ? (
          <p className="text-sm text-blue-900 mt-1">
            {selectedAccount.fullName} ({selectedAccount._id.slice(-6)})
          </p>
        ) : (
          <p className="text-sm text-blue-900 mt-1">
            No card selected.
            {' '}
            <Link to="/select-card" className="underline">Go to Select Card page</Link>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="tel"
            value={form.toAccountPhone}
            onChange={onChange}
            name="toAccountPhone"
            className="glass-input flex-1"
            placeholder="Recipient's phone number"
          />
          <button
            type="button"
            onClick={searchRecipient}
            disabled={searching || !form.toAccountPhone.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {recipientAccounts.length > 0 && (
          <div className="rounded-lg border border-slate-300 bg-white/50 backdrop-blur-sm p-3">
            <p className="text-xs font-medium text-slate-700 mb-2">Found {recipientAccounts.length} account(s):</p>
            <div className="space-y-2">
              {recipientAccounts.map((account) => (
                <div
                  key={account._id}
                  onClick={() => selectRecipient(account)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedRecipient?._id === account._id
                      ? 'bg-blue-200/40 border border-blue-400 shadow-sm'
                      : 'bg-white/30 border border-slate-300 hover:bg-white/50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{account.fullName}</p>
                  <p className="text-xs text-slate-700">{account.email}</p>
                  <p className="text-xs text-slate-600">Account: {account._id.slice(-6)} • {account.accountType}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedRecipient && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/40 backdrop-blur-sm px-3 py-2.5">
          <p className="text-xs font-medium text-emerald-800">To (Selected recipient)</p>
          <p className="text-sm text-emerald-900 mt-1">
            {selectedRecipient.fullName} ({selectedRecipient._id.slice(-6)})
          </p>
        </div>
      )}

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

      <button type="submit" disabled={!selectedRecipient} className="primary-btn w-full disabled:opacity-50 disabled:cursor-not-allowed">
        Send Money
      </button>

      {message && <p className={`text-sm ${message.includes('successfully') ? 'text-emerald-700' : 'text-red-700'}`}>{message}</p>}
    </form>
  );
}
