import { Bar } from "react-chartjs-2";
import type { TooltipItem } from "chart.js";
import { TrendingUp } from "lucide-react";
import { money, type EarningsChartProps } from "../types/therapist-dashboard.types";

export const EarningsChart = ({
  earningsTrend,
  thisMonthCredits,
  thisYearCredits,
  availableBalance,
  pendingPayouts,
  totalWithdrawn,
  totalRefunds,
}: EarningsChartProps) => {
  const data = {
    labels: earningsTrend.map((point) => point.label),
    datasets: [
      {
        label: "Earnings",
        data: earningsTrend.map((point) => point.value),
        backgroundColor: "#1D9E75",
        borderRadius: 4,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => money(ctx.parsed.y ?? 0),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: string | number) => money(Number(value)) },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-brand-900 dark:text-white">Earnings Analytics</h2>
        <TrendingUp size={18} className="text-emerald-500" />
      </div>
      <p className="text-xs text-brand-900/50 dark:text-slate-500 mb-4">Last 6 months</p>

      <div className="relative w-full h-64 mb-5">
        <Bar
          data={data}
          options={options}
          aria-label="Bar chart of monthly earnings over the last 6 months"
          role="img"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">This Month</p>
          <p className="font-bold text-slate-900 dark:text-white text-lg">{money(thisMonthCredits)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">This Year</p>
          <p className="font-bold text-slate-900 dark:text-white text-lg">{money(thisYearCredits)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Available Balance</p>
          <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{money(availableBalance)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Pending Payouts</p>
          <p className="font-bold text-amber-600 dark:text-amber-400 text-lg">{money(pendingPayouts)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Total Withdrawn</p>
          <p className="font-bold text-slate-900 dark:text-white text-lg">{money(totalWithdrawn)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Refunds</p>
          <p className="font-bold text-rose-600 dark:text-rose-400 text-lg">{money(totalRefunds)}</p>
        </div>
      </div>
    </div>
  );
};