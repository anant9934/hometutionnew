import { Metadata } from "next";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import TutorCard from "@/components/tutor/TutorCard";

export const metadata: Metadata = {
  title: "Find a Tutor | Bodh Tuition",
  description: "Search and discover verified home tutors in Patna.",
};

export default async function FindTutorPage({ searchParams }: { searchParams: { city?: string } }) {
  // Fetch live tutors
  const tutors = await db.query.tutorProfiles.findMany({
    where: and(
      eq(tutorProfiles.isPublished, true),
      eq(tutorProfiles.verificationStatus, "VERIFIED")
    ),
    orderBy: (tutors, { desc }) => [desc(tutors.createdAt)],
  });

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-8">
      {/* Desktop Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-28 space-y-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Filters</h3>
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
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Available Tutors</h1>
        <p className="text-[var(--foreground-secondary)] mb-8">Found {tutors.length} verified tutors</p>
        
        {/* Tutor Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
          
          {tutors.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-[var(--accent-border)] rounded-[var(--radius-card)]">
              <h3 className="text-xl font-medium mb-2">No tutors found</h3>
              <p className="text-[var(--foreground-secondary)]">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
