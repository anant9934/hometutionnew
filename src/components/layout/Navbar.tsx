import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--accent-border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            BODH
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <Link href="/find-tutor" className="hover:text-[var(--accent)] transition-colors">
              Find a Tutor
            </Link>
            <Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors">
              How It Works
            </Link>
            <Link href="/become-a-tutor" className="hover:text-[var(--accent)] transition-colors">
              For Tutors
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden md:block text-sm font-medium hover:text-[var(--accent)] transition-colors">
            Log in
          </Link>
          <Link 
            href="/login" 
            className={cn(
              "inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[0.95rem] font-medium transition-all focus-visible:outline-none",
              buttonVariants.primary, 
              buttonSizes.sm
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
