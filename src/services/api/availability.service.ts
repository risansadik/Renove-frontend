import apiClient from "./client";

export interface CreateAvailabilityData {
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  recurrenceRule: string;
  recurrenceType: "weekly" | "once" | "daily";
  startDate: string;
  endDate?: string;
}

export interface AvailabilityRule {
  id: string;
  therapistId: string;
  title: string;
  startTime: string;
  endTime: string;
  recurrenceRule: string;
  recurrenceType: string;
  isActive: boolean;
}

export interface TherapistSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED" | "BLOCKED" | "EXPIRED";
}

const availabilityService = {
  createAvailability: async (data: CreateAvailabilityData) => {
    const response = await apiClient.post<{ success: boolean; data: AvailabilityRule }>("/api/availability", data);
    return response.data;
  },

  deleteAvailability: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/availability/${id}`);
    return response.data;
  },

  getAvailableSlots: async (therapistId: string, start: string, end: string) => {
    const response = await apiClient.get<{ success: boolean; data: TherapistSlot[] }>(
      `/api/availability/slots/${therapistId}?start=${start}&end=${end}`
    );
    return response.data;
  },

  getMyAvailabilityRules: async () => {
    const response = await apiClient.get<{ success: boolean; data: AvailabilityRule[] }>("/api/availability/my-rules");
    return response.data;
  },
};

export default availabilityService;
