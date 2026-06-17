import type { LucideIcon } from "lucide-react";

export interface WalletBalanceCardProps {
  type: "available" | "pending";
  amount: number;
  title: string;
  icon: LucideIcon;
  bgClass: string;
  accentColorClass: string;
  children?: React.ReactNode;
}

export interface TransactionItem {
  id: string;
  type: string;
  description: string;
  createdAt: string | Date;
  amount: number;
  status: string;
}

export interface TransactionRowProps {
  tx: TransactionItem;
}

export interface TransactionPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}
