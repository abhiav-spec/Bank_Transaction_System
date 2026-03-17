import { jsPDF } from 'jspdf';
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

function buildReceiptPdf(txn) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const issuedAt = new Date().toLocaleString();
  const txnDate = txn?.createdAt ? new Date(txn.createdAt).toLocaleString() : 'N/A';
  const amount = Number(txn?.amount || 0).toLocaleString('en-IN');
  const fromAccount = String(txn?.fromAccount || 'N/A');
  const toAccount = String(txn?.toAccount || 'N/A');
  const status = txn?.status || 'unknown';

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 595, 110, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('NEXA Bank', 40, 48);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Transaction Receipt', 40, 72);

  pdf.setTextColor(31, 41, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Receipt Summary', 40, 150);

  const rows = [
    ['Receipt Generated', issuedAt],
    ['Transaction ID', String(txn?._id || 'N/A')],
    ['Transaction Date', txnDate],
    ['From Account', fromAccount],
    ['To Account', toAccount],
    ['Amount', `${txn?.currency || 'INR'} ${amount}`],
    ['Status', status],
  ];

  let y = 190;
  rows.forEach(([label, value], index) => {
    const isEven = index % 2 === 0;
    pdf.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    pdf.roundedRect(40, y - 20, 515, 34, 6, 6, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(label, 56, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(value), 220, y);
    y += 44;
  });

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('This receipt was generated from the NEXA Bank dashboard.', 40, y + 24);

  return pdf;
}

function downloadReceipt(txn) {
  const pdf = buildReceiptPdf(txn);
  pdf.save(`nexa-bank-receipt-${String(txn?._id || 'transaction').slice(-6)}.pdf`);
}

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
            <th className="pb-3 font-medium text-right">Receipt</th>
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
                <td className="py-3 text-right">
                  <button
                    type="button"
                    onClick={() => downloadReceipt(txn)}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Download Receipt
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GlassCard>
  );
}
