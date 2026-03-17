import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GlassCard from '../../components/GlassCard';
import { createAccount, fetchAccounts } from '../../features/accounts/accountsSlice';

const FULL_NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const PHONE_REGEX = /^(?:\+91)?[6-9]\d{9}$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;

const OPERATIONAL_COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Germany',
  'France',
  'Japan',
];

const initialForm = {
  personalDetails: { fullName: '', email: '', nationality: '' },
  identityDetails: { aadhaarNumber: '', phoneNumber: '' },
  accountDetails: { currency: 'INR', accountType: 'savings' },
  confirmation: { isConfirmed: false },
};

export default function CreateAccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.accounts);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);

  const fullNameValid = FULL_NAME_REGEX.test(form.personalDetails.fullName.trim());
  const emailValid = EMAIL_REGEX.test(form.personalDetails.email.trim());
  const nationalityValid = OPERATIONAL_COUNTRIES.includes(form.personalDetails.nationality);
  const aadhaarValid = AADHAAR_REGEX.test(form.identityDetails.aadhaarNumber.trim());
  const phoneValid = PHONE_REGEX.test(form.identityDetails.phoneNumber.trim());
  const currencyValid = CURRENCY_REGEX.test(form.accountDetails.currency.trim());

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return fullNameValid && emailValid && nationalityValid;
    }
    if (step === 2) return aadhaarValid && phoneValid;
    if (step === 3) return currencyValid && form.accountDetails.accountType;
    return true;
  }, [step, fullNameValid, emailValid, nationalityValid, aadhaarValid, phoneValid, currencyValid]);

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
              {form.personalDetails.fullName && !fullNameValid && (
                <p className="text-xs text-red-600">Enter a valid full name (letters and spaces only, min 2 chars).</p>
              )}
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
              {form.personalDetails.email && !emailValid && (
                <p className="text-xs text-red-600">Enter a valid email address (example: user@example.com).</p>
              )}
              <select
                className="glass-input"
                value={form.personalDetails.nationality}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    personalDetails: { ...prev.personalDetails, nationality: event.target.value },
                  }))
                }
              >
                <option value="">Select Nationality (Operational Countries)</option>
                {OPERATIONAL_COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {!nationalityValid && form.personalDetails.nationality && (
                <p className="text-xs text-red-600">Select a supported country from the list.</p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <input
                className="glass-input"
                placeholder="Aadhaar Number"
                inputMode="numeric"
                maxLength={12}
                value={form.identityDetails.aadhaarNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    identityDetails: { ...prev.identityDetails, aadhaarNumber: event.target.value.replace(/\D/g, '') },
                  }))
                }
              />
              {form.identityDetails.aadhaarNumber && !aadhaarValid && (
                <p className="text-xs text-red-600">Aadhaar must be exactly 12 digits.</p>
              )}
              <input
                className="glass-input"
                type="tel"
                placeholder="Phone Number (e.g. 9876543210 or +919876543210)"
                value={form.identityDetails.phoneNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    identityDetails: { ...prev.identityDetails, phoneNumber: event.target.value.replace(/\s+/g, '') },
                  }))
                }
              />
              {form.identityDetails.phoneNumber && !phoneValid && (
                <p className="text-xs text-red-600">Enter a valid Indian mobile number.</p>
              )}
            </>
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
              {form.accountDetails.currency && !currencyValid && (
                <p className="text-xs text-red-600">Currency must be a 3-letter ISO code (e.g. INR).</p>
              )}
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
