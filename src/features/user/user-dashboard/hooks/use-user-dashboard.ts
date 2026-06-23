import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  userDashboardService,
  type DashboardData,
  type ApprovedTherapist,
} from "../../../../services/api/auth.service.ts";
import paymentService from "../../../../services/api/payment.service.ts";
import { levelService } from "../../../../services/api/level.service.ts";

export const useUserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<DashboardData | null>(null);
  const [therapists, setTherapists] = useState<ApprovedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLevels, setHasLevels] = useState(false);
  const [moodSelected, setMoodSelected] = useState<string | null>(null);
  const [moodLogging, setMoodLogging] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<ApprovedTherapist | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    const bookingId = searchParams.get("bookingId");

    if (paymentSuccess === "true" && bookingId) {
      paymentService.verifyPayment(bookingId).then(() => {
        toast.success("Payment confirmed! Session booked.");
        setSearchParams({});
      });
    }
  }, [searchParams, setSearchParams]);

  const openNearestTherapist = useCallback(() => {
    if (!navigator.geolocation) {
      window.open(
        "https://www.google.com/maps/search/mental+health+support+center+near+me",
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.open(
          `https://www.google.com/maps/search/mental+health+support+center/@${coords.latitude},${coords.longitude},14z`,
          "_blank",
          "noopener,noreferrer"
        );
      },
      () => {
        window.open(
          "https://www.google.com/maps/search/mental+health+support+center+near+me",
          "_blank",
          "noopener,noreferrer"
        );
      },
      { timeout: 5000 }
    );
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, therapistRes, levelsRes] = await Promise.all([
        userDashboardService.getDashboard(),
        userDashboardService.getTherapists(),
        levelService.getLevels(),
      ]);

      setData(dashRes.data.data ?? null);

      const mappedTherapists = (therapistRes.data.data ?? []).map(
        (t: ApprovedTherapist) => ({
          ...t,
          name: t.name.startsWith("Dr. ") ? t.name : `Dr. ${t.name}`,
        })
      );
      setTherapists(mappedTherapists);
      setMoodSelected(
        dashRes.data.data?.recentMoods?.slice(-1)[0]?.mood ?? null
      );
      setHasLevels((levelsRes.data.data ?? []).length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDashboard]);

  const handleMood = async (mood: string) => {
    if (moodLogging) return;
    setMoodSelected(mood);
    setMoodLogging(true);
    try {
      await userDashboardService.logMood(mood);
      toast.success("Mood logged!");
      await fetchDashboard();
    } catch {
      setMoodSelected(null);
    } finally {
      setMoodLogging(false);
    }
  };

  const handleToggleMission = async (missionId: string) => {
    if (togglingId) return;
    setTogglingId(missionId);
    try {
      const res = await userDashboardService.toggleMission(missionId);
      if (res.data.data) {
        setData((prev) =>
          prev ? { ...prev, missions: res.data.data!.missions } : prev
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  return {
    data,
    therapists,
    setTherapists,
    loading,
    hasLevels,
    moodSelected,
    moodLogging,
    togglingId,
    selectedTherapist,
    setSelectedTherapist,
    greeting,
    handleMood,
    handleToggleMission,
    emergencyOpen,
    setEmergencyOpen,
    openNearestTherapist,
  };
};