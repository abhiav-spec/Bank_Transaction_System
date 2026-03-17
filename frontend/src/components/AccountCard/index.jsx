/* VISA-style bank card component */
export default function AccountCard({ account, balance, active = false }) {
  return (
    <div
      className={`relative rounded-2xl p-5 min-w-[220px] max-w-[280px] w-full select-none shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        active
          ? 'bg-gradient-to-br from-[#c5e86b] to-[#8fd14f] text-gray-900'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {/* Card chip + VISA */}
      <div className="flex items-start justify-between mb-4">
        {/* Chip */}
        <div className={`w-8 h-6 rounded-md ${
          active ? 'bg-yellow-500/70' : 'bg-gray-300'
        }`} />
        <span className={`text-sm font-black tracking-wider ${
          active ? 'text-gray-800' : 'text-gray-400'
        }`}>
          VISA
        </span>
      </div>

      {/* Balance */}
      <p className={`text-xs mb-0.5 font-medium ${
        active ? 'text-gray-700' : 'text-gray-400'
      }`}>
        Balance
      </p>
      <p className="text-xl font-bold tracking-tight mb-4">
        {typeof balance === 'number'
          ? `${account.currency} ${balance.toLocaleString()}`
          : '— —'}
      </p>

      {/* Account holder */}
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-[10px] uppercase tracking-widest mb-0.5 ${
            active ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {account.accountType}
          </p>
          <p className="text-sm font-semibold truncate max-w-[150px]">{account.fullName}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            active
              ? 'bg-black/10 text-gray-700'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {account.status}
        </span>
      </div>

      {/* Last 6 of ID */}
      <p className={`mt-2 text-[10px] font-mono ${
        active ? 'text-gray-600' : 'text-gray-400'
      }`}>
        •••• •••• {account._id.slice(-4)}
      </p>
    </div>
  );
}
