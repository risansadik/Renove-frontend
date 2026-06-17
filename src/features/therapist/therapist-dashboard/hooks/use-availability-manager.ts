import { useState, useEffect, useCallback } from "react";
import availabilityService, { type AvailabilityRule } from "../../../../services/api/availability.service";
import toast from "react-hot-toast";

export const useAvailabilityManager = () => {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("Regular Session");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      const res = await availabilityService.getMyAvailabilityRules();
      setRules(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRules();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRules]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const rrule = `FREQ=WEEKLY;BYDAY=${selectedDays.join(",")}`;
      await availabilityService.createAvailability({
        title,
        startTime,
        endTime,
        recurrenceRule: rrule,
        recurrenceType: "weekly",
        startDate: new Date().toISOString(),
      });
      toast.success("Availability rule created successfully!");
      setIsModalOpen(false);
      fetchRules();
      // Reset form
      setSelectedDays([]);
      setStartTime("09:00");
      setEndTime("10:00");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await availabilityService.deleteAvailability(id);
    toast.success("Rule deleted successfully");
    fetchRules();
  };

  return {
    rules,
    loading,
    isModalOpen,
    setIsModalOpen,
    title,
    setTitle,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDays,
    isSubmitting,
    deleteId,
    setDeleteId,
    toggleDay,
    handleSubmit,
    handleDelete,
  };
};