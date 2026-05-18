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
}

/**
 * Professional-grade checkout form with real-time feedback and premium reNove styling.
 */
export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, amount, bookingId }) => {
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
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to verify payment with our server.");
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-display font-semibold text-[var(--fg-primary)]">Payment Details</h3>
          <p className="text-sm text-[var(--fg-secondary)]">Complete your session reservation</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[var(--accent-primary)]">${amount.toFixed(2)}</span>
        </div>
      </div>

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
