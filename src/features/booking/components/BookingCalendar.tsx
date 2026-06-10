import { useState, useEffect, useRef, useCallback } from "react";
import { format, addDays, startOfToday, isSameDay, startOfDay, endOfDay } from "date-fns";
import { Clock, Calendar as CalendarIcon, Loader2, Lock } from "lucide-react";
import { Button } from "../../../components/common/Button";
import availabilityService, { type TherapistSlot } from "../../../services/api/availability.service";
import toast from "react-hot-toast";

const LOCK_DURATION_SECONDS = 10 * 60; // 10 minutes

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
  const [lockingSlotId, setLockingSlotId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockedSlotRef = useRef<string | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  // Cleanup timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  // Unlock current slot
  const unlockCurrentSlot = useCallback(async (slotId: string) => {
    try {
      await availabilityService.unlockSlot(slotId);
    } catch {
      // Silently fail — lock will expire naturally
    }
    lockedSlotRef.current = null;
  }, []);

  // Start countdown timer
  const startTimer = useCallback((durationSeconds: number) => {
    clearTimer();
    setTimeLeft(durationSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          // Lock expired — reset selection
          setSelectedSlotId(null);
          lockedSlotRef.current = null;
          toast.error("Slot reservation expired. Please select again.");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  // Fetch slots on date change
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);

      // Unlock previous slot if any when date changes
      if (lockedSlotRef.current) {
        await unlockCurrentSlot(lockedSlotRef.current);
        setSelectedSlotId(null);
        clearTimer();
      }

      try {
        const start = startOfDay(selectedDate).toISOString();
        const end = endOfDay(selectedDate).toISOString();
        const res = await availabilityService.getAvailableSlots(therapistId, start, end);
        setSlots(res.data);
      } catch {
        toast.error("Failed to fetch available slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, therapistId, clearTimer, unlockCurrentSlot]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      if (lockedSlotRef.current) {
        unlockCurrentSlot(lockedSlotRef.current);
      }
    };
  }, [clearTimer, unlockCurrentSlot]);

  const handleSlotClick = async (slotId: string) => {
    // Deselect if clicking the same slot
    if (selectedSlotId === slotId) {
      clearTimer();
      await unlockCurrentSlot(slotId);
      setSelectedSlotId(null);
      return;
    }

    // Unlock previous slot if switching
    if (lockedSlotRef.current && lockedSlotRef.current !== slotId) {
      await unlockCurrentSlot(lockedSlotRef.current);
      clearTimer();
    }

    setLockingSlotId(slotId);
    try {
      await availabilityService.lockSlot(slotId);
      lockedSlotRef.current = slotId;
      setSelectedSlotId(slotId);
      startTimer(LOCK_DURATION_SECONDS);
      toast.success("Slot reserved for 10 minutes");
    } catch {
      const start = startOfDay(selectedDate).toISOString();
      const end = endOfDay(selectedDate).toISOString();

      const res = await availabilityService.getAvailableSlots(
        therapistId,
        start,
        end
      );

      setSlots(res.data);
    }
    finally {
      setLockingSlotId(null);
    }
  };

  const handleBooking = async () => {
    if (selectedSlotId) {
      clearTimer();
      onSelect(selectedSlotId);
    }
  };

  const formatTimeLeft = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                className={`flex flex-col items-center min-w-17.5 py-4 rounded-2xl border-2 transition-all snap-start
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
              const isLocking = lockingSlotId === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  disabled={isLocking}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all relative
                    ${isSelected
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-brand-500/30'}
                    ${isLocking ? 'opacity-60 cursor-wait' : ''}
                  `}
                >
                  {isLocking ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    format(new Date(slot.startTime), "HH:mm")
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Session</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {format(selectedDate, "MMMM d")} at {selectedSlot ? format(new Date(selectedSlot.startTime), "HH:mm") : "--:--"}
          </span>
          {/* Countdown Timer */}
          {timeLeft !== null && (
            <span className={`text-xs font-bold flex items-center gap-1 ${timeLeft <= 60 ? 'text-red-500' : 'text-amber-500'}`}>
              <Lock size={10} />
              Reserved for {formatTimeLeft(timeLeft)}
            </span>
          )}
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