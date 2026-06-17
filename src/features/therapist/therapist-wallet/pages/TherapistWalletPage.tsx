import { History, Clock, TrendingUp } from "lucide-react";
import { useTherapistWallet } from "../hooks/use-therapist-wallet";
import { WalletBalanceCard } from "../components/Wallet-balance-card";
import { TransactionRow } from "../components/Transaction-row";
import { TransactionPagination } from "../components/Transaction-pagination";

export const TherapistWalletPage = () => {
  const {
    data,
    loading,
    page,
    totalPages,
    setPage,
    pending,
    available,
  } = useTherapistWallet();

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Earnings & Wallet</h1>
        <p className="text-slate-500">Track your revenue and manage withdrawals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <WalletBalanceCard
          type="available"
          amount={available}
          title="Available Balance"
          icon={TrendingUp}
          bgClass="bg-linear-to-br from-[#1a251a] to-[#08180c]"
          accentColorClass="text-emerald-400"
        >
          <button className="mt-4 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20">
            Withdraw Funds
          </button>
        </WalletBalanceCard>

        {/* Pending Balance */}
        <WalletBalanceCard
          type="pending"
          amount={pending}
          title="Pending Earnings"
          icon={Clock}
          bgClass="bg-[#100818]"
          accentColorClass="text-amber-400"
        >
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Funds are held in pending until sessions are marked as **Completed**.
          </p>
        </WalletBalanceCard>
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
              <TransactionRow key={tx.id} tx={tx} />
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <TransactionPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};