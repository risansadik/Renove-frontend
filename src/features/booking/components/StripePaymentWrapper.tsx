import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

interface StripePaymentWrapperProps {
  children: React.ReactNode;
  clientSecret: string;
}
export const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = ({ children, clientSecret }) => {
  const options = useMemo(() => ({
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#c4a8d0',
        colorBackground: '#100818',
        colorText: '#f0ecf5',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  }), [clientSecret]);

  return (
    <div className="glass-card p-6 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    </div>
  );
};
