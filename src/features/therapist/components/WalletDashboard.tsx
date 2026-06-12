import React from "react";
import { Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import type { WalletBalanceCardProps } from "../../../domain/model";

export const WalletDashboard: React.FC<WalletBalanceCardProps> = ({ 
  pendingBalance, 
  availableBalance, 
  withdrawnBalance 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-(--nav-bg-hover)">
          <Wallet className="text-(--accent-primary)" size={24} />
        </div>
        <h2 className="text-2xl font-display font-semibold">Financial Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="dash-card border-l-4 border-l-(--accent-secondary) bg-linear-to-br from-(--bg-card) to-(--bg-subtle)">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-(--fg-secondary) mb-1">Available for Payout</p>
              <h3 className="text-3xl font-bold text-(--fg-primary)">${availableBalance.toFixed(2)}</h3>
            </div>
            <CheckCircle className="text-(--accent-secondary) opacity-20" size={32} />
          </div>
          <p className="text-xs text-(--fg-muted) mt-4">Verified funds ready to be sent to your bank</p>
        </div>

        {/* Pending Balance */}
        <div className="dash-card border-l-4 border-l-amber-500/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-(--fg-secondary) mb-1">Pending Clearance</p>
              <h3 className="text-3xl font-bold text-(--fg-primary)">${pendingBalance.toFixed(2)}</h3>
            </div>
            <Clock className="text-amber-500 opacity-20" size={32} />
          </div>
          <p className="text-xs text-(--fg-muted) mt-4">Funds from recent or upcoming sessions</p>
        </div>

        {/* Total Withdrawn */}
        <div className="dash-card border-l-4 border-l-(--accent-primary)">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-(--fg-secondary) mb-1">Total Lifetime Earnings</p>
              <h3 className="text-3xl font-bold text-(--fg-primary)">${(availableBalance + withdrawnBalance + pendingBalance).toFixed(2)}</h3>
            </div>
            <TrendingUp className="text-(--accent-primary) opacity-20" size={32} />
          </div>
          <p className="text-xs text-(--fg-muted) mt-4">Total revenue generated on reNove</p>
        </div>
      </div>
    </div>
  );
};
