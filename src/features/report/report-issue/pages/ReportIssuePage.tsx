import { useNavigate } from "react-router-dom";
import { Flag, ChevronDown, Loader2 } from "lucide-react";
import type { ReportCategory } from "../../../../services/api/report.service";
import { useReportIssue } from "../hooks/use-report-issue";
import { CATEGORIES, STATUS_BADGE, type ReportFormProps } from "../types/report-issue.types";
import { ReportFormHeader } from "../components/Report-form-header";
import { ReportFormSuccess } from "../components/Report-form-success";
import { ReportFileAttachment } from "../components/Report-file-attachment";

export const ReportIssuePage = ({ reporterContext = "user" }: ReportFormProps) => {
  const navigate = useNavigate();
  
  const {
    category,
    setCategory,
    subject,
    setSubject,
    description,
    setDescription,
    files,
    loading,
    submitted,
    errors,
    setErrors,
    handleFileChange,
    removeFile,
    resetForm,
    submitForm,
  } = useReportIssue();

  if (submitted) {
    return (
      <ReportFormSuccess
        onViewReports={() => navigate(reporterContext === "therapist" ? "/therapist/reports" : "/dashboard/reports")}
        onSubmitAnother={resetForm}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ReportFormHeader reporterContext={reporterContext} />

      <form
        onSubmit={submitForm}
        className="flex flex-col gap-5"
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-default)",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        {/* Category Selector Selection Dropdown option box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
            Category *
          </label>
          <div className="relative">
            <select
              id="report-category"
              value={category}
              onChange={(e) => { setCategory(e.target.value as ReportCategory); setErrors((p) => ({ ...p, category: "" })); }}
              className="w-full appearance-none px-4 py-3 rounded-xl text-sm font-medium pr-10 transition-all outline-none"
              style={{
                background: "var(--bg-base)",
                border: `1px solid ${errors.category ? "#ef4444" : "var(--border-default)"}`,
                color: category ? "var(--fg-primary)" : "var(--fg-muted)",
              }}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
          </div>
          {category && (
            <span
              className="self-start text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5"
              style={{ color: STATUS_BADGE[category].color, background: STATUS_BADGE[category].bg }}
            >
              {category}
            </span>
          )}
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Subject Text input panel */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
            Subject *
          </label>
          <input
            id="report-subject"
            type="text"
            placeholder="Brief summary of the issue…"
            value={subject}
            maxLength={100}
            onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
            className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--bg-base)",
              border: `1px solid ${errors.subject ? "#ef4444" : "var(--border-default)"}`,
              color: "var(--fg-primary)",
            }}
          />
          <div className="flex justify-between items-center">
            {errors.subject ? <p className="text-xs text-red-500">{errors.subject}</p> : <span />}
            <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>{subject.length}/100</span>
          </div>
        </div>

        {/* Description Textarea Field context input container */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
            Description *
          </label>
          <textarea
            id="report-description"
            placeholder="Describe the issue in detail. Include steps to reproduce if applicable…"
            value={description}
            maxLength={2000}
            rows={6}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
            className="px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
            style={{
              background: "var(--bg-base)",
              border: `1px solid ${errors.description ? "#ef4444" : "var(--border-default)"}`,
              color: "var(--fg-primary)",
            }}
          />
          <div className="flex justify-between items-center">
            {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
            <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>{description.length}/2000</span>
          </div>
        </div>

        {/* File Buffer Stream Document Pipeline Component */}
        <ReportFileAttachment
          files={files} 
          onRemove={removeFile} 
          onFileChange={handleFileChange} 
        />

        {/* Submit Operations Workspace Action Controller Button */}
        <button
          id="submit-report-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-2"
          style={{
            background: loading ? "var(--bg-base)" : "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            color: loading ? "var(--fg-muted)" : "#fff",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
          {loading ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </div>
  );
};