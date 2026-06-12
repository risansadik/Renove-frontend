import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Flag, Paperclip, Clock, Tag, MessageSquare, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import reportService, { type Report, type ReportStatus } from "../../services/api/report.service";

const STATUS_STYLE: Record<ReportStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  open:      { label: "Open",      color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: AlertCircle   },
  in_review: { label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: RefreshCw     },
  resolved:  { label: "Resolved",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle2  },
  rejected:  { label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle       },
};

const CATEGORY_COLOR: Record<string, { color: string; bg: string }> = {
  "Technical Issue":    { color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
  "Payment Issue":      { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Session Issue":      { color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  },
  "Account Issue":      { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  "Therapist Complaint":{ color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  "User Complaint":     { color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
  "Feature Request":    { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  "Other":              { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

interface ReportDetailsPageProps {
  /** Path to navigate back to the list */
  backPath: string;
}

export const ReportDetailsPage = ({ backPath }: ReportDetailsPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    reportService.getReportDetails(id)
      .then((res) => setReport(res.data ?? null))
      .catch(() => navigate(backPath))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
        ))}
      </div>
    );
  }

  if (!report) return null;

  const st = STATUS_STYLE[report.status];
  const StatusIcon = st.icon;
  const catColor = CATEGORY_COLOR[report.category] ?? CATEGORY_COLOR["Other"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
        style={{ color: "var(--fg-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
      >
        <ArrowLeft size={16} /> Back to Reports
      </button>

      {/* Status Banner */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6"
        style={{ background: st.bg, border: `1px solid ${st.color}30` }}
      >
        <StatusIcon size={18} style={{ color: st.color }} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: st.color }}>Status: {st.label}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
            Last updated {format(new Date(report.updatedAt), "MMM d, yyyy 'at' HH:mm")}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
      >
        {/* Header */}
        <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
              style={{ color: catColor.color, background: catColor.bg }}
            >
              <Tag size={10} /> {report.category}
            </span>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
              style={{ color: "var(--fg-muted)", background: "var(--bg-base)" }}
            >
              Submitted by {report.reporterRole}
            </span>
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>{report.subject}</h1>
          <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
            <Clock size={12} />
            <span>Submitted {format(new Date(report.createdAt), "MMMM d, yyyy 'at' HH:mm")}</span>
          </div>
        </div>

        {/* Description */}
        <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>Description</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--fg-primary)" }}>
            {report.description}
          </p>
        </div>

        {/* Attachments */}
        {report.attachments.length > 0 && (
          <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>
              Attachments ({report.attachments.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.attachments.map((url, i) => (
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
        )}

        {/* Admin Notes */}
        {report.adminNotes && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} style={{ color: "var(--accent-primary)" }} />
              <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
                Admin Response
              </h2>
            </div>
            <div
              className="p-4 rounded-xl text-sm leading-relaxed"
              style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)", color: "var(--fg-primary)" }}
            >
              {report.adminNotes}
            </div>
          </div>
        )}

        {/* No admin response yet */}
        {!report.adminNotes && (
          <div className="p-6 flex items-center gap-3">
            <Flag size={14} style={{ color: "var(--fg-muted)" }} />
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              Our team is reviewing your report. We'll update you here once there's a response.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
