import { requireStudentOrParent } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { payments, bookings, tutorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function PaymentCallbackPage({ searchParams }: { searchParams: { order_id?: string } }) {
  await requireStudentOrParent();
  
  const orderId = searchParams.order_id;
  
  if (!orderId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Invalid Request</h1>
        <p>No order ID provided.</p>
        <Link href="/dashboard" className="mt-4 underline">Return to Dashboard</Link>
      </div>
    );
  }

  // Fetch Payment from DB
  const paymentRecord = await db.query.payments.findFirst({
    where: eq(payments.id, orderId),
    with: {
      // Drizzle relational query - assuming relations are set up, but let's use raw joins to be safe if not
    }
  });

  if (!paymentRecord) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Payment Not Found</h1>
        <p>We couldn't find a payment record for this order.</p>
        <Link href="/dashboard" className="mt-4 underline">Return to Dashboard</Link>
      </div>
    );
  }

  const isSuccess = paymentRecord.status === "SUCCESS";
  const isFailed = paymentRecord.status === "FAILED";
  const isPending = paymentRecord.status === "CREATED" || paymentRecord.status === "PENDING";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-24 text-center max-w-md mx-auto">
      {isSuccess && (
        <>
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="font-serif text-3xl mb-2">Payment Successful</h1>
          <p className="text-[var(--foreground-secondary)] mb-8">
            Your booking has been confirmed! The tutor will be notified.
          </p>
        </>
      )}

      {isFailed && (
        <>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h1 className="font-serif text-3xl mb-2">Payment Failed</h1>
          <p className="text-[var(--foreground-secondary)] mb-4">
            {paymentRecord.failureMessage || "There was an issue processing your payment."}
          </p>
          <p className="text-sm mb-8">Please try again from your dashboard.</p>
        </>
      )}

      {isPending && (
        <>
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
          <h1 className="font-serif text-3xl mb-2">Processing Payment</h1>
          <p className="text-[var(--foreground-secondary)] mb-8">
            We are verifying your payment status with the bank. This might take a few moments.
          </p>
          <p className="text-xs text-[var(--foreground-secondary)] mb-8">You can safely leave this page and check your dashboard later.</p>
        </>
      )}

      <Link 
        href="/dashboard" 
        className="block w-full bg-[var(--background-secondary)] border border-[var(--border-primary)] py-3 rounded-lg text-sm font-medium hover:bg-[var(--background-primary)] transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
