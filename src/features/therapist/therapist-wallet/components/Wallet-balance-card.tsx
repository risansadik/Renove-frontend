import type { WalletBalanceCardProps } from "../types/therapist-wallet.types";

export const WalletBalanceCard = ({
  type,
  amount,
  title,
  icon: Icon,
  bgClass,
  accentColorClass,
  children
}: WalletBalanceCardProps) => (
  <div className={`relative overflow-hidden p-8 rounded-4xl border border-white/10 shadow-2xl ${bgClass} text-white`}>
    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
      <Icon size={80} />
    </div>
    <div className="relative z-10 flex flex-col gap-4">
      <div className={`flex items-center gap-3 ${accentColorClass}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          type === "available" ? "bg-emerald-500/20" : "bg-amber-500/20"
        }`}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold font-display">${amount.toFixed(2)}</span>
      </div>
      {children}
    </div>
  </div>
);