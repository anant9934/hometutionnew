import { requireAdmin } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminTutorsPage() {
  await requireAdmin();

  const tutors = await db.query.tutorProfiles.findMany({
    orderBy: (tutors, { desc }) => [desc(tutors.createdAt)],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif">Tutor Verifications</h1>
      </div>

      <div className="bg-[var(--background)] rounded-[var(--radius-card)] border border-[var(--accent-border)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--background-alt)] border-b border-[var(--accent-border)]">
              <th className="p-4 font-medium text-sm text-[var(--foreground-secondary)]">Name</th>
              <th className="p-4 font-medium text-sm text-[var(--foreground-secondary)]">Status</th>
              <th className="p-4 font-medium text-sm text-[var(--foreground-secondary)]">City</th>
              <th className="p-4 font-medium text-sm text-[var(--foreground-secondary)]">Applied On</th>
              <th className="p-4 font-medium text-sm text-[var(--foreground-secondary)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor.id} className="border-b border-[var(--accent-border)] hover:bg-[var(--background-alt)] transition-colors">
                <td className="p-4 font-medium">{tutor.displayName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    tutor.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                    tutor.verificationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    tutor.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {tutor.verificationStatus}
                  </span>
                </td>
                <td className="p-4 text-sm text-[var(--foreground-secondary)]">{tutor.city}</td>
                <td className="p-4 text-sm text-[var(--foreground-secondary)]">
                  {format(tutor.createdAt, "MMM d, yyyy")}
                </td>
                <td className="p-4">
                  <Link href={`/admin/tutors/${tutor.id}`} className="text-[var(--accent)] hover:underline text-sm font-medium">
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {tutors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--foreground-secondary)]">
                  No tutors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
