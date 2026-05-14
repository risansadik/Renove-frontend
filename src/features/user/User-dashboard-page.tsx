import { useEffect, useState, useCallback } from "react";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.js";
import {
  userDashboardService,
  type DashboardData,
  type ApprovedTherapist,
} from "../../services/api/auth.service.js";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { TherapistDetailsModal } from "./components/Therapist-details-modal.js";
import { HeroSection } from "./components/HeroSection.js";
import { JourneySection } from "./components/JourneySection.js";
import { SupportSection } from "./components/SupportSection.js";
import { ProgressSection } from "./components/ProgressSection.js";

export const UserDashboardPage = () => {
  const user = useAuthStore(selectAuthUser);
  const [data, setData] = useState<DashboardData | null>(null);
  const [therapists, setTherapists] = useState<ApprovedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodSelected, setMoodSelected] = useState<string | null>(null);
  const [moodLogging, setMoodLogging] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<ApprovedTherapist | null>(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, therapistRes] = await Promise.all([
        userDashboardService.getDashboard(),
        userDashboardService.getTherapists(),
      ]);
      setData(dashRes.data.data ?? null);
      setTherapists(therapistRes.data.data ?? []);
      setMoodSelected(dashRes.data.data?.recentMoods?.slice(-1)[0]?.mood ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

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
        setData((prev) => prev ? { ...prev, missions: res.data.data!.missions } : prev);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update mission");
    } finally {
      setTogglingId(null);
    }
  };

  const handleBookTherapist = (_id: string) => {
    toast.success("Booking system coming soon!");
    setSelectedTherapist(null);
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Initializing your recovery world…
          </p>
        </div>
      </div>
    );
  }

  // Determine if user is new (no XP and no streak)
  const isNew = (data?.xp ?? 0) === 0 && (data?.streakDays ?? 0) === 0;

  return (
    <div className="min-h-full overflow-x-hidden" style={{ background: "var(--bg-base)" }}>
      <TherapistDetailsModal
        therapist={selectedTherapist}
        isOpen={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        onBook={handleBookTherapist}
      />

      {/* Section 1: Immersive Hero */}
      <HeroSection data={data} isNew={isNew} greeting={greeting} />

      {/* Section 2: Generated Recovery Journey */}
      <JourneySection
        data={data}
        togglingId={togglingId}
        onToggleMission={handleToggleMission}
      />

      {/* Section 3: AI Companion + Therapist */}
      <SupportSection
        therapists={therapists}
        onSelectTherapist={setSelectedTherapist}
      />

      {/* Section 4: Progress Universe */}
      <ProgressSection
        data={data}
        moodSelected={moodSelected}
        moodLogging={moodLogging}
        onMood={handleMood}
      />
    </div>
  );
};
