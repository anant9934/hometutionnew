import { requireStudentOrParent } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { bookings, tutorProfiles, studentProfiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { paiseToRupees } from "@/lib/utils/money";
import { ClientCheckoutButton } from "./ClientCheckoutButton";

export default async function StudentDashboard() {
  const session = await requireStudentOrParent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const student = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId)
  });

  if (!student) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h1 className="text-2xl mb-4">Complete your Profile</h1>
        <p>Please complete your student profile to view your dashboard.</p>
      </div>
    );
  }

  const allBookings = await db.select({
    id: bookings.id,
    type: bookings.type,
    status: bookings.status,
    price: bookings.price,
    preferredDate: bookings.preferredDate,
    preferredTime: bookings.preferredTime,
    tutorName: tutorProfiles.displayName,
    createdAt: bookings.createdAt,
  })
  .from(bookings)
  .leftJoin(tutorProfiles, eq(bookings.tutorId, tutorProfiles.id))
  .where(eq(bookings.studentId, student.id))
  .orderBy(desc(bookings.createdAt));

  const pendingPayments = allBookings.filter(b => b.status === "ACCEPTED");
  const activeBookings = allBookings.filter(b => b.status === "CONFIRMED" || b.status === "PAYMENT_PENDING");
  const pastRequests = allBookings.filter(b => b.status === "PENDING" || b.status === "REJECTED" || b.status === "CANCELLED");

  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Payments */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          {pendingPayments.length === 0 ? (
            <p className="text-[var(--foreground-secondary)] bg-[var(--background-secondary)] p-4 rounded-lg text-sm">
              No pending payments.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map(req => (
                <div key={req.id} className="border border-[var(--border-primary)] p-4 rounded-lg bg-[var(--background-secondary)]">
                  <h3 className="font-semibold mb-1">Tutor: {req.tutorName}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)] mb-4">{req.type} • ₹{paiseToRupees(req.price)}</p>
                  <ClientCheckoutButton bookingId={req.id} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Bookings */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Active & History</h2>
          
          <h3 className="font-semibold text-lg mb-2">Active</h3>
          {activeBookings.length === 0 ? (
            <p className="text-[var(--foreground-secondary)] bg-[var(--background-secondary)] p-4 rounded-lg text-sm mb-6">
              No active bookings.
            </p>
          ) : (
            <div className="space-y-4 mb-6">
              {activeBookings.map(req => (
                <div key={req.id} className="border border-[var(--border-primary)] p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Tutor: {req.tutorName}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">{req.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-medium mb-1">₹{paiseToRupees(req.price)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full uppercase ${req.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-lg mb-2">Other Requests</h3>
          {pastRequests.length === 0 ? (
            <p className="text-[var(--foreground-secondary)] bg-[var(--background-secondary)] p-4 rounded-lg text-sm">
              No other requests.
            </p>
          ) : (
            <div className="space-y-2">
              {pastRequests.map(req => (
                <div key={req.id} className="border border-[var(--border-primary)] p-3 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                  <div className="text-sm">
                    <span className="font-medium">{req.tutorName}</span> - {req.type}
                  </div>
                  <span className="text-xs text-[var(--foreground-secondary)] uppercase">
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
