import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Flag, Paperclip, X, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import reportService, { type ReportCategory, type CreateReportPayload } from "../../services/api/report.service";

const CATEGORIES: ReportCategory[] = [
  "Technical Issue",
  "Payment Issue",
  "Session Issue",
  "Account Issue",
  "Therapist Complaint",
  "User Complaint",
  "Feature Request",
  "Other",
];

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "Technical Issue":    { label: "Technical Issue",    color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  "Payment Issue":      { label: "Payment Issue",      color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Session Issue":      { label: "Session Issue",      color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  },
  "Account Issue":      { label: "Account Issue",      color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  "Therapist Complaint":{ label: "Therapist Complaint",color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  "User Complaint":     { label: "User Complaint",     color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
  "Feature Request":    { label: "Feature Request",    color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  "Other":              { label: "Other",              color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

interface ReportFormProps {
  /** Pass "user" or "therapist" to contextualise the heading */
  reporterContext?: "user" | "therapist";
}

export const ReportIssuePage = ({ reporterContext = "user" }: ReportFormProps) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<ReportCategory | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!category) e.category = "Please select a category.";
    if (subject.trim().length < 5) e.subject = "Subject must be at least 5 characters.";
    if (description.trim().length < 10) e.description = "Description must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    const merged = [...files, ...incoming].slice(0, 5);
    setFiles(merged);
    e.target.value = "";
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: CreateReportPayload = {
        category: category as ReportCategory,
        subject: subject.trim(),
        description: description.trim(),
        attachments: files,
      };
      await reportService.createReport(payload);
      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch {
      // error toast handled by apiClient interceptor
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.3)" }}
        >
          <CheckCircle2 size={38} style={{ color: "#22c55e" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--fg-primary)" }}>
            Report Submitted!
          </h2>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Our team will review your report and respond as soon as possible. You can track
            the status from <strong>My Reports</strong>.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() =>
              navigate(reporterContext === "therapist" ? "/therapist/reports" : "/dashboard/reports")
            }
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
          >
            View My Reports
          </button>
          <button
            onClick={() => { setSubmitted(false); setCategory(""); setSubject(""); setDescription(""); setFiles([]); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "var(--bg-subtle)", color: "var(--fg-muted)", border: "1px solid var(--border-default)" }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <Flag size={18} style={{ color: "#ef4444" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>
            Report an Issue
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
            {reporterContext === "therapist"
              ? "Submit a concern or feedback as a therapist."
              : "Tell us what's wrong and we'll make it right."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-default)",
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        {/* Category */}
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

        {/* Subject */}
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
            {errors.subject
              ? <p className="text-xs text-red-500">{errors.subject}</p>
              : <span />}
            <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>{subject.length}/100</span>
          </div>
        </div>

        {/* Description */}
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
            {errors.description
              ? <p className="text-xs text-red-500">{errors.description}</p>
              : <span />}
            <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>{description.length}/2000</span>
          </div>
        </div>

        {/* Attachments */}
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
                  <span className="max-w-[140px] truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)}>
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
              <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {/* Submit */}
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
