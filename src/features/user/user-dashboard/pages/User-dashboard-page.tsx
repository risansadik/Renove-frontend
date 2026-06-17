import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { TherapistDetailsModal } from "../components/Therapist-details-modal";
import { HeroSection } from "../components/Hero-section";
import { JourneySection } from "../components/Journey-section";
import { SupportSection } from "../components/Support-section";
import { ProgressSection } from "../components/Progress-section";
import { TherapistList } from "../../../booking/components/TherapistList";
import { UserSessionsPage } from "../../../booking/User-sessions-page";
import { useUserDashboard } from "../hooks/use-user-dashboard";

export const UserDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
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
  } = useUserDashboard();

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "var(--accent-primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Initializing your recovery world…
          </p>
        </div>
      </div>
    );
  }

  const isTherapistView = location.pathname.endsWith("/therapists");
  const isSessionsView = location.pathname.endsWith("/sessions");

  return (
    <div
      className="min-h-full overflow-x-hidden p-6 md:p-8"
      style={{ background: "var(--bg-base)" }}
    >
      {isTherapistView ? (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Heal with Professionals
            </h1>
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
          <HeroSection
            data={data}
            greeting={greeting}
            isNew={!hasLevels}
            onJourneyClick={() => navigate("/dashboard/journey")}
          />
          <JourneySection
            data={data}
            togglingId={togglingId}
            onToggleMission={handleToggleMission}
          />
          <SupportSection
            therapists={therapists}
            onSelectTherapist={setSelectedTherapist}
          />
          <ProgressSection
            data={data}
            moodSelected={moodSelected}
            moodLogging={moodLogging}
            onMood={handleMood}
          />
          <TherapistDetailsModal
            therapist={selectedTherapist}
            isOpen={!!selectedTherapist}
            onClose={() => setSelectedTherapist(null)}
            onRatingSaved={(therapistId, summary) => {
              setTherapists((current) =>
                current.map((therapist) =>
                  therapist.id === therapistId ? { ...therapist, ...summary } : therapist
                )
              );
              setSelectedTherapist((current) =>
                current?.id === therapistId ? { ...current, ...summary } : current
              );
            }}
            onBook={() => {
              setSelectedTherapist(null);
              window.location.href = "/user/therapists";
            }}
          />
        </>
      )}
    </div>
  );
};