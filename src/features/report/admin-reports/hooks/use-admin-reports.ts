import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import reportService, { type Report, type ReportStatus, type ReportCategory } from "../../../../services/api/report.service";

export const useAdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "">("");
  const [filterCategory, setFilterCategory] = useState<ReportCategory | "">("");
  const [search, setSearch] = useState("");

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchReports = async (p: number) => {
    setLoading(true);
    try {
      const filters: { status?: ReportStatus; category?: ReportCategory } = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterCategory) filters.category = filterCategory;
      
      const res = await reportService.adminGetAllReports(p, limit, filters);
      if (res.data) {
        setReports(res.data.data);
        setTotal(res.data.total);
      }
    } catch {
      toast.error("Failed to load reports pipeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page, filterStatus, filterCategory]);

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setNoteText(report.adminNotes ?? "");
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedReport(null);
  };

  const handleUpdateStatus = async (status: ReportStatus) => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      const res = await reportService.adminUpdateStatus(selectedReport.id, status);
      toast.success("Status updated");
      if (res.data) {
        setSelectedReport(res.data);
        setReports((prev) => prev.map((r) => (r.id === res.data!.id ? res.data! : r)));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      const res = await reportService.adminAddNote(selectedReport.id, noteText);
      toast.success("Notes saved successfully");
      if (res.data) {
        setSelectedReport(res.data);
        setReports((prev) => prev.map((r) => (r.id === res.data!.id ? res.data! : r)));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReports = search
    ? reports.filter(
        (r) =>
          r.subject.toLowerCase().includes(search.toLowerCase()) ||
          r.category.toLowerCase().includes(search.toLowerCase()) ||
          r.reporterRole.toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  return {
    reports,
    filteredReports,
    loading,
    page,
    setPage,
    total,
    totalPages,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    search,
    setSearch,
    selectedReport,
    noteText,
    setNoteText,
    actionLoading,
    showPanel,
    refresh: () => fetchReports(page),
    handleSelectReport,
    handleClosePanel,
    handleUpdateStatus,
    handleSaveNote,
  };
};