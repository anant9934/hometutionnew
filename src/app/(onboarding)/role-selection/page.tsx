"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/actions/auth";
import { cn } from "@/lib/utils";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async (role: "PARENT" | "TUTOR") => {
    setIsLoading(role);
    setError(null);
    
    const result = await updateUserRole(role);
    
    if (result.success) {
      if (role === "TUTOR") {
        router.push("/become-a-tutor/apply"); // Onboarding funnel
      } else {
        router.push("/find-tutor");
      }
    } else {
      setError(result.error || "Something went wrong.");
      setIsLoading(null);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[var(--background-alt)]">
      <div className="max-w-2xl w-full bg-[var(--background)] p-8 md:p-12 rounded-[var(--radius-card)] shadow-sm border border-[var(--accent-border)]">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">Welcome to BODH</h1>
          <p className="text-[var(--foreground-secondary)]">How will you use the platform?</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelectRole("PARENT")}
            disabled={!!isLoading}
            className={cn(
              "flex flex-col items-center p-8 border-2 border-[var(--accent-light)] rounded-[var(--radius-card)] transition-all text-left group",
              "hover:border-[var(--accent)] hover:bg-[var(--accent-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
              isLoading === "PARENT" && "opacity-70 pointer-events-none"
            )}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
            <h3 className="font-serif text-xl mb-2 text-center">Find a Tutor</h3>
            <p className="text-sm text-[var(--foreground-secondary)] text-center">
              I am a parent or student looking for trusted home tuition in Patna.
            </p>
            
            {isLoading === "PARENT" && (
              <div className="mt-6 text-[var(--accent)] text-sm animate-pulse">Setting up...</div>
            )}
          </button>

          <button
            onClick={() => handleSelectRole("TUTOR")}
            disabled={!!isLoading}
            className={cn(
              "flex flex-col items-center p-8 border-2 border-[var(--accent-light)] rounded-[var(--radius-card)] transition-all text-left group",
              "hover:border-[var(--accent)] hover:bg-[var(--accent-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
              isLoading === "TUTOR" && "opacity-70 pointer-events-none"
            )}
          >
            <div className="w-16 h-16 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h3 className="font-serif text-xl mb-2 text-center">Become a Tutor</h3>
            <p className="text-sm text-[var(--foreground-secondary)] text-center">
              I am a teacher looking to discover students and manage my tuition.
            </p>

            {isLoading === "TUTOR" && (
              <div className="mt-6 text-[var(--accent)] text-sm animate-pulse">Setting up...</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
