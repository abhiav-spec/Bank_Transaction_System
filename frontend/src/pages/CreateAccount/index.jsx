import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import { createAccount, fetchAccounts } from '../../features/accounts/accountsSlice';

const initialForm = {
  personalDetails: { fullName: '', email: '', nationality: '' },
  identityDetails: { aadhaarNumber: '' },
  accountDetails: { currency: 'INR', accountType: 'savings' },
  confirmation: { isConfirmed: false },
};

export default function CreateAccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.accounts);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

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
    const resultAction = await dispatch(createAccount(form));
    if (createAccount.fulfilled.match(resultAction)) {
      setForm(initialForm);
      setStep(1);
      await dispatch(fetchAccounts());
      navigate('/accounts');
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500">Complete KYC in 4 steps to open your account.</p>
        </div>
        <Link to="/accounts" className="secondary-btn">
          Back to Accounts
        </Link>
      </GlassCard>

      <GlassCard>
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1,2,3,4].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${
              s <= step ? 'bg-gray-900' : 'bg-gray-200'
            }`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">Step {step}/4</span>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">KYC Verification</h2>
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
            <label className="flex items-center gap-2 text-sm text-gray-700">
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

        {successMessage && <p className="mt-2 text-sm text-emerald-600">{successMessage}</p>}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </GlassCard>
    </div>
  );
}
