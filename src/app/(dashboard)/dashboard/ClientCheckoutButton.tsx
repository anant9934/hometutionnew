"use client";

import { useState } from "react";
import { initiatePayment } from "@/actions/payments";
// @ts-expect-error - missing types for cashfree-js
import { load } from "@cashfreepayments/cashfree-js";

export function ClientCheckoutButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await initiatePayment(bookingId);
      if (!res.success || !res.paymentSessionId) {
        setError(res.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // Initialize Cashfree Checkout
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" ? "production" : "sandbox"
      });

      const checkoutOptions = {
        paymentSessionId: res.paymentSessionId,
        redirectTarget: "_self", // Redirects the current page
      };

      cashfree.checkout(checkoutOptions);
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="w-full bg-[var(--accent-primary)] text-[var(--background-primary)] py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
