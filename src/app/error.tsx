"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-24 text-center">
      <h2 className="font-serif text-3xl md:text-4xl mb-4">Something went wrong</h2>
      <p className="text-[var(--foreground-secondary)] max-w-md mx-auto mb-8">
        We encountered an unexpected issue. Please try again or contact support if the problem persists.
      </p>
      <button
        onClick={() => reset()}
        className={cn(buttonVariants.primary, "rounded-[var(--radius-pill)]")}
      >
        Try again
      </button>
    </div>
  );
}
