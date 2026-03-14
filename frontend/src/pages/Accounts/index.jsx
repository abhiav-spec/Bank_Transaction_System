import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountCard from '../../components/AccountCard';
import GlassCard from '../../components/GlassCard';
import { createAccount, fetchAccountBalance, fetchAccounts } from '../../features/accounts/accountsSlice';

const initialForm = {
  personalDetails: { fullName: '', email: '', nationality: '' },
  identityDetails: { aadhaarNumber: '' },
  accountDetails: { currency: 'INR', accountType: 'savings' },
  confirmation: { isConfirmed: false },
};

export default function AccountsPage() {
  const dispatch = useDispatch();
  const { list, balances, loading, error, successMessage } = useSelector((state) => state.accounts);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    list.forEach((account) => {
      if (balances[account._id] == null) dispatch(fetchAccountBalance(account._id));
    });
  }, [dispatch, list, balances]);

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return form.personalDetails.fullName && form.personalDetails.email && form.personalDetails.nationality;
    }
    if (step === 2) return form.identityDetails.aadhaarNumber;
    if (step === 3) return form.accountDetails.accountType;
    return true;
  }, [form, step]);

  const submitKyc = async (event) => {
    event.preventDefault();
    await dispatch(createAccount(form));
    setForm(initialForm);
    setStep(1);
    dispatch(fetchAccounts());
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="text-2xl font-bold text-white">Accounts</h1>
        <p className="text-sm text-slate-200">Create and manage your KYC-linked accounts.</p>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Create Account (4-step KYC)</h2>
          <form className="space-y-3" onSubmit={submitKyc}>
            {step === 1 && (
              <>
                <input
                  className="glass-input"
                  placeholder="Full name"
                  value={form.personalDetails.fullName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, fullName: event.target.value },
                    }))
                  }
                />
                <input
                  className="glass-input"
                  placeholder="Email"
                  type="email"
                  value={form.personalDetails.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, email: event.target.value },
                    }))
                  }
                />
                <input
                  className="glass-input"
                  placeholder="Nationality"
                  value={form.personalDetails.nationality}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      personalDetails: { ...prev.personalDetails, nationality: event.target.value },
                    }))
                  }
                />
              </>
            )}

            {step === 2 && (
              <input
                className="glass-input"
                placeholder="Aadhaar Number"
                value={form.identityDetails.aadhaarNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    identityDetails: { aadhaarNumber: event.target.value },
                  }))
                }
              />
            )}

            {step === 3 && (
              <>
                <input
                  className="glass-input"
                  placeholder="Currency"
                  value={form.accountDetails.currency}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      accountDetails: { ...prev.accountDetails, currency: event.target.value.toUpperCase() },
                    }))
                  }
                />
                <select
                  className="glass-input"
                  value={form.accountDetails.accountType}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      accountDetails: { ...prev.accountDetails, accountType: event.target.value },
                    }))
                  }
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </>
            )}

            {step === 4 && (
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.confirmation.isConfirmed}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmation: { isConfirmed: event.target.checked },
                    }))
                  }
                />
                I confirm all details are correct.
              </label>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <button type="button" className="secondary-btn" onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
              )}

              {step < 4 ? (
                <button type="button" className="primary-btn" disabled={!canGoNext} onClick={() => setStep((s) => s + 1)}>
                  Next
                </button>
              ) : (
                <button className="primary-btn" disabled={loading || !form.confirmation.isConfirmed}>
                  {loading ? 'Submitting...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          {successMessage && <p className="mt-2 text-sm text-emerald-200">{successMessage}</p>}
          {error && <p className="mt-2 text-sm text-rose-200">{error}</p>}
        </GlassCard>

        <div className="space-y-3">
          {list.map((account) => (
            <AccountCard key={account._id} account={account} balance={balances[account._id]} />
          ))}
        </div>
      </div>
    </div>
  );
}
