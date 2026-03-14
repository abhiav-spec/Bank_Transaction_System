import GlassCard from '../GlassCard';

export default function AccountCard({ account, balance }) {
  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{account.fullName}</h3>
        <span className="rounded-full border border-white/20 px-2 py-1 text-xs text-cyan-100">{account.status}</span>
      </div>
      <p className="text-sm text-slate-200">{account.email}</p>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
        <p>Aadhaar: {account.aadhaarNumber}</p>
        <p>Type: {account.accountType}</p>
        <p>Currency: {account.currency}</p>
        <p>ID: {account._id.slice(-6)}</p>
      </div>
      <p className="text-xl font-bold text-emerald-300">
        Balance: {typeof balance === 'number' ? `${account.currency} ${balance}` : 'Loading...'}
      </p>
    </GlassCard>
  );
}
