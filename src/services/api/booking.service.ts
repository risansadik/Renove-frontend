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
  therapistId: string;
  slotId: string;
  type: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  note?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const bookingService = {
  createBooking: async (data: CreateBookingData) => {
    const response = await apiClient.post<{ success: boolean; data: BookingResponse }>("/api/bookings", data);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await apiClient.get<{ success: boolean; data: BookingResponse[] }>("/api/bookings/my-sessions");
    return response.data;
  },

  getTherapistBookings: async () => {
    const response = await apiClient.get<{ success: boolean; data: BookingResponse[] }>("/api/bookings/therapist-sessions");
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string, rejectionReason?: string) => {
    const response = await apiClient.patch<{ success: boolean; data: BookingResponse }>(`/api/bookings/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },
};

export default bookingService;
