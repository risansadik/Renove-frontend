import { useState, useEffect } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight, History, CreditCard, Sparkles } from "lucide-react";
import walletService, { type WalletData } from "../../services/api/wallet.service";
import { format } from "date-fns";

export const UserWalletPage = () => {
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
    } catch (err) {
      console.error("Failed to fetch wallet", err);
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
        <div className="h-48 bg-white/5 rounded-[32px]" />
        <div className="h-64 bg-white/5 rounded-[32px]" />
      </div>
    );
  }

  const balance = data?.wallet.balance ?? 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wallet</h1>
        <p className="text-slate-500">Manage your credits and refund history.</p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden p-8 rounded-[32px] border border-white/10 shadow-2xl bg-gradient-to-br from-[#1a1225] to-[#100818] text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
              <CreditCard size={20} />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Balance</span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold font-display">${balance.toFixed(2)}</span>
            <span className="text-slate-400 mb-2 text-sm">USD Available</span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Sparkles size={14} className="text-brand-400" />
              <span className="text-xs font-medium">Auto-applied to next session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="dash-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={20} className="text-brand-500" />
            <h2 className="text-lg font-bold">Transaction History</h2>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {data?.transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No transactions yet.
            </div>
          ) : (
            data?.transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
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
                  <p className="text-[10px] uppercase font-bold text-slate-400">{tx.status}</p>
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
