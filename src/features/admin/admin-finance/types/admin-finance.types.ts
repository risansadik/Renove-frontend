export interface Transaction {
  id: string;
  walletId: string;
  walletType: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: "pending" | "completed" | "failed";
  bookingId?: string;
  consultationFee?: number;
  commissionPercentage?: number;
  platformFee?: number;
  totalPaid?: number;
  therapistEarnings?: number;
  refundAmount?: number;
  createdAt: string;
}

export interface FinanceStats {
  totalRevenue: number;
  totalTherapistEarnings: number;
  totalPendingPayouts: number;
  totalWithdrawn: number;
  totalRefunded: number;
  commissionPercentage: number;
  transactions: Transaction[];
}

export interface FinanceStatsGridProps {
  stats: FinanceStats | null;
  loading: boolean;
  setActiveModal: (modal: "revenue" | "earnings" | "pending" | "withdrawn" | "refunds" | null) => void;
}

export interface CommissionConfigProps {
  newCommission: number | "";
  setNewCommission: (val: number | "") => void;
  updating: boolean;
  handleUpdateCommission: (e: React.FormEvent) => Promise<void>;
}

export interface FinancialLedgerTableProps {
  stats: FinanceStats | null;
  loading: boolean;
  page: number;
  totalPages: number;
  totalTransactions: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface FinanceDetailModalProps {
  activeModal: "revenue" | "earnings" | "pending" | "withdrawn" | "refunds" | null;
  setActiveModal: (modal: null) => void;
  stats: FinanceStats | null;
}

