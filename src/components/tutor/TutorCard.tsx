import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TutorCard({ tutor }: { tutor: any }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-[var(--background-alt)] rounded-[var(--radius-card)] p-6 border border-[var(--accent-border)] transition-transform hover:-translate-y-[4px] hover:shadow-[var(--shadow-card-hover)]">
      <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-300 rounded-full sm:rounded-2xl flex-shrink-0 overflow-hidden">
        {tutor.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tutor.profileImage} alt={tutor.displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--accent-light)] text-[var(--accent)] font-serif text-2xl">
            {tutor.displayName.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-medium text-xl mb-1">{tutor.displayName}</h3>
        <p className="text-[var(--foreground-secondary)] text-sm mb-2">{tutor.headline}</p>
        <p className="text-[var(--foreground-secondary)] text-xs mb-4">
          {tutor.qualification} • {tutor.experienceYears} Years Exp • {tutor.city}
        </p>
        
        <div className="flex gap-4 mb-4">
          <div>
            <p className="text-xs text-[var(--foreground-secondary)]">Hourly</p>
            <p className="font-medium text-sm">₹{tutor.hourlyRate || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--foreground-secondary)]">Monthly</p>
            <p className="font-medium text-sm">₹{tutor.monthlyStartingRate || "N/A"}</p>
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/tutor/${tutor.slug}`} className={cn(buttonVariants.outline, buttonSizes.sm, "w-full sm:w-auto rounded-[var(--radius-pill)]")}>
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
