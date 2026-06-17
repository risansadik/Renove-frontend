import { Paperclip } from "lucide-react";
import type { ReportAttachmentsProps } from "../types/report-details.types";

export const ReportAttachments = ({ attachments }: ReportAttachmentsProps) => (
  <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>
      Attachments ({attachments.length})
    </h2>
    <div className="flex flex-wrap gap-2">
      {attachments.map((url, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--accent-primary)" }}
        >
          <Paperclip size={11} /> Attachment {i + 1}
        </a>
      ))}
    </div>
  </div>
);