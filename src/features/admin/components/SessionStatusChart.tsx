import { useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./chartRegistry";

type StatusKey = "completed" | "upcoming" | "cancelled" | "missed";

const colors: Record<StatusKey, string> = {
  completed: "#10b981",
  upcoming: "#6366f1",
  cancelled: "#ef4444",
  missed: "#f59e0b",
};

interface Props {
  data: Record<StatusKey, number>;
}

export const SessionStatusChart = ({ data }: Props) => {
  const [visible, setVisible] = useState<Record<StatusKey, boolean>>({
    completed: true,
    upcoming: true,
    cancelled: true,
    missed: true,
  });
  const keys = Object.keys(data) as StatusKey[];
  const total = keys.reduce((sum, key) => sum + data[key], 0) || 1;
  const filtered = useMemo(() => keys.map((key) => visible[key] ? data[key] : 0), [data, keys, visible]);

  const chartData: ChartData<"doughnut"> = {
    labels: keys.map((key) => key[0].toUpperCase() + key.slice(1)),
    datasets: [
      {
        data: filtered,
        backgroundColor: keys.map((key) => colors[key]),
        borderColor: "rgba(255,255,255,0.65)",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.raw ?? 0);
            return `${ctx.label}: ${value} (${Math.round((value / total) * 100)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6 items-center">
      <div className="h-56">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
            className={`text-left rounded-xl p-3 border transition-all ${visible[key] ? "bg-white dark:bg-white/5 border-brand-900/10 dark:border-white/10" : "opacity-50 border-dashed border-brand-900/10"}`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[key] }} />
              <span className="text-[10px] uppercase tracking-widest text-slate-400">{key}</span>
            </div>
            <p className="text-xl font-bold text-brand-900 dark:text-white mt-1">{data[key]}</p>
            <p className="text-xs text-slate-400">{Math.round((data[key] / total) * 100)}%</p>
          </button>
        ))}
      </div>
    </div>
  );
};
