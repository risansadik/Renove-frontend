import { Wallet, CreditCard, Sparkles } from "lucide-react";
import type { WalletBalanceCardProps } from "../types/user-wallet.types";

export const WalletBalanceCard = ({ balance }: WalletBalanceCardProps) => {
  return (
    <div className="relative overflow-hidden p-8 rounded-4xl border border-white/10 shadow-2xl bg-linear-to-br from-[#1a1225] to-[#100818] text-white">
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
  );
};