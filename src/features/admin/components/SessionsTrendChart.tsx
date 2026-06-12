import { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./chartRegistry";
import { chartGridColor, chartTextColor } from "./chartRegistry";

type Mode = "daily" | "weekly" | "monthly";

interface Props {
  data: { label: string; booked: number; completed: number }[];
}

const compact = (data: Props["data"], mode: Mode) => {
  if (mode === "daily") return data.slice(-14);
  const size = mode === "weekly" ? 7 : 30;
  const buckets: { label: string; booked: number; completed: number }[] = [];
  for (let i = 0; i < data.length; i += size) {
    const group = data.slice(i, i + size);
    if (!group.length) continue;
    buckets.push({
      label: mode === "weekly" ? `W${buckets.length + 1}` : group[0].label,
      booked: group.reduce((sum, point) => sum + point.booked, 0),
      completed: group.reduce((sum, point) => sum + point.completed, 0),
    });
  }
  return buckets;
};

export const SessionsTrendChart = ({ data }: Props) => {
  const [mode, setMode] = useState<Mode>("daily");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const points = useMemo(() => compact(data, mode), [data, mode]);

  const lineData: ChartData<"line"> = {
    labels: points.map((point) => point.label),
    datasets: [
      {
        label: "Booked",
        data: points.map((point) => point.booked),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.18)",
        borderWidth: 3,
        tension: 0.35,
        fill: chartType === "line",
      },
      {
        label: "Completed",
        data: points.map((point) => point.completed),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.22)",
        borderWidth: 3,
        tension: 0.35,
        fill: false,
      },
    ],
  };

  const barData: ChartData<"bar"> = {
    labels: lineData.labels,
    datasets: lineData.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data as number[],
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
      borderWidth: dataset.borderWidth,
      borderRadius: 8,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: chartTextColor, usePointStyle: true } },
      tooltip: { backgroundColor: "rgba(15, 23, 42, 0.92)", padding: 12 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartTextColor } },
      y: { beginAtZero: true, grid: { color: chartGridColor }, ticks: { color: chartTextColor, precision: 0 } },
    },
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["daily", "weekly", "monthly"] as Mode[]).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${mode === item ? "bg-brand-500 text-white border-brand-500" : "border-brand-900/10 text-brand-900/60 dark:text-slate-300"}`}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => setChartType((current) => current === "line" ? "bar" : "line")}
          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-brand-900/10 text-brand-900/60 dark:text-slate-300 ml-auto"
        >
          {chartType === "line" ? "Bar" : "Line"} view
        </button>
      </div>
      <div className="h-72">
        {chartType === "line" ? (
          <Line data={lineData} options={options} />
        ) : (
          <Bar data={barData} options={options as ChartOptions<"bar">} />
        )}
      </div>
    </div>
  );
};
