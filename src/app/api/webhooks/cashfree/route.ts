import { NextRequest, NextResponse } from "next/server";
import { CashfreeService } from "@/lib/payments";
import { db } from "@/lib/db";
import { payments, bookings, commissions, webhookEvents, auditLogs, enrollments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { calculateCommission } from "@/lib/utils/money";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    // 1. Verify Signature
    const isValid = CashfreeService.verifyWebhookSignature(rawBody, signature, timestamp);
    if (!isValid) {
      console.error("Invalid Cashfree Webhook Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    
    // Fallback logic to get event ID. Different Cashfree versions might format it differently,
    // but typically it's passed or we can hash the raw payload. If not provided, we use timestamp + orderId.
    const orderId = payload.data?.order?.order_id;
    const eventId = req.headers.get("x-webhook-event-id") || `${orderId}-${timestamp}`;

    if (!orderId) {
      return NextResponse.json({ error: "No order_id in payload" }, { status: 400 });
    }

    // 2. Idempotency Check
    const existingEvent = await db.query.webhookEvents.findFirst({
      where: eq(webhookEvents.eventId, eventId)
    });

    if (existingEvent) {
      console.log(`Webhook event ${eventId} already processed.`);
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // Mark event as being processed
    await db.insert(webhookEvents).values({
      provider: "CASHFREE",
      eventId: eventId,
      eventType: eventType || "UNKNOWN",
      processed: true,
      processedAt: new Date()
    });

    // 3. Process the Event
    const paymentStatus = payload.data?.payment?.payment_status;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK" || paymentStatus === "SUCCESS") {
      const paymentRecord = await db.query.payments.findFirst({
        where: eq(payments.id, orderId) // orderId is our internal payment ID
      });

      if (!paymentRecord || paymentRecord.status === "SUCCESS") {
        return NextResponse.json({ message: "Payment not found or already success" }, { status: 200 });
      }

      const bookingId = paymentRecord.bookingId;
      
      const bookingRecord = await db.query.bookings.findFirst({
        where: eq(bookings.id, bookingId)
      });
      
      if (!bookingRecord) {
        return NextResponse.json({ message: "Booking not found" }, { status: 200 });
      }

      // Update Payment
      await db.update(payments)
        .set({ 
          status: "SUCCESS", 
          providerPaymentId: payload.data?.payment?.cf_payment_id?.toString() || "",
          paidAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(payments.id, paymentRecord.id));

      // Update Booking
      await db.update(bookings)
        .set({ status: "CONFIRMED", updatedAt: new Date() })
        .where(eq(bookings.id, bookingId));

      // Phase 4: Create/Activate Enrollment
      if (bookingRecord.subjectId && bookingRecord.classId) {
        await db.insert(enrollments).values({
          studentId: bookingRecord.studentId,
          tutorId: bookingRecord.tutorId,
          subjectId: bookingRecord.subjectId,
          classId: bookingRecord.classId,
          bookingId: bookingRecord.id,
          status: "ACTIVE",
          startDate: new Date(),
        });

        await db.insert(auditLogs).values({
          action: "ENROLLMENT_ACTIVATED",
          entityType: "ENROLLMENT",
          entityId: bookingRecord.id,
          metadata: JSON.stringify({ bookingId: bookingRecord.id, subjectId: bookingRecord.subjectId })
        });
      }

      // Calculate and Record Commission
      const { commissionAmountPaise, tutorAmountPaise } = calculateCommission(paymentRecord.amountPaise);
      
      await db.insert(commissions).values({
        bookingId: bookingId,
        paymentId: paymentRecord.id,
        tutorId: paymentRecord.tutorId,
        grossAmountPaise: paymentRecord.amountPaise,
        commissionRateBps: 1000, // 10%
        commissionAmountPaise: commissionAmountPaise,
        tutorAmountPaise: tutorAmountPaise,
        status: "EARNED"
      });

      // Audit Log
      await db.insert(auditLogs).values({
        action: "PAYMENT_SUCCESS",
        entityType: "PAYMENT",
        entityId: paymentRecord.id,
        metadata: JSON.stringify({ amountPaise: paymentRecord.amountPaise, commissionPaise: commissionAmountPaise })
      });
      
      
    } else if (eventType === "PAYMENT_FAILED_WEBHOOK" || paymentStatus === "FAILED") {
      // Handle Failure
      await db.update(payments)
        .set({ 
          status: "FAILED", 
          failureMessage: payload.data?.payment?.payment_message || "Unknown error",
          updatedAt: new Date()
        })
        .where(eq(payments.id, orderId));
        
      // We don't necessarily update booking status to FAILED, it stays PAYMENT_PENDING
      // so the student can retry checkout with a new payment intent.
      
      await db.insert(auditLogs).values({
        action: "PAYMENT_FAILED",
        entityType: "PAYMENT",
        entityId: orderId,
        metadata: JSON.stringify({ reason: payload.data?.payment?.payment_message })
      });
    }

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
