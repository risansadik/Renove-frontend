import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { addMinutes, differenceInSeconds } from "date-fns";

interface PaymentTimerProps {
  updatedAt: string;
  onExpire?: () => void;
}

export const PaymentTimer = ({ updatedAt, onExpire }: PaymentTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Expiration is 15 minutes after the booking status was updated to awaiting_payment
    const expirationTime = addMinutes(new Date(updatedAt), 15);
    
    const calculateTimeLeft = () => {
      const diff = differenceInSeconds(expirationTime, new Date());
      if (diff <= 0) {
        setIsExpired(true);
        if (onExpire && !isExpired) onExpire();
        return 0;
      }
      return diff;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [updatedAt, onExpire, isExpired]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md animate-pulse">
        <Timer size={14} />
        Expired
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md">
      <Timer size={14} />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} left
    </div>
  );
};
