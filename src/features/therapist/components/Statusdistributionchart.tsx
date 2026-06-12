import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import type { ChartEvent, ActiveElement, TooltipItem } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export type StatusGroup = "completed" | "upcoming" | "cancelled" | "missed";

const STATUS_LABELS: Record<StatusGroup, string> = {
  completed: "Completed",
  upcoming: "Upcoming",
  cancelled: "Cancelled",
  missed: "Missed",
};

const STATUS_COLORS: Record<StatusGroup, { fill: string; border: string }> = {
  completed: { fill: "#1D9E75", border: "#0F6E56" },
  upcoming: { fill: "#378ADD", border: "#185FA5" },
  cancelled: { fill: "#E24B4A", border: "#A32D2D" },
  missed: { fill: "#BA7517", border: "#854F0B" },
};

const STATUS_ORDER: StatusGroup[] = ["completed", "upcoming", "cancelled", "missed"];

interface StatusDistributionChartProps {
  values: Record<StatusGroup, number>;
}

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
    <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
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

      <div className="relative w-full h-48">
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