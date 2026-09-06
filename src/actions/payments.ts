"use server";

import { requireStudentOrParent } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { bookings, payments, studentProfiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { CashfreeService } from "@/lib/payments";

export async function initiatePayment(bookingId: string) {
  const session = await requireStudentOrParent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  // 1. Get student profile
  const student = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId)
  });

  if (!student) {
    return { success: false, error: "Student profile not found." };
  }

  // 2. Fetch the booking and ensure it belongs to this student and is ACCEPTED
  const booking = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.id, bookingId),
      eq(bookings.studentId, student.id),
      eq(bookings.status, "ACCEPTED")
    )
  });

  if (!booking) {
    return { success: false, error: "Booking not found or not in ACCEPTED state." };
  }

  // 3. Create a Payment record in CREATED state
  try {
    const paymentRecord = await db.insert(payments).values({
      bookingId: booking.id,
      payerId: userId,
      tutorId: booking.tutorId,
      amountPaise: booking.price, // already in paise
      status: "CREATED",
      currency: "INR",
      provider: "CASHFREE",
    }).returning();

    const payment = paymentRecord[0];

    // 4. Update Booking status to PAYMENT_PENDING to prevent double-checkout
    await db.update(bookings)
      .set({ status: "PAYMENT_PENDING", updatedAt: new Date() })
      .where(eq(bookings.id, booking.id));

    // 5. Call CashfreeService to get payment session ID
    // We pass our internal payment ID as the Cashfree order_id
    const customerEmail = session.user?.email || "no-reply@bodhtuition.in";
    const paymentIntent = await CashfreeService.createPayment(
      booking.price,
      payment.id,
      userId,
      "9999999999", // Fallback phone, in real app get from parent profile
      customerEmail
    );

    // Note: We don't store paymentSessionId in DB right now, but we return it to client.
    return { 
      success: true, 
      paymentSessionId: paymentIntent.paymentSessionId,
      orderId: payment.id
    };
  } catch (error: any) {
    console.error("Failed to initiate payment:", error);
    return { success: false, error: error.message || "Failed to initiate payment" };
  }
}
