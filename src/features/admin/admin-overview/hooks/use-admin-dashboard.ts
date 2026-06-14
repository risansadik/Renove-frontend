import { useEffect, useState } from "react";
import { adminDashboardService, type AdminDashboardData } from "../../../../services/api/admin-dashboard.service.ts";

export const useAdminDashboard = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService
      .getDashboard()
      .then((response) => setDashboard(response.data))
      .catch(() => {
        // Handle gracefully if service fails
      })
      .finally(() => setLoading(false));
  }, []);

  const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

  return {
    dashboard,
    loading,
    money,
  };
};