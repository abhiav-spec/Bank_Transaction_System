const actions = [
  { value: 'active', label: 'Activate' },
  { value: 'Freeze', label: 'Freeze' },
  { value: 'suspended', label: 'Suspend' },
];

export default function AccountsTable({ accounts, onStatusChange, showActions = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead>
          <tr className="border-b border-white/15 text-xs uppercase text-slate-300">
            <th className="px-3 py-3">Account ID</th>
            <th className="px-3 py-3">User Email</th>
            <th className="px-3 py-3">Balance</th>
            <th className="px-3 py-3">Account Type</th>
            <th className="px-3 py-3">Status</th>
            {showActions && <th className="px-3 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account._id} className="border-b border-white/10">
              <td className="px-3 py-3 font-mono text-xs text-cyan-100">{account._id}</td>
              <td className="px-3 py-3">{account.user?.email || account.email || '-'}</td>
              <td className="px-3 py-3">N/A</td>
              <td className="px-3 py-3 capitalize">{account.accountType || '-'}</td>
              <td className="px-3 py-3 capitalize">{account.status || '-'}</td>
              {showActions && (
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.value}
                        type="button"
                        onClick={() => onStatusChange(account._id, action.value)}
                        className="rounded border border-white/20 px-2 py-1 text-xs text-slate-100 transition hover:bg-white/10"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {!accounts.length && (
            <tr>
              <td className="px-3 py-8 text-center text-slate-300" colSpan={showActions ? 6 : 5}>
                No accounts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
