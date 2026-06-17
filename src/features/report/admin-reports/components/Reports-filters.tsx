import { Search, Filter, ChevronDown } from "lucide-react";
import type { ReportCategory } from "../../../../services/api/report.service";
import { CATEGORIES, type ReportsFiltersProps } from "../types/admin-reports.types";

export const ReportsFilters = ({ search, setSearch, filterCategory, setFilterCategory }: ReportsFiltersProps) => (
  <div className="flex flex-wrap gap-3 mb-5">
    <div className="relative flex-1 min-w-45">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search reports…"
        className="w-full pl-8 pr-4 py-2 rounded-xl text-xs outline-none"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
      />
    </div>
    <div className="relative">
      <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value as ReportCategory | "")}
        className="appearance-none pl-8 pr-8 py-2 rounded-xl text-xs font-medium outline-none"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
    </div>
  </div>
);