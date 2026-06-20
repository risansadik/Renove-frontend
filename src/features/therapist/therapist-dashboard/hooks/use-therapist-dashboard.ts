import { useState, useEffect, useMemo } from "react";
import { format, isSameDay, parseISO, startOfMonth, startOfYear } from "date-fns";
import toast from "react-hot-toast";
import { selectAuthTherapist, useAuthStore } from "../../../../store/use-auth-store";
import { therapistDashboardService, type PublicReviewItem, type TherapistDashboardData } from "../../../../services/api/auth.service";
import type { BookingResponse } from "../../../../services/api/booking.service";
import type { Transaction } from "../../../../services/api/wallet.service";
import type { AvailabilityRule } from "../../../../services/api/availability.service";
import bookingService from "../../../../services/api/booking.service";
import walletService from "../../../../services/api/wallet.service";
import availabilityService from "../../../../services/api/availability.service";
import { getClientName, getSessionStart, getStatusGroup, isUpcomingStatus, type StatusGroup } from "../types/therapist-dashboard.types";

export const useTherapistDashboard = () => {
  const therapist = useAuthStore(selectAuthTherapist);
  const [data, setData] = useState<TherapistDashboardData | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);
  const [reviews, setReviews] = useState<PublicReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashboardRes, bookingsRes, walletRes, availabilityRes, reviewsRes] = await Promise.all([
        therapistDashboardService.getDashboard(),
        bookingService.getTherapistBookings(1, 100),
        walletService.getWalletData(1, 20),
        availabilityService.getMyAvailabilityRules(),
        therapistDashboardService.getOwnReviews(),
      ]);

      setData(dashboardRes.data.data ?? null);
      setBookings(bookingsRes.data ?? []);
      setTransactions(walletRes.data?.transactions ?? []);
      setAvailabilityRules(availabilityRes.data ?? []);
      setReviews(reviewsRes.data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: "awaiting_payment" | "rejected") => {
    setActionId(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, status, status === "rejected" ? "Declined from dashboard" : undefined);
      toast.success(status === "rejected" ? "Booking declined" : "Booking accepted");
      await fetchDashboard();
    } finally {
      setActionId(null);
    }
  };

  const overview = useMemo(() => {
    const now = new Date();
    const todayBookings = bookings
      .filter((booking) => isSameDay(getSessionStart(booking), now))
      .sort((a, b) => getSessionStart(a).getTime() - getSessionStart(b).getTime());
    const upcomingBookings = bookings.filter((booking) => isUpcomingStatus(booking.status) && getSessionStart(booking) >= startOfMonth(now));
    const pendingBookings = bookings.filter((booking) => booking.status === "pending");
    const completedBookings = bookings.filter((booking) => booking.status === "completed");
    const activeClientIds = new Set(bookings.filter((booking) => ["confirmed", "completed", "awaiting_payment"].includes(booking.status)).map((booking) => typeof booking.userId === "object" ? booking.userId.id : booking.userId));
    const newClientIds = new Set(bookings.filter((booking) => getSessionStart(booking) >= startOfMonth(now)).map((booking) => typeof booking.userId === "object" ? booking.userId.id : booking.userId));
    const returningClientCount = [...activeClientIds].filter((clientId) => bookings.filter((booking) => (typeof booking.userId === "object" ? booking.userId.id : booking.userId) === clientId).length > 1).length;
    const thisMonthCredits = transactions.filter((tx) => tx.type === "credit" && parseISO(tx.createdAt) >= startOfMonth(now)).reduce((sum, tx) => sum + tx.amount, 0);
    const thisYearCredits = transactions.filter((tx) => tx.type === "credit" && parseISO(tx.createdAt) >= startOfYear(now)).reduce((sum, tx) => sum + tx.amount, 0);
    const totalRefunds = transactions.filter((tx) => tx.type === "debit" && tx.description?.toLowerCase().includes("refund")).reduce((sum, tx) => sum + tx.amount, 0);
    const totalWithdrawn = transactions.filter((tx) => tx.type === "debit" && tx.description?.toLowerCase().includes("withdraw")).reduce((sum, tx) => sum + tx.amount, 0);
    const statusDistribution = bookings.reduce<Record<StatusGroup, number>>(
      (acc, booking) => ({ ...acc, [getStatusGroup(booking.status)]: acc[getStatusGroup(booking.status)] + 1 }),
      { completed: 0, upcoming: 0, cancelled: 0, missed: 0 }
    );
    const earningsTrend = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: format(date, "MMM"),
        value: transactions
          .filter((tx) => tx.type === "credit")
          .filter((tx) => {
            const txDate = parseISO(tx.createdAt);
            return txDate.getFullYear() === date.getFullYear() && txDate.getMonth() === date.getMonth();
          })
          .reduce((sum, tx) => sum + tx.amount, 0),
      };
    });
    const activity = [
      ...bookings.slice(0, 8).map((booking) => ({
        id: `booking-${booking.id}`,
        label: `${getClientName(booking)} ${booking.status.replace("_", " ")} session`,
        date: parseISO(booking.updatedAt ?? booking.createdAt),
      })),
      ...transactions.slice(0, 6).map((tx) => ({
        id: `tx-${tx.id}`,
        label: `${tx.type === "credit" ? "Payment credited" : "Wallet debit"}: ${tx.description}`,
        date: parseISO(tx.createdAt),
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);

    return {
      todayBookings,
      upcomingBookings,
      pendingBookings,
      completedBookings,
      activeClients: activeClientIds.size,
      newClients: newClientIds.size,
      returningClientCount,
      completedCount: completedBookings.length,
      thisMonthCredits,
      thisYearCredits,
      pendingPayouts: data?.wallet.pendingBalance ?? 0,
      availableBalance: data?.wallet.availableBalance ?? 0,
      totalWithdrawn,
      totalRefunds,
      statusDistribution,
      earningsTrend,
      activity,
    };
  }, [bookings, transactions, data?.wallet.pendingBalance, data?.wallet.availableBalance]);

  return {
    therapist,
    data,
    availabilityRules,
    reviews,
    loading,
    actionId,
    handleStatusUpdate,
    overview,
  };
};