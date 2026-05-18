import apiClient from "./client";

export interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: string;
  createdAt: string;
}

export interface WalletData {
  wallet: {
    id: string;
    balance?: number; // User
    pendingBalance?: number; // Therapist
    availableBalance?: number; // Therapist
  };
  transactions: Transaction[];
}

const walletService = {
  getWalletData: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{ success: boolean; data: WalletData; meta?: any }>(`/api/wallet?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default walletService;
