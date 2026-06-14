import { useEffect, useState } from "react";
import paymentService from "../../../../services/api/payment.service.ts";
import { toast } from "react-hot-toast";
import type { FinanceStats } from "../types/admin-finance.types.ts";

export const useFinanceManagement = () => {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCommission, setNewCommission] = useState<number | "">("");
  const [updating, setUpdating] = useState(false);
  const [activeModal, setActiveModal] = useState<"revenue" | "earnings" | "pending" | "withdrawn" | "refunds" | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 10;

  const fetchStats = async (p = 1) => {
    setLoading(true);
    try {
      const res = await paymentService.getAdminFinanceStats<FinanceStats>(p, limit);
      if (res.success) {
        setStats(res.data);
        setNewCommission(res.data.commissionPercentage);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setPage(res.meta.page);
          setTotalTransactions(res.meta.total);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      await fetchStats(page);
    };
    void loadStats();
  }, [page]);

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommission === "" || newCommission < 0 || newCommission > 100) {
      toast.error("Commission must be between 0 and 100");
      return;
    }

    try {
      setUpdating(true);
      const res = await paymentService.updateAdminCommission(Number(newCommission));
      if (res.success) {
        toast.success("Platform commission updated successfully!");
        fetchStats();
      }
    } finally {
      setUpdating(false);
    }
  };

  return {
    stats,
    loading,
    newCommission,
    setNewCommission,
    updating,
    activeModal,
    setActiveModal,
    page,
    setPage,
    totalPages,
    totalTransactions,
    fetchStats,
    handleUpdateCommission,
  };
};