import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-24 text-center">
      <h2 className="font-serif text-5xl md:text-7xl mb-4 text-[var(--accent)]">404</h2>
      <h3 className="font-serif text-2xl md:text-3xl mb-4">This page seems to have taken a different route.</h3>
      <p className="text-[var(--foreground-secondary)] max-w-md mx-auto mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className={cn(buttonVariants.primary, "rounded-[var(--radius-pill)]")}
        >
          Return Home
        </Link>
        <Link
          href="/find-tutor"
          className={cn(buttonVariants.outline, "rounded-[var(--radius-pill)]")}
        >
          Find a Tutor
        </Link>
      </div>
    </div>
  );
}
