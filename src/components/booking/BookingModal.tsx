"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/booking";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function BookingModal({ tutorId, price, type }: { tutorId: string; price: number; type: "TRIAL" | "HOURLY" | "MONTHLY" }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const result = await createBooking({
      tutorId,
      type,
      price,
      ...formData
    });

    setIsLoading(false);
    
    if (result.success) {
      setIsOpen(false);
      alert("Booking request sent successfully! You can track it in your dashboard.");
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to create booking request");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          type === "TRIAL" ? buttonVariants.primary : buttonVariants.outline,
          "rounded-[var(--radius-pill)] w-full sm:w-auto px-6 py-3"
        )}
      >
        {type === "TRIAL" ? "Request Trial Class" : `Book ${type.toLowerCase()}`}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--background)] w-full max-w-md rounded-[var(--radius-card)] p-6 shadow-xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[var(--foreground-secondary)] hover:text-black"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <h2 className="font-serif text-2xl mb-2">Request Booking</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mb-6">
              You are requesting a {type.toLowerCase()} booking at ₹{price}.
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full p-2 border rounded-md"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message to Tutor (Optional)</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Share any specific topics or goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className={cn(buttonVariants.ghost)}>Cancel</button>
                <button type="submit" disabled={isLoading} className={cn(buttonVariants.primary)}>
                  {isLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
