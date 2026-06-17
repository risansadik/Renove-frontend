import { Paperclip, X } from "lucide-react";
import type { ReportFileAttachmentProps } from "../types/report-issue.types";

export const ReportFileAttachment = ({ files, onRemove, onFileChange }: ReportFileAttachmentProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
      Attachments <span className="normal-case font-normal">(optional, max 5)</span>
    </label>

    {files.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {files.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
          >
            <Paperclip size={11} style={{ color: "var(--fg-muted)" }} />
            <span className="max-w-35 truncate">{f.name}</span>
            <button type="button" onClick={() => onRemove(i)}>
              <X size={11} style={{ color: "var(--fg-muted)" }} />
            </button>
          </div>
        ))}
      </div>
    )}

    {files.length < 5 && (
      <label
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all w-fit"
        style={{ background: "var(--bg-base)", border: "1px dashed var(--border-default)", color: "var(--fg-muted)" }}
      >
        <Paperclip size={14} />
        Attach files
        <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={onFileChange} />
      </label>
    )}
  </div>
);