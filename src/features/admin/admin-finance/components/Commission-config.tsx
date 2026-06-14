import { Percent } from "lucide-react";
import type { CommissionConfigProps } from "../types/admin-finance.types";

export const CommissionConfig = ({
  newCommission,
  setNewCommission,
  updating,
  handleUpdateCommission,
}: CommissionConfigProps) => {
  return (
    <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-6 stagger-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
          <Percent size={16} className="text-accent-500" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-brand-900 text-sm">Commission Configuration</h2>
          <p className="text-brand-900/60 text-xs">Set the default dynamic platform service fee percentage.</p>
        </div>
      </div>
      <form onSubmit={handleUpdateCommission} className="flex flex-col sm:flex-row gap-3 max-w-md mt-4">
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            disabled={updating}
            value={newCommission}
            onChange={(e) => setNewCommission(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full h-11 px-4 pr-10 rounded-xl bg-white/5 border border-brand-900/10 focus:border-brand-600 text-brand-900 font-mono text-sm outline-none transition-all disabled:opacity-60"
            placeholder="Enter commission rate"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-brand-900/40 text-sm">%</span>
        </div>
        <button
          type="submit"
          disabled={updating}
          className="btn-primary h-11 px-6 text-sm font-medium rounded-xl cursor-pointer w-auto"
        >
          {updating ? "Saving..." : "Update Fee Rate"}
        </button>
      </form>
    </div>
  );
};