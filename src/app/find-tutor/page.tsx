import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Find a Tutor | Bodh Tuition",
  description: "Search and discover verified home tutors in Patna.",
};

export default function FindTutorPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-28 space-y-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Filters</h3>
            {/* Placeholder for real filters */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <select className="w-full h-10 px-3 rounded-lg border border-[var(--accent-border)] bg-[var(--background-alt)]">
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <select className="w-full h-10 px-3 rounded-lg border border-[var(--accent-border)] bg-[var(--background-alt)]">
                  <option>Anywhere in Patna</option>
                  <option>Kankarbagh</option>
                  <option>Boring Road</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Available Tutors</h1>
        
        {/* Tutor Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-6 bg-[var(--background-alt)] rounded-[var(--radius-card)] p-6 border border-[var(--accent-border)] transition-transform hover:-translate-y-[4px] hover:shadow-[var(--shadow-card-hover)]">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-300 rounded-full sm:rounded-2xl flex-shrink-0"></div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-medium text-xl mb-1">Demo Tutor {i}</h3>
                <p className="text-[var(--foreground-secondary)] text-sm mb-4">Mathematics & Science • Kankarbagh</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">Class 10</span>
                </div>
                <div className="mt-auto">
                  <Link href={`/tutor/demo-tutor-${i}`} className={cn(buttonVariants.outline, buttonSizes.sm, "w-full sm:w-auto rounded-[var(--radius-pill)]")}>
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
