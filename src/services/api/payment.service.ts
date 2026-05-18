import apiClient from "./client";
import { API_ROUTES } from "../../core/constants/api-routes";

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
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
    const response = await apiClient.post<{ success: boolean; message: string; data: any }>(
      "/api/payments/verify-payment",
      { bookingId }
    );
    return response.data;
  },
};

export default paymentService;
