import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./chartRegistry";
import { chartGridColor, chartTextColor } from "./chartRegistry";

interface Props {
  data: { label: string; revenue: number }[];
}

export const RevenueGrowthChart = ({ data }: Props) => {
  const chartData: ChartData<"bar"> = {
    labels: data.map((point) => point.label),
    datasets: [
      {
        label: "Platform revenue",
        data: data.map((point) => point.revenue),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "#10b981",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        padding: 12,
        callbacks: { label: (ctx) => `$${Number(ctx.raw ?? 0).toLocaleString()}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartTextColor } },
      y: {
        beginAtZero: true,
        grid: { color: chartGridColor },
        ticks: { color: chartTextColor, callback: (value) => `$${Number(value).toLocaleString()}` },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};
