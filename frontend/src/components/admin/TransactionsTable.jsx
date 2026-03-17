export default function TransactionsTable({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-700">
        <thead>
          <tr className="border-b border-slate-300 text-xs uppercase text-slate-700">
            <th className="px-3 py-3">Transaction ID</th>
            <th className="px-3 py-3">From Account</th>
            <th className="px-3 py-3">To Account</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-b border-slate-200">
              <td className="px-3 py-3 font-mono text-xs text-slate-800">{transaction._id}</td>
              <td className="px-3 py-3 font-mono text-xs">{String(transaction.fromAccount || '-')}</td>
              <td className="px-3 py-3 font-mono text-xs">{String(transaction.toAccount || '-')}</td>
              <td className="px-3 py-3">{transaction.amount ?? '-'}</td>
              <td className="px-3 py-3 capitalize">{transaction.status || '-'}</td>
              <td className="px-3 py-3">{new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {!transactions.length && (
            <tr>
              <td className="px-3 py-8 text-center text-slate-500" colSpan={6}>
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
