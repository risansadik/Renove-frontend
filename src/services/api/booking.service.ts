import apiClient from "../../services/api/client";

export interface CreateBookingData {
  therapistId: string;
  slotId: string;
  type: "video" | "chat" | "in-person";
  note?: string;
}

export interface BookingResponse {
  id: string;
  userId: string;
  therapistId: string | { id: string; name: string; consultationFee: number };
  slotId: string | { id: string; startTime: string; endTime: string };
  type: string;
  status: "pending" | "accepted" | "rejected" | "awaiting_payment" | "confirmed" | "completed" | "cancelled" | "expired" | "no_show";
  note?: string;
  rejectionReason?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

const bookingService = {
  createBooking: async (data: CreateBookingData) => {
    const response = await apiClient.post<{ success: boolean; data: BookingResponse }>("/api/bookings", data);
    return response.data;
  },

  getUserBookings: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{ success: boolean; data: BookingResponse[]; meta?: any }>(`/api/bookings/my-sessions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTherapistBookings: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{ success: boolean; data: BookingResponse[]; meta?: any }>(`/api/bookings/therapist-sessions?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string, rejectionReason?: string) => {
    const response = await apiClient.patch<{ success: boolean; data: BookingResponse }>(`/api/bookings/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  cancelBooking: async (id: string, reason: string) => {
    const response = await apiClient.post<{ success: boolean; data: BookingResponse }>(`/api/bookings/${id}/cancel`, {
      reason,
    });
    return response.data;
  },
};

export default bookingService;
