import { AlertTriangle } from "lucide-react";
import type { PendingChangesSummaryProps } from "../types/therapist-profile.types";

export const PendingChangesSummary = ({ therapist }: PendingChangesSummaryProps) => (
  <div className="p-6 rounded-2xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
    <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "var(--fg-primary)" }}>
      <AlertTriangle size={16} className="text-amber-500" /> Pending Changes Summary
    </h3>
    <div className="space-y-2 text-sm" style={{ color: "var(--fg-muted)" }}>
      {Object.entries(therapist.pendingUpdates || {}).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="capitalize font-medium" style={{ color: "var(--fg-primary)" }}>{key}:</span>
          <span className="truncate">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
        </div>
      ))}
    </div>
  </div>
);