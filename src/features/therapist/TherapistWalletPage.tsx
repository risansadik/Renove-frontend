import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, History, Clock, TrendingUp, DollarSign } from "lucide-react";
import walletService, { type WalletData } from "../../services/api/wallet.service";
import { format } from "date-fns";

export const TherapistWalletPage = () => {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchWallet = async (p: number, l: number) => {
    setLoading(true);
    try {
      const res = await walletService.getWalletData(p, l);
      setData(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages);
        setPage(res.meta.page);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWallet(page, limit);
    }, 0);
    return () => clearTimeout(timer);
  }, [page, limit]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-white/5 rounded-4xl" />
          <div className="h-40 bg-white/5 rounded-4xl" />
        </div>
        <div className="h-64 bg-white/5 rounded-4xl" />
      </div>
    );
  }

  const pending = data?.wallet.pendingBalance ?? 0;
  const available = data?.wallet.availableBalance ?? 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Earnings & Wallet</h1>
        <p className="text-slate-500">Track your revenue and manage withdrawals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="relative overflow-hidden p-8 rounded-4xl border border-white/10 shadow-2xl bg-linear-to-br from-[#1a251a] to-[#08180c] text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp size={80} />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider">Available Balance</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-display">${available.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="relative overflow-hidden p-8 rounded-4xl border border-white/10 shadow-2xl bg-[#100818] text-white">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Clock size={80} />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock size={20} />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider">Pending Earnings</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold font-display">${pending.toFixed(2)}</span>
            </div>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Funds are held in pending until sessions are marked as **Completed**.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="dash-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={20} className="text-brand-500" />
            <h2 className="text-lg font-bold">Earnings History</h2>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {data?.transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No transactions recorded yet.
            </div>
          ) : (
            data?.transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-slate-500">{format(new Date(tx.createdAt), "MMM d, yyyy • HH:mm")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <p className={`text-[10px] uppercase font-bold ${tx.status === 'pending' ? 'text-amber-500' : 'text-slate-400'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="p-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
