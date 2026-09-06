import Link from "next/link";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-[var(--background)]">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.14em] font-medium text-[var(--accent)] mb-6">
            Home Tuition • Patna
          </span>
          <h1 className="font-serif text-[clamp(3.5rem,8vw,6.5rem)] leading-[1.08] tracking-[-0.03em] max-w-4xl mb-8">
            Find the right tutor.<br />Help your child learn better.
          </h1>
          <p className="text-[var(--foreground-secondary)] text-lg md:text-xl max-w-2xl mb-12">
            Verified home tutors for students across Patna — matched around class, subject, location, schedule and learning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/find-tutor" className={cn(buttonVariants.primary, buttonSizes.lg, "rounded-[var(--radius-pill)]")}>
              Find a Tutor
            </Link>
            <Link href="/become-a-tutor" className={cn(buttonVariants.outline, buttonSizes.lg, "rounded-[var(--radius-pill)]")}>
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[var(--background-alt)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.12] tracking-[-0.025em]">
              How it works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", text: "Tell us what the learner needs." },
              { num: "02", text: "Discover suitable tutors." },
              { num: "03", text: "Try a class and choose." },
              { num: "04", text: "Learn consistently." }
            ].map((step) => (
              <div key={step.num} className="bg-[var(--background)] p-8 rounded-[var(--radius-card)] border border-[var(--accent-border)] transition-transform hover:-translate-y-[6px] hover:shadow-[var(--shadow-card-hover)]">
                <span className="text-[var(--accent)] font-serif text-3xl block mb-4">{step.num}</span>
                <p className="font-medium text-lg">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TUTOR PREVIEW */}
      <section className="py-24 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-[0.7rem] uppercase tracking-[0.14em] font-medium text-[var(--accent)] mb-4 block">
                Verified Tutors
              </span>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.12] tracking-[-0.025em] max-w-2xl">
                Meet tutors worth learning from.
              </h2>
            </div>
            <Link href="/find-tutor" className={cn(buttonVariants.ghost, buttonSizes.default)}>
              View all tutors →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Demo Tutor Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--background-alt)] rounded-[var(--radius-card)] p-6 border border-[var(--accent-border)] transition-transform hover:-translate-y-[6px] hover:shadow-[var(--shadow-card-hover)]">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-6"></div>
                <h3 className="font-medium text-xl mb-1">Demo Tutor {i}</h3>
                <p className="text-[var(--foreground-secondary)] text-sm mb-4">Mathematics & Science • Kankarbagh</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">Class 10</span>
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">CBSE</span>
                </div>
                <Link href={`/tutor/demo-tutor-${i}`} className={cn(buttonVariants.outline, "w-full rounded-[var(--radius-pill)]")}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
