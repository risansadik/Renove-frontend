import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartEvent, ActiveElement, TooltipItem } from "chart.js";
import { STATUS_COLORS, STATUS_LABELS, STATUS_ORDER, type StatusDistributionChartProps, type StatusGroup } from "../types/therapist-dashboard.types";

export const StatusDistributionChart = ({ values }: StatusDistributionChartProps) => {
  const [activeStatus, setActiveStatus] = useState<StatusGroup | null>(null);

  const total = STATUS_ORDER.reduce((sum, key) => sum + values[key], 0) || 1;

  const data = {
    labels: STATUS_ORDER.map((key) => STATUS_LABELS[key]),
    datasets: [
      {
        data: STATUS_ORDER.map((key) => values[key]),
        backgroundColor: STATUS_ORDER.map((key) => STATUS_COLORS[key].fill),
        borderColor: STATUS_ORDER.map((key) => STATUS_COLORS[key].border),
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) => {
            const raw = ctx.raw as number;
            const pct = Math.round((raw / total) * 100);
            return `${ctx.label}: ${raw} (${pct}%)`;
          },
        },
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length) {
        setActiveStatus(STATUS_ORDER[elements[0].index]);
      }
    },
  };

  return (
    <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Session Status Distribution</h2>

      <div className="flex flex-wrap gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
        {STATUS_ORDER.map((key) => {
          const pct = Math.round((values[key] / total) * 100);
          return (
            <button
              key={key}
              onClick={() => setActiveStatus(key)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
            >
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: STATUS_COLORS[key].fill }} />
              {STATUS_LABELS[key]} {pct}%
            </button>
          );
        })}
      </div>

      <div className="relative w-full flex-1 min-h-40">
        <Doughnut
          data={data}
          options={options}
          aria-label="Doughnut chart of session status distribution: completed, upcoming, cancelled, missed. Click a segment or legend item for details."
          role="img"
        />
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 min-h-5">
        {activeStatus
          ? `${STATUS_LABELS[activeStatus]}: ${values[activeStatus]} session${values[activeStatus] === 1 ? "" : "s"} (${Math.round(
              (values[activeStatus] / total) * 100
            )}% of total)`
          : "Click a segment or legend item for details"}
      </p>
    </div>
  );
};