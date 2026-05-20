import apiClient from "./client";
import { API_ROUTES } from "../../core/constants/api-routes";

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  consultationFee?: number;
  commissionPercentage?: number;
  platformFee?: number;
}

const paymentService = {
  createPaymentIntent: async (bookingId: string) => {
    const response = await apiClient.post<{ success: boolean; data: PaymentIntentResponse }>(
      "/api/payments/create-intent", 
      { bookingId }
    );
    return response.data;
  },

  completeSession: async (bookingId: string) => {
    const response = await apiClient.post<{ success: boolean; data: { success: boolean } }>(
      `/api/payments/${bookingId}/complete`
    );
    return response.data;
  },

  verifyPayment: async (bookingId: string) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: unknown }>(
      "/api/payments/verify-payment",
      { bookingId }
    );
    return response.data;
  },

  getAdminFinanceStats: async () => {
    const response = await apiClient.get<{ success: boolean; data: unknown }>(
      "/api/admin/finance/stats"
    );
    return response.data;
  },

  updateAdminCommission: async (commissionPercentage: number) => {
    const response = await apiClient.patch<{ success: boolean; data: unknown }>(
      "/api/admin/settings/commission",
      { commissionPercentage }
    );
    return response.data;
  },
};

export default paymentService;
