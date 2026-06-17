import { RefreshCw } from "lucide-react";
import { STATUSES, type ReportsHeaderProps } from "../types/admin-reports.types";

export const ReportsHeader = ({ total, reports, filterStatus, setFilterStatus, onRefresh }: ReportsHeaderProps) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>Reports</h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
          {total} total report{total !== 1 ? "s" : ""}
        </p>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium self-start sm:self-auto"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
      >
        <RefreshCw size={12} /> Refresh
      </button>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {STATUSES.map(({ value, label, color, bg, icon: Icon }) => {
        const count = reports.filter((r) => r.status === value).length;
        const isActive = filterStatus === value;
        return (
          <button
            key={value}
            onClick={() => setFilterStatus(isActive ? "" : value)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: isActive ? bg : "var(--bg-subtle)",
              color: isActive ? color : "var(--fg-muted)",
              border: `1px solid ${isActive ? color + "40" : "var(--border-default)"}`,
            }}
          >
            <Icon size={11} /> {label} · {count}
          </button>
        );
      })}
    </div>
  </>
);