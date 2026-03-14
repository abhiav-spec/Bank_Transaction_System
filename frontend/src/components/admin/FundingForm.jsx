import { useEffect, useMemo, useState } from 'react';

const initialForm = {
  fromAccount: '',
  toAccount: '',
  amount: '',
  idempotencyKey: `sys-${Date.now()}`,
};

export default function FundingForm({ fromAccounts, toAccounts, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);

  const toAccountOptions = useMemo(
    () => toAccounts.filter((account) => account._id !== form.fromAccount),
    [toAccounts, form.fromAccount],
  );

  useEffect(() => {
    if (!form.fromAccount && fromAccounts.length) {
      setForm((prev) => ({ ...prev, fromAccount: fromAccounts[0]._id }));
    }
  }, [form.fromAccount, fromAccounts]);

  useEffect(() => {
    if (!toAccountOptions.length) {
      setForm((prev) => ({ ...prev, toAccount: '' }));
      return;
    }

    const stillValid = toAccountOptions.some((account) => account._id === form.toAccount);
    if (!stillValid) {
      setForm((prev) => ({ ...prev, toAccount: toAccountOptions[0]._id }));
    }
  }, [form.toAccount, toAccountOptions]);

  const submitHandler = (event) => {
    event.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  const hasFromAccounts = fromAccounts.length > 0;
  const hasToAccounts = toAccountOptions.length > 0;

  return (
    <form className="space-y-3" onSubmit={submitHandler}>
      <select
        className="glass-input"
        value={form.fromAccount}
        onChange={(event) => setForm((prev) => ({ ...prev, fromAccount: event.target.value }))}
        disabled={!hasFromAccounts}
        required
      >
        <option value="">{hasFromAccounts ? 'From Account (system account)' : 'No system account found'}</option>
        {fromAccounts.map((account) => (
          <option key={account._id} value={account._id}>
            {account._id} ({account.accountType})
          </option>
        ))}
      </select>

      <select
        className="glass-input"
        value={form.toAccount}
        onChange={(event) => setForm((prev) => ({ ...prev, toAccount: event.target.value }))}
        disabled={!hasToAccounts}
        required
      >
        <option value="">{hasToAccounts ? 'To Account' : 'No receiver account available'}</option>
        {toAccountOptions.map((account) => (
          <option key={account._id} value={account._id}>
            {account.user?.email || account.email || 'Unknown'} - {account._id}
          </option>
        ))}
      </select>

      <input
        className="glass-input"
        type="number"
        min="1"
        placeholder="Amount"
        value={form.amount}
        onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
        required
      />

      <input
        className="glass-input"
        placeholder="Idempotency Key"
        value={form.idempotencyKey}
        onChange={(event) => setForm((prev) => ({ ...prev, idempotencyKey: event.target.value }))}
        required
      />

      <div className="flex gap-2">
        <button type="button" className="secondary-btn w-1/2" onClick={() => setForm((prev) => ({ ...prev, idempotencyKey: `sys-${Date.now()}` }))}>
          Regenerate Key
        </button>
        <button className="primary-btn w-1/2" disabled={loading || !hasFromAccounts || !hasToAccounts}>
          {loading ? 'Funding...' : 'Send Funds'}
        </button>
      </div>

      {!hasFromAccounts && <p className="text-xs text-rose-200">No system account found for this admin user.</p>}
      {!hasToAccounts && <p className="text-xs text-amber-200">Create another user account to send funding.</p>}
    </form>
  );
}
