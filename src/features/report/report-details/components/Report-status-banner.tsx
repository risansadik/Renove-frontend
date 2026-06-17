import { format } from "date-fns";
import { STATUS_STYLE, type ReportStatusBannerProps } from "../types/report-details.types";

export const ReportStatusBanner = ({ status, updatedAt }: ReportStatusBannerProps) => {
  const st = STATUS_STYLE[status];
  const StatusIcon = st.icon;

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6"
      style={{ background: st.bg, border: `1px solid ${st.color}30` }}
    >
      <StatusIcon size={18} style={{ color: st.color }} />
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: st.color }}>Status: {st.label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
          Last updated {format(new Date(updatedAt), "MMM d, yyyy 'at' HH:mm")}
        </p>
      </div>
    </div>
  );
};