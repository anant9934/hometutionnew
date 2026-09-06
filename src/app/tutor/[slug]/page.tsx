import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";

// Assuming Next.js 15 App Router dynamic props typing
export default async function TutorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-[var(--background-alt)] rounded-[var(--radius-card)] p-8 md:p-12 border border-[var(--accent-border)] flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-5xl mb-2 capitalize">{slug.replace(/-/g, ' ')}</h1>
          <p className="text-[var(--foreground-secondary)] text-lg mb-6">Expert in Mathematics & Science</p>
          <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-8">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">Verified Tutor</span>
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">5+ Years Exp</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className={cn(buttonVariants.primary, buttonSizes.lg, "rounded-[var(--radius-pill)]")}>
              Book Trial Class
            </button>
            <button className={cn(buttonVariants.outline, buttonSizes.lg, "rounded-[var(--radius-pill)]")}>
              Monthly Tuition
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="font-serif text-2xl mb-4">About Me</h2>
            <p className="text-[var(--foreground-secondary)]">
              This is a placeholder bio for Phase 1. In Phase 2, this will be populated from the database with the tutor&apos;s actual description of their teaching style and experience.
            </p>
          </section>
        </div>
        <div className="space-y-8">
          <section className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h3 className="font-medium text-lg mb-4">Service Areas</h3>
            <ul className="space-y-2 text-[var(--foreground-secondary)] text-sm">
              <li>Kankarbagh</li>
              <li>Rajendra Nagar</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
