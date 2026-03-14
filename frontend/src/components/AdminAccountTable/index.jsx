import GlassCard from '../GlassCard';

const statuses = ['active', 'Freeze', 'suspended'];

export default function AdminAccountTable({ accounts, onStatusChange }) {
  return (
    <GlassCard className="overflow-x-auto">
      <h3 className="mb-4 text-lg font-semibold text-white">All User Accounts</h3>
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead>
          <tr className="border-b border-white/15 text-xs uppercase text-slate-300">
            <th className="py-2 pr-4">User</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Account</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Balance</th>
            <th className="py-2 pr-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account._id} className="border-b border-white/10">
              <td className="py-2 pr-4">{account.user?.name || 'N/A'}</td>
              <td className="py-2 pr-4">{account.user?.email || account.email}</td>
              <td className="py-2 pr-4">{account._id.slice(-8)}</td>
              <td className="py-2 pr-4">{account.accountType}</td>
              <td className="py-2 pr-4">{account.status}</td>
              <td className="py-2 pr-4">N/A</td>
              <td className="py-2 pr-4">
                <div className="flex gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onStatusChange(account._id, status)}
                      className="rounded border border-white/25 px-2 py-1 text-xs hover:bg-white/10"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
