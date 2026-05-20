import { useState, useEffect } from "react";
import { format, addDays, startOfToday, isSameDay, startOfDay, endOfDay } from "date-fns";
import { Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "../../../components/common/Button";
import availabilityService, { type TherapistSlot } from "../../../services/api/availability.service";
import toast from "react-hot-toast";

interface BookingCalendarProps {
  therapistId: string;
  onSelect: (slotId: string) => void;
  isLoading?: boolean;
}

export const BookingCalendar = ({ therapistId, onSelect, isLoading }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [slots, setSlots] = useState<TherapistSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const start = startOfDay(selectedDate).toISOString();
        const end = endOfDay(selectedDate).toISOString();
        const res = await availabilityService.getAvailableSlots(therapistId, start, end);
        setSlots(res.data);
        setSelectedSlotId(null); // Reset selection on date change
      } catch {
        toast.error("Failed to fetch available slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, therapistId]);

  const handleBooking = () => {
    if (selectedSlotId) {
      onSelect(selectedSlotId);
    }
  };

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ... rest of the component remains the same ... */}
      {/* Date Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-brand-500" />
            Select Date
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar snap-x">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center min-w-[70px] py-4 rounded-2xl border-2 transition-all snap-start
                  ${isSelected
                    ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10'
                    : 'border-slate-100 dark:border-white/5 hover:border-brand-500/30'}
                `}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">
                  {format(day, "EEE")}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-brand-500' : 'text-slate-900 dark:text-white'}`}>
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={20} className="text-brand-500" />
          Available Slots
        </h3>

        {loadingSlots ? (
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-500" size={24} />
          </div>
        ) : slots.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">No slots available for this day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(isSelected ? null : slot.id)}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all
                    ${isSelected
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-brand-500/30'}
                  `}
                >
                  {format(new Date(slot.startTime), "HH:mm")}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Session</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {format(selectedDate, "MMMM d")} at {selectedSlot ? format(new Date(selectedSlot.startTime), "HH:mm") : "--:--"}
          </span>
        </div>
        <Button
          onClick={handleBooking}
          disabled={!selectedSlotId || isLoading}
          loading={isLoading}
          className="px-8"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};
