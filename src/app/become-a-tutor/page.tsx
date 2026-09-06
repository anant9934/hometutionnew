import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Become a Tutor | Bodh Tuition",
  description: "Join BODH to teach students in Patna and build your tutoring career.",
};

export default function BecomeTutorPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="font-serif text-4xl md:text-5xl mb-6">Teach students who are looking for you.</h1>
      <p className="text-[var(--foreground-secondary)] text-lg mb-12 max-w-2xl mx-auto">
        Reach students in Patna, manage tuition opportunities, build a professional profile, and grow through recurring tuition.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
        <div className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)]">
          <h3 className="font-medium text-lg mb-2">Build a Profile</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Showcase your experience, subjects, and teaching style to parents.</p>
        </div>
        <div className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)]">
          <h3 className="font-medium text-lg mb-2">Get Verified</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Stand out by completing our verification process.</p>
        </div>
        <div className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)]">
          <h3 className="font-medium text-lg mb-2">Earn Consistently</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Manage your schedule and earn through monthly and hourly tuitions.</p>
        </div>
      </div>
      <button className={cn(buttonVariants.primary, buttonSizes.lg, "rounded-[var(--radius-pill)]")}>
        Apply to Teach
      </button>
    </div>
  );
}
