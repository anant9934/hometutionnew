import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import BookingModal from "@/components/booking/BookingModal";

export default async function TutorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.slug, slug)
  });

  if (!tutor) {
    notFound();
  }

  // Only allow viewing if VERIFIED or if the current user is the owner / ADMIN
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;

  const isOwner = tutor.userId === userId;
  const isAdmin = userRole === "ADMIN";

  if (tutor.verificationStatus !== "VERIFIED" && !isOwner && !isAdmin) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-[var(--background-alt)] rounded-[var(--radius-card)] p-8 md:p-12 border border-[var(--accent-border)] flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          {tutor.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tutor.profileImage} alt={tutor.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--accent-light)] text-[var(--accent)] font-serif text-5xl">
              {tutor.displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-5xl mb-2">{tutor.displayName}</h1>
          <p className="text-[var(--foreground-secondary)] text-lg mb-6">{tutor.headline}</p>
          <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-8">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">
              {tutor.verificationStatus === "VERIFIED" ? "Verified Tutor" : "Unverified"}
            </span>
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-light)] px-3 py-1 rounded-full border border-[var(--accent-border)]">
              {tutor.experienceYears} Years Exp
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <BookingModal tutorId={tutor.id} type="TRIAL" price={tutor.trialPrice || 0} />
            <BookingModal tutorId={tutor.id} type="MONTHLY" price={tutor.monthlyStartingRate || 0} />
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="font-serif text-2xl mb-4">About Me</h2>
            <p className="text-[var(--foreground-secondary)] whitespace-pre-wrap">
              {tutor.bio || "No bio provided."}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4">Qualifications</h2>
            <p className="text-[var(--foreground-secondary)]">
              {tutor.qualification}
            </p>
          </section>
        </div>
        
        <div className="space-y-8">
          <section className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h3 className="font-medium text-lg mb-4">Service Area</h3>
            <ul className="space-y-2 text-[var(--foreground-secondary)] text-sm">
              <li>{tutor.city} ({tutor.pincode})</li>
            </ul>
          </section>

          <section className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h3 className="font-medium text-lg mb-4">Pricing</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Hourly Rate</p>
                <p className="font-medium text-xl">₹{tutor.hourlyRate || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Monthly Tuition (Starting)</p>
                <p className="font-medium text-xl">₹{tutor.monthlyStartingRate || "N/A"}</p>
              </div>
              {(tutor.trialPrice || 0) > 0 ? (
                <div>
                  <p className="text-sm text-[var(--foreground-secondary)]">Trial Class</p>
                  <p className="font-medium">₹{tutor.trialPrice}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-green-600 font-medium">Free Trial Available</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
