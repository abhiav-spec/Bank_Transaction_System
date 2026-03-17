import GlassCard from '../GlassCard';

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-700',
};

const TxnIcon = ({ type }) => {
  const isCredit = type === 'credit';
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
      isCredit ? 'bg-green-100' : 'bg-orange-100'
    }`}>
      <svg className={`w-4 h-4 ${ isCredit ? 'text-green-600' : 'text-orange-500' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {isCredit
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />}
      </svg>
    </div>
  );
};

export default function TransactionTable({ transactions }) {
  if (!transactions.length) {
    return (
      <GlassCard>
        <h3 className="mb-3 text-base font-semibold text-gray-800">Transaction History</h3>
        <p className="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Transaction History</h3>
      </div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
            <th className="pb-3 pr-4 font-medium">Description</th>
            <th className="pb-3 pr-4 font-medium">From → To</th>
            <th className="pb-3 pr-4 font-medium">Amount</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((txn) => {
            const color = statusColors[txn.status] ?? 'bg-gray-100 text-gray-600';
            return (
              <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <TxnIcon type="debit" />
                    <span className="font-medium text-gray-700">Transfer</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-500 font-mono text-xs">
                  {String(txn.fromAccount).slice(-6)} → {String(txn.toAccount).slice(-6)}
                </td>
                <td className="py-3 pr-4 font-semibold text-gray-800">
                  {Number(txn.amount).toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="py-3 text-gray-400 text-xs">
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GlassCard>
  );
}
