import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../../../components/common/Button";
import { AlertCircle, Lock } from "lucide-react";
import paymentService from "../../../services/api/payment.service";

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
  bookingId: string;
  consultationFee?: number;
  platformFee?: number;
  commissionPercentage?: number;
}

/**
 * Professional-grade checkout form with real-time feedback and premium reNove styling.
 */
export const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSuccess, 
  amount, 
  bookingId,
  consultationFee,
  platformFee,
  commissionPercentage
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/sessions?payment_success=true&bookingId=${bookingId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Only verify if Stripe confirms success
      try {
        await paymentService.verifyPayment(bookingId);
        onSuccess();
      } catch (err: unknown) {
        const errorShape = err as { message?: string };
        setErrorMessage(errorShape.message || "Failed to verify payment with our server.");
        setIsProcessing(false);
      }
    } else {
      // Payment is in another state (e.g., processing or requires_action)
      setErrorMessage("Payment status: " + (paymentIntent?.status || "unknown"));
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-display font-semibold text-[var(--fg-primary)] mb-1">Payment Details</h3>
        <p className="text-sm text-[var(--fg-secondary)]">Complete your session reservation</p>
      </div>

      {/* Glassmorphic Billing breakdown display */}
      {consultationFee !== undefined && platformFee !== undefined && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-sm">
          <div className="flex justify-between text-[var(--fg-secondary)]">
            <span>Clinician Session Fee</span>
            <span className="font-medium text-[var(--fg-primary)]">${consultationFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[var(--fg-secondary)]">
            <span>Platform Booking Fee ({commissionPercentage}%)</span>
            <span className="font-medium text-[var(--fg-primary)]">${platformFee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/10 my-1" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-[var(--fg-primary)]">Total Payable</span>
            <span className="text-xl font-extrabold text-[var(--accent-primary)]">${amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Fallback if breakdown not passed */}
      {(consultationFee === undefined || platformFee === undefined) && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <span className="font-bold text-[var(--fg-primary)]">Total Payable</span>
          <span className="text-xl font-extrabold text-[var(--accent-primary)]">${amount.toFixed(2)}</span>
        </div>
      )}

      <PaymentElement />

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-in fade-in zoom-in duration-300">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="pt-4 space-y-4">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          loading={isProcessing}
          className="w-full h-12 shadow-lg"
        >
          <Lock size={18} className="mr-2" />
          Pay Now
        </Button>

        <p className="text-center text-xs text-[var(--fg-muted)] flex items-center justify-center gap-1">
          <Lock size={12} />
          Secured by Stripe. Your data is never stored on our servers.
        </p>
      </div>
    </form>
  );
};
