import { Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { CATEGORY_COLOR, type ReportDetailsHeaderProps } from "../types/report-details.types";

export const ReportDetailsHeader = ({ category, reporterRole, subject, createdAt }: ReportDetailsHeaderProps) => {
  const catColor = CATEGORY_COLOR[category] ?? CATEGORY_COLOR["Other"];

  return (
    <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ color: catColor.color, background: catColor.bg }}
        >
          <Tag size={10} /> {category}
        </span>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
          style={{ color: "var(--fg-muted)", background: "var(--bg-base)" }}
        >
          Submitted by {reporterRole}
        </span>
      </div>
      <h1 className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>{subject}</h1>
      <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
        <Clock size={12} />
        <span>Submitted {format(new Date(createdAt), "MMMM d, yyyy 'at' HH:mm")}</span>
      </div>
    </div>
  );
};