import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import type { TransactionHistoryListProps } from "../types/user-wallet.types";

export const TransactionHistoryList = ({ transactions }: TransactionHistoryListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {transactions.map((tx) => (
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
            <p className="text-[10px] uppercase font-bold text-slate-400">{tx.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};