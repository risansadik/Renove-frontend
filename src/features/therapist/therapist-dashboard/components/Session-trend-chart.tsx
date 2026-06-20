import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import type { TooltipItem } from "chart.js";
import { format, subDays, subWeeks, startOfWeek, isSameDay, isWithinInterval, endOfWeek } from "date-fns";
import type { Range, SessionTrendChartProps } from "../types/therapist-dashboard.types.ts";


export const SessionTrendChart = ({ completedBookings, getSessionStart }: SessionTrendChartProps) => {
  const [range, setRange] = useState<Range>("7d");

  const trend7d = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = subDays(now, 6 - index);
      return {
        label: format(date, "EEE"),
        value: completedBookings.filter((booking) => isSameDay(getSessionStart(booking), date)).length,
      };
    });
  }, [completedBookings, getSessionStart]);

  const trend30d = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }, (_, index) => {
      const weekStart = startOfWeek(subWeeks(now, 3 - index));
      const weekEnd = endOfWeek(weekStart);
      return {
        label: `Week ${index + 1}`,
        value: completedBookings.filter((booking) =>
          isWithinInterval(getSessionStart(booking), { start: weekStart, end: weekEnd })
        ).length,
      };
    });
  }, [completedBookings, getSessionStart]);

  const active = range === "7d" ? trend7d : trend30d;

  const data = {
    labels: active.map((point) => point.label),
    datasets: [
      {
        label: "Completed sessions",
        data: active.map((point) => point.value),
        borderColor: "#378ADD",
        backgroundColor: "rgba(55,138,221,0.1)",
        pointStyle: range === "7d" ? "circle" : "rectRot",
        pointRadius: 4,
        pointBackgroundColor: "#378ADD",
        tension: 0.35,
        fill: true,
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
          label: (ctx: TooltipItem<"line">) => `${ctx.parsed.y} session${ctx.parsed.y === 1 ? "" : "s"}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-4 md:p-6 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <h2 className="font-semibold text-brand-900 dark:text-white truncate">Session Analytics</h2>
          <p className="text-xs text-brand-900/50 dark:text-slate-500">Completed sessions over time</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {(["7d", "30d"] as Range[]).map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                range === option
                  ? "bg-brand-500 text-white"
                  : "bg-white dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {/* Chart container: fixed height, no overflow */}
      <div className="relative w-full h-48 md:h-56">
        <Line
          data={data}
          options={options}
          aria-label="Line chart of completed sessions over the selected period"
          role="img"
        />
      </div>
    </div>
  );
};