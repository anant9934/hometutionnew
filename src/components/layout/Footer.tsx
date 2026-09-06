import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--accent-border)] bg-[var(--background-alt)] py-16 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="font-serif text-2xl tracking-tight">BODH</h3>
          <p className="text-sm text-[var(--foreground-secondary)] max-w-xs">
            Find the right tutor. Help your child learn better. Trusted Home Tuition in Patna.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Explore</h4>
          <ul className="space-y-3 text-sm text-[var(--foreground-secondary)]">
            <li><Link href="/find-tutor" className="hover:text-[var(--accent)] transition-colors">Find a Tutor</Link></li>
            <li><Link href="/become-a-tutor" className="hover:text-[var(--accent)] transition-colors">For Tutors</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[var(--accent)] transition-colors">How it Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Academic</h4>
          <ul className="space-y-3 text-sm text-[var(--foreground-secondary)]">
            <li><Link href="/quiz" className="hover:text-[var(--accent)] transition-colors">Quiz</Link></li>
            <li><Link href="/study-material" className="hover:text-[var(--accent)] transition-colors">Study Material</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4 text-xs uppercase tracking-widest text-[var(--accent)]">Company</h4>
          <ul className="space-y-3 text-sm text-[var(--foreground-secondary)]">
            <li><Link href="/about" className="hover:text-[var(--accent)] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-[var(--accent-border)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-[var(--foreground-secondary)] text-center md:text-left">
          {siteConfig.location} • <a href={`mailto:${siteConfig.emails.hello}`} className="hover:text-[var(--accent)]">{siteConfig.emails.hello}</a>
        </div>
        <p className="text-xs text-[var(--foreground-muted)]">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
