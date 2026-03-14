import GlassCard from '../GlassCard';

export default function TransactionTable({ transactions }) {
  return (
    <GlassCard className="overflow-x-auto">
      <h3 className="mb-4 text-lg font-semibold text-white">Transaction History</h3>
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead>
          <tr className="border-b border-white/15 text-xs uppercase text-slate-300">
            <th className="py-2 pr-4">From</th>
            <th className="py-2 pr-4">To</th>
            <th className="py-2 pr-4">Amount</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id} className="border-b border-white/10">
              <td className="py-2 pr-4">{String(txn.fromAccount).slice(-6)}</td>
              <td className="py-2 pr-4">{String(txn.toAccount).slice(-6)}</td>
              <td className="py-2 pr-4">{txn.amount}</td>
              <td className="py-2 pr-4">{txn.status}</td>
              <td className="py-2 pr-4">{new Date(txn.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
