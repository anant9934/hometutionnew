"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--accent-border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            BODH
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/find-tutor" className="hover:text-[var(--accent)] transition-colors">
              Find Tutor
            </Link>
            <Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors">
              How It Works
            </Link>
            <Link href="/quiz" className="hover:text-[var(--accent)] transition-colors">
              Quiz
            </Link>
            <Link href="/study-material" className="hover:text-[var(--accent)] transition-colors">
              Study Material
            </Link>
            <Link href="/become-a-tutor" className="hover:text-[var(--accent)] transition-colors">
              Become a Tutor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden lg:block text-sm font-medium hover:text-[var(--accent)] transition-colors">
            Sign In
          </Link>
          <Link 
            href="/find-tutor" 
            className={cn(
              "hidden sm:inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[0.95rem] font-medium transition-all focus-visible:outline-none",
              buttonVariants.primary, 
              buttonSizes.sm
            )}
          >
            Find a Tutor
          </Link>
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[var(--background)] border-b border-[var(--accent-border)] p-4 flex flex-col gap-4 shadow-lg">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link href="/find-tutor" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Find Tutor</Link>
            <Link href="/how-it-works" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">How It Works</Link>
            <Link href="/quiz" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Quiz</Link>
            <Link href="/study-material" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Study Material</Link>
            <Link href="/become-a-tutor" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Become a Tutor</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">About</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Contact</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-[var(--accent)]">Sign In</Link>
            <Link 
              href="/find-tutor" 
              onClick={() => setIsOpen(false)}
              className={cn("w-full rounded-[var(--radius-pill)]", buttonVariants.primary, buttonSizes.sm)}
            >
              Find a Tutor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
