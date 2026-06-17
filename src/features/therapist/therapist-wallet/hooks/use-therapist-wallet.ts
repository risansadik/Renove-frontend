import { useState, useEffect } from "react";
import walletService, { type WalletData } from "../../../../services/api/wallet.service";

export const useTherapistWallet = () => {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchWallet = async (p: number, l: number) => {
    setLoading(true);
    try {
      const res = await walletService.getWalletData(p, l);
      setData(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages);
        setPage(res.meta.page);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWallet(page, limit);
    }, 0);
    return () => clearTimeout(timer);
  }, [page, limit]);

  const pending = data?.wallet.pendingBalance ?? 0;
  const available = data?.wallet.availableBalance ?? 0;

  return {
    data,
    loading,
    page,
    totalPages,
    setPage,
    pending,
    available,
  };
};