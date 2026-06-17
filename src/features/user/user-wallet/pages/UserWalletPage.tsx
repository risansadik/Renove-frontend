import { History } from "lucide-react";
import { useUserWallet } from "../hooks/use-user-wallet";
import { WalletBalanceCard } from "../components/Wallet-balance-card";
import { TransactionHistoryList } from "../components/Transaction-history-list";
import { WalletPagination } from "../components/Wallet-pagination";

export const UserWalletPage = () => {
  const limit = 10;
  const {
    transactions,
    balance,
    loading,
    page,
    totalPages,
    setPage,
  } = useUserWallet(limit);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-48 bg-white/5 rounded-4xl" />
        <div className="h-64 bg-white/5 rounded-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Context */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wallet</h1>
        <p className="text-slate-500">Manage your credits and refund history.</p>
      </div>

      {/* Balance Card Section */}
      <WalletBalanceCard balance={balance} />

      {/* Transactions Table Section */}
      <div className="dash-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={20} className="text-brand-500" />
            <h2 className="text-lg font-bold">Transaction History</h2>
          </div>
        </div>

        {/* Dynamic transaction rendering node */}
        <TransactionHistoryList transactions={transactions} />

        {/* Pagination node conditional control */}
        {totalPages > 1 && (
          <WalletPagination
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
          />
        )}
      </div>
    </div>
  );
};