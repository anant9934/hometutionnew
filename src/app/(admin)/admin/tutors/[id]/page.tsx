import { requireAdmin } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import TutorReviewActions from "@/components/admin/TutorReviewActions";

export default async function AdminTutorReviewPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.id, params.id),
  });

  if (!tutor) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/tutors" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] mb-4 inline-block">
          &larr; Back to Tutors
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif mb-2">{tutor.displayName}</h1>
            <p className="text-[var(--foreground-secondary)]">{tutor.headline}</p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              tutor.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
              tutor.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              tutor.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {tutor.verificationStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-[var(--background)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h2 className="text-xl font-medium mb-4">Bio</h2>
            <p className="whitespace-pre-wrap text-[var(--foreground-secondary)]">{tutor.bio}</p>
          </div>

          <div className="bg-[var(--background)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h2 className="text-xl font-medium mb-4">Qualifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Highest Qualification</p>
                <p className="font-medium">{tutor.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Experience</p>
                <p className="font-medium">{tutor.experienceYears} Years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--background)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h2 className="text-xl font-medium mb-4">Contact Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Phone</p>
                <p className="font-medium">{tutor.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Location</p>
                <p className="font-medium">{tutor.city}, {tutor.pincode}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Gender</p>
                <p className="font-medium">{tutor.gender || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)]">
            <h2 className="text-xl font-medium mb-4">Pricing</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Hourly Rate</p>
                <p className="font-medium">₹{tutor.hourlyRate}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-secondary)]">Monthly Rate (Starting)</p>
                <p className="font-medium">₹{tutor.monthlyStartingRate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--background-alt)] p-6 rounded-[var(--radius-card)] border border-[var(--accent-border)] flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg mb-1">Review Actions</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Verify and publish this profile, or reject it.</p>
        </div>
        <TutorReviewActions tutorId={tutor.id} status={tutor.verificationStatus} />
      </div>
    </div>
  );
}
