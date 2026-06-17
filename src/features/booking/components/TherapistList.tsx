import { useState, useEffect } from "react";
import { Star, Info, Search, Loader2 } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { BookingCalendar } from "./BookingCalendar";
import bookingService from "../../../services/api/booking.service";
import toast from "react-hot-toast";

interface Therapist {
  id: string;
  name: string;
  qualification: string;
  specialization: string[];
  experience: number;
  consultationFee: number;
  profileImage?: string;
  bio: string;
  averageRating?: number;
  totalRatings?: number;
}

import { userDashboardService, type ApprovedTherapist } from "../../../services/api/auth.service";
import { TherapistDetailsModal } from "../../user/user-dashboard/components/Therapist-details-modal";

export const TherapistList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [profileTherapist, setProfileTherapist] = useState<ApprovedTherapist | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const response = await userDashboardService.getTherapists(1, 20, debouncedSearch);
        const approvedTherapists = response.data.data?.map((t: ApprovedTherapist & { qualification?: string; _id?: string }) => ({
          id: t.id || t._id || "",
          name: t.name.startsWith("Dr. ") ? t.name : `Dr. ${t.name}`,
          qualification: t.qualification || "Licensed Therapist",
          specialization: t.specialization || [],
          experience: t.experience || 0,
          consultationFee: t.consultationFee || 0,
          profileImage: t.profileImage,
          bio: t.bio || "No bio available.",
          averageRating: t.averageRating ?? 0,
          totalRatings: t.totalRatings ?? 0,
        })) || [];
        setTherapists(approvedTherapists);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, [debouncedSearch]);

  const handleBooking = async (slotId: string) => {
    if (!selectedTherapist) return;

    setIsSubmitting(true);
    try {
      await bookingService.createBooking({
        therapistId: selectedTherapist.id,
        slotId,
        type: "video"
      });
      toast.success("Booking request sent successfully!");
      setIsBooking(false);
      setSelectedTherapist(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMediaUrl = (path: string | undefined) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  return (
    <div className="space-y-6">
      {!isBooking ? (
        <>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or specialty..."
              className="input-field pl-10 w-full text-sm"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-brand-500" />
            </div>
          ) : therapists.length === 0 ? (
            <div className="dash-card p-8 text-center text-sm text-slate-500">
              {search ? "No therapists match your search." : "No therapists are available right now."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapists.map((therapist) => (
            <div key={therapist.id} className="dash-card p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 overflow-hidden shrink-0">
                  {therapist.profileImage ? (
                    <img src={getMediaUrl(therapist.profileImage)} alt={therapist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-500 font-bold text-2xl">
                      {therapist.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{therapist.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star size={14} fill="currentColor" />
                      {(therapist.averageRating ?? 0) > 0 ? therapist.averageRating?.toFixed(1) : "New"}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-brand-500 mb-1">{therapist.qualification}</p>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialization.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-brand-500/5 text-[10px] font-bold text-brand-500 uppercase tracking-tighter">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{therapist.experience} Years</span>
                </div>
                <div className="w-px h-8 bg-slate-100 dark:bg-white/5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">${therapist.consultationFee} / session</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                "{therapist.bio}"
              </p>

              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 text-xs gap-2"
                  onClick={() => setProfileTherapist(therapist as unknown as ApprovedTherapist)}
                >
                  <Info size={14} />
                  Profile
                </Button>
                <Button
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedTherapist(therapist);
                    setIsBooking(true);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <button
            onClick={() => setIsBooking(false)}
            className="text-sm font-bold text-brand-500 hover:underline flex items-center gap-2"
          >
            ← Back to therapists
          </button>

          <div className="dash-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-xl overflow-hidden">
                {selectedTherapist?.profileImage ? (
                  <img src={getMediaUrl(selectedTherapist.profileImage)} alt={selectedTherapist.name} className="w-full h-full object-cover" />
                ) : (
                  selectedTherapist?.name[0]
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Booking with {selectedTherapist?.name}</h2>
                <p className="text-sm text-slate-500">Secure your healing session</p>
              </div>
            </div>

            {selectedTherapist && (
              <BookingCalendar
                therapistId={selectedTherapist.id}
                onSelect={handleBooking}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      )}

      <TherapistDetailsModal
        therapist={profileTherapist}
        isOpen={!!profileTherapist}
        onClose={() => setProfileTherapist(null)}
        onRatingSaved={(therapistId, summary) => {
          setTherapists((current) =>
            current.map((therapist) =>
              therapist.id === therapistId
                ? { ...therapist, averageRating: summary.averageRating, totalRatings: summary.totalRatings }
                : therapist
            )
          );
          setProfileTherapist((current) =>
            current?.id === therapistId ? { ...current, ...summary } : current
          );
        }}
        onBook={(id) => {
          setProfileTherapist(null);
          setSelectedTherapist(therapists.find(t => t.id === id) || null);
          setIsBooking(true);
        }}
      />
    </div>
  );
};
