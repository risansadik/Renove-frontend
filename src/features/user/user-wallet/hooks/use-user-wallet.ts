import { useState, useEffect } from "react";
import type { WalletData } from "../../../../services/api/wallet.service";
import walletService from "../../../../services/api/wallet.service";

export const useUserWallet = (limit = 10) => {
  const [data, setData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const balance = data?.wallet.balance ?? 0;
  const transactions = data?.transactions ?? [];

  return {
    data,
    transactions,
    balance,
    loading,
    page,
    totalPages,
    setPage,
  };
};