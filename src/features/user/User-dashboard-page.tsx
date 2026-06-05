import { useEffect, useState, useCallback } from "react";
import {
  userDashboardService,
  type DashboardData,
  type ApprovedTherapist,
} from "../../services/api/auth.service.ts";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { TherapistDetailsModal } from "./components/Therapist-details-modal.tsx";
import { HeroSection } from "./components/HeroSection.tsx";
import { JourneySection } from "./components/JourneySection.tsx";
import { SupportSection } from "./components/SupportSection.tsx";
import { ProgressSection } from "./components/ProgressSection.tsx";
import { useLocation, useSearchParams } from "react-router-dom";
import { TherapistList } from "../booking/components/TherapistList.tsx";
import { UserSessionsPage } from "../booking/User-sessions-page.tsx";
import paymentService from "../../services/api/payment.service.ts";

export const UserDashboardPage = () => {
  const location = useLocation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [therapists, setTherapists] = useState<ApprovedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodSelected, setMoodSelected] = useState<string | null>(null);
  const [moodLogging, setMoodLogging] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<ApprovedTherapist | null>(null);

  // In UserDashboardPage or sessions component
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success");
    const bookingId = searchParams.get("bookingId"); // pass this in return_url too

    if (paymentSuccess === "true" && bookingId) {
      paymentService.verifyPayment(bookingId)
        .then(() => {
          toast.success("Payment confirmed! Session booked.");
          setSearchParams({}); 
        })

    }
  }, [searchParams, setSearchParams]);




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
      const mappedTherapists = (therapistRes.data.data ?? []).map((t: ApprovedTherapist) => ({
        ...t,
        name: t.name.startsWith("Dr. ") ? t.name : `Dr. ${t.name}`,
      }));
      setTherapists(mappedTherapists);
      setMoodSelected(dashRes.data.data?.recentMoods?.slice(-1)[0]?.mood ?? null);
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
        setData((prev) => prev ? { ...prev, missions: res.data.data!.missions } : prev);
      }
    } finally {
      setTogglingId(null);
    }
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

  // Determine current view based on path
  const isTherapistView = location.pathname.endsWith("/therapists");
  const isSessionsView = location.pathname.endsWith("/sessions");

  return (
    <div className="min-h-full overflow-x-hidden p-6 md:p-8" style={{ background: "var(--bg-base)" }}>
      {isTherapistView ? (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Heal with Professionals</h1>
            <p className="text-slate-500">Expert guidance for your recovery journey.</p>
          </div>
          <TherapistList />
        </div>
      ) : isSessionsView ? (
        <div className="max-w-5xl mx-auto">
          <UserSessionsPage />
        </div>
      ) : (
        <>
          <HeroSection data={data} greeting={greeting} isNew={false} />
          <JourneySection data={data} togglingId={togglingId} onToggleMission={handleToggleMission} />
          <SupportSection therapists={therapists} onSelectTherapist={setSelectedTherapist} />
          <ProgressSection data={data} moodSelected={moodSelected} moodLogging={moodLogging} onMood={handleMood} />

          <TherapistDetailsModal 
            therapist={selectedTherapist} 
            isOpen={!!selectedTherapist} 
            onClose={() => setSelectedTherapist(null)} 
            onBook={() => {
              setSelectedTherapist(null);
              // In the dashboard overview, booking might navigate to /user/therapists to handle booking state
              window.location.href = "/user/therapists";
            }} 
          />
        </>
      )}
    </div>
  );
};
