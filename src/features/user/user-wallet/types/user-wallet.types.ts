export interface WalletBalanceCardProps {
  balance: number;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit" | string;
  description: string;
  createdAt: string | Date;
  amount: number;
  status: string;
}

export interface TransactionHistoryListProps {
  transactions: Transaction[];
}

export interface WalletPaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}