import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountCard from '../../components/AccountCard';
import { fetchAccounts, fetchAccountBalance } from '../../features/accounts/accountsSlice';
import { fetchTransactions } from '../../features/transactions/transactionsSlice';

/* ── Card Management items ─────────────────────────── */
const mgmtItems = [
  {
    label: 'Card Details',
    desc: 'View full card information',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20" />
      </svg>
    ),
    to: '/accounts',
  },
  {
    label: 'Download Statement',
    desc: 'Export transaction history',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </svg>
    ),
    to: '/transactions',
  },
  {
    label: 'Change PIN',
    desc: 'Update your transaction PIN',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    to: '/profile',
  },
  {
    label: 'Select Card',
    desc: 'Choose card to use for payments',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.93 4.93l14.14 14.14" />
      </svg>
    ),
    to: '/select-card',
  },
];

/* ── Transaction status icons ───────────────────────── */
const TxnAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.list);
  const balances = useSelector((state) => state.accounts.balances);
  const selectedPaymentAccountId = useSelector((state) => state.accounts.selectedPaymentAccountId);
  const transactions = useSelector((state) => state.transactions.list);

  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    accounts.forEach((account) => {
      if (balances[account._id] == null) dispatch(fetchAccountBalance(account._id));
    });
  }, [accounts, balances, dispatch]);

  const filteredAccounts = accounts.filter((account) => {
    if (activeTab === 'credit') return true;
    if (activeTab === 'selected') return account._id === selectedPaymentAccountId;
    return true;
  });

  useEffect(() => {
    if (activeCardIdx >= filteredAccounts.length) {
      setActiveCardIdx(0);
    }
  }, [filteredAccounts.length, activeCardIdx]);

  const recentTxns = transactions.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* ── Page title ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cards</h1>
        <Link
          to="/accounts/create"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Account
        </Link>
    
      </div>

      
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/55 px-1 py-1 shadow-sm backdrop-blur-sm">
        {[
          { key: 'all', label: 'All Cards' },
          { key: 'selected', label: 'Selected' },
          { key: 'credit', label: 'Credit' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setActiveCardIdx(0);
            }}
            className={`text-sm px-4 py-1.5 rounded-full transition font-semibold ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Cards strip ── */}
      {filteredAccounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">
            {activeTab === 'credit'
              ? 'No credit cards found yet.'
              : activeTab === 'selected'
                ? 'No card is selected yet. Choose one from the Select Card page.'
                : 'No accounts yet. Create your first card.'}
          </p>
          <Link
            to={activeTab === 'selected' ? '/select-card' : '/accounts/create'}
            className="mt-3 primary-btn inline-flex"
          >
            {activeTab === 'selected' ? 'Select Card' : 'Create Account'}
          </Link>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {filteredAccounts.map((account, idx) => (
            <button
              key={account._id}
              onClick={() => setActiveCardIdx(idx)}
              className="focus:outline-none"
            >
              <AccountCard
                account={account}
                balance={balances[account._id]}
                active={idx === activeCardIdx}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Two-column panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left – Card Management */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Select card</h2>
            <button className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7m10 0v10" />
              </svg>
            </button>
          </div>

          <ul className="divide-y divide-gray-50">
            {mgmtItems.map(({ label, desc, icon, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex items-center justify-between py-3.5 group hover:bg-gray-50 -mx-2 px-2 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 group-hover:text-gray-700 transition">{icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* ATM summary */}
          {accounts[activeCardIdx] && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Active Account</p>
              <p className="text-lg font-bold text-gray-900">
                {balances[filteredAccounts[activeCardIdx]?._id] != null
                  ? `${filteredAccounts[activeCardIdx].currency} ${Number(balances[filteredAccounts[activeCardIdx]._id]).toLocaleString()}`
                  : '— —'}
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Spent</span>
                <span>Limit</span>
              </div>
            </div>
          )}
        </div>

        {/* Right – Latest Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Latest transactions</h2>
            <Link
              to="/transactions"
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7m10 0v10" />
              </svg>
            </Link>
          </div>

          {recentTxns.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50 -mx-2">
              {recentTxns.map((txn) => {
                const date = new Date(txn.createdAt);
                const dateStr = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}. ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
                const statusColor =
                  txn.status === 'completed' ? 'text-gray-800' :
                  txn.status === 'failed'    ? 'text-red-500'  : 'text-yellow-600';
                return (
                  <li key={txn._id} className="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition">
                    <TxnAvatar />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {String(txn.fromAccount).slice(-6)} → {String(txn.toAccount).slice(-6)}
                      </p>
                      <p className="text-xs text-gray-400">{dateStr}</p>
                    </div>
                    <span className={`text-sm font-semibold ${statusColor}`}>
                      {Number(txn.amount).toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
