import { useState, useEffect } from "react";
import reportService, { type Report, type ReportStatus } from "../../../../services/api/report.service";

export const useMyReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "">("");
  const limit = 10;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchReports = async (p: number) => {
    setLoading(true);
    try {
      const res = await reportService.getMyReports(p, limit);
      if (res.data) {
        setReports(res.data.data);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const filtered = filterStatus ? reports.filter((r) => r.status === filterStatus) : reports;

  return {
    reports,
    filtered,
    loading,
    page,
    setPage,
    total,
    totalPages,
    filterStatus,
    setFilterStatus,
    refresh: () => fetchReports(page),
  };
};