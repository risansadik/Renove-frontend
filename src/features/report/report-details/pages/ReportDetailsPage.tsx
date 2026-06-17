import { ArrowLeft } from "lucide-react";
import { useReportDetails } from "../hooks/use-report-details";
import type { ReportDetailsPageProps } from "../types/report-details.types";
import { ReportStatusBanner } from "../components/Report-status-banner";
import { ReportDetailsHeader } from "../components/Report-details-header";
import { ReportAttachments } from "../components/Report-attachments";
import { ReportAdminResponse } from "../components/Report-admin-response";

export const ReportDetailsPage = ({ backPath }: ReportDetailsPageProps) => {
  const { report, loading, navigateBack } = useReportDetails(backPath);

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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button link */}
      <button
        onClick={navigateBack}
        className="flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
        style={{ color: "var(--fg-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
      >
        <ArrowLeft size={16} /> Back to Reports
      </button>

      {/* Dynamic Status Banner */}
      <ReportStatusBanner status={report.status} updatedAt={report.updatedAt} />

      {/* Main Structural Layout Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
      >
        <ReportDetailsHeader
          category={report.category}
          reporterRole={report.reporterRole}
          subject={report.subject}
          createdAt={report.createdAt}
        />

        {/* Content Body Section */}
        <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>Description</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--fg-primary)" }}>
            {report.description}
          </p>
        </div>

        {/* Document Attachment Loop */}
        {report.attachments.length > 0 && (
          <ReportAttachments attachments={report.attachments} />
        )}

        {/* Audit Status Tracking Workspace Response Container */}
        <ReportAdminResponse adminNotes={report.adminNotes} />
      </div>
    </div>
  );
};