import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import reportService, { type Report } from "../../../../services/api/report.service";

export const useReportDetails = (backPath: string) => {
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
  }, [id, navigate, backPath]);

  return {
    report,
    loading,
    navigateBack: () => navigate(backPath),
  };
};