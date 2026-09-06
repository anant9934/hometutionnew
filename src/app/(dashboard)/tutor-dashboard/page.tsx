import { requireTutor } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { bookings, studentProfiles, tutorProfiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { acceptBooking, rejectBooking } from "@/actions/booking";
import { paiseToRupees } from "@/lib/utils/money";

export default async function TutorDashboard() {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const tutorProfile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  if (!tutorProfile) {
    return (
      <div className="p-8 text-center">
        <p>Please complete your tutor profile setup first.</p>
      </div>
    );
  }

  // Fetch all bookings for this tutor
  const allBookings = await db.select({
    id: bookings.id,
    type: bookings.type,
    status: bookings.status,
    price: bookings.price,
    preferredDate: bookings.preferredDate,
    preferredTime: bookings.preferredTime,
    message: bookings.message,
    createdAt: bookings.createdAt,
    studentName: studentProfiles.name,
  })
  .from(bookings)
  .leftJoin(studentProfiles, eq(bookings.studentId, studentProfiles.id))
  .where(eq(bookings.tutorId, tutorProfile.id))
  .orderBy(desc(bookings.createdAt));

  const pendingRequests = allBookings.filter(b => b.status === "PENDING");
  const upcomingBookings = allBookings.filter(b => ["ACCEPTED", "PAYMENT_PENDING", "CONFIRMED"].includes(b.status));

  // Server action wrappers to satisfy form action type requirements
  async function handleAccept(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await acceptBooking(id);
  }

  async function handleReject(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await rejectBooking(id);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-8">Tutor Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Pending Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-[var(--foreground-secondary)] bg-[var(--background-secondary)] p-4 rounded-lg">No pending requests.</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req.id} className="border border-[var(--border-primary)] p-4 rounded-lg bg-[var(--background-secondary)]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{req.studentName || "Student"}</h3>
                      <p className="text-sm text-[var(--foreground-secondary)]">{req.type} • ₹{paiseToRupees(req.price)}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase">
                      {req.status}
                    </span>
                  </div>
                  {req.message && (
                    <p className="text-sm mb-4 bg-[var(--background-primary)] p-2 rounded">"{req.message}"</p>
                  )}
                  <p className="text-xs text-[var(--foreground-secondary)] mb-4">
                    Preferred: {req.preferredDate ? new Date(req.preferredDate).toLocaleDateString() : 'N/A'} @ {req.preferredTime || 'N/A'}
                  </p>
                  
                  <div className="flex gap-2">
                    <form action={handleAccept} className="flex-1">
                      <input type="hidden" name="id" value={req.id} />
                      <button className="w-full bg-[var(--accent-primary)] text-[var(--background-primary)] py-2 rounded-lg text-sm font-medium hover:opacity-90">
                        Accept
                      </button>
                    </form>
                    <form action={handleReject} className="flex-1">
                      <input type="hidden" name="id" value={req.id} />
                      <button className="w-full border border-[var(--border-primary)] py-2 rounded-lg text-sm font-medium hover:bg-[var(--background-primary)]">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          {upcomingBookings.length === 0 ? (
            <p className="text-[var(--foreground-secondary)] bg-[var(--background-secondary)] p-4 rounded-lg">No active bookings.</p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(req => (
                <div key={req.id} className="border border-[var(--border-primary)] p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{req.studentName || "Student"}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">{req.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-medium mb-1">₹{paiseToRupees(req.price)}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full uppercase">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
