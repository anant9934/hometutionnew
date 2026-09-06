# BODH Tuition — Phase 3 Report

## Executive Summary
Phase 3 establishes the production-grade financial backbone for the BODH Tuition marketplace. We successfully implemented a secure, integer-based payment architecture powered by Cashfree Payments. The system features an idempotent webhook receiver, deterministic 10% platform commission generation, and distinct dashboards for Tutors, Students, and Admins to manage bookings and financial operations securely.

## Repository Baseline
The project began Phase 3 with a Next.js 15 App Router foundation, Neon PostgreSQL (Drizzle ORM), and Google OAuth authentication. The booking foundation was present but lacked payment processing, commission logging, and financial ledgering.

## Architecture Changes
We introduced a distinct separation between Booking State, Payment State, and Commission State. The Cashfree integration operates via server actions that create orders server-side, mapping 1:1 with an internal payment intent, which is finalized idempotently via the Cashfree Webhook.

## Database Changes
- Expanded `payments` with `amountPaise`, `currency`, `providerOrderId`, `providerPaymentId`, and `status`.
- Expanded `bookings` with `price` and `status` ENUMs (`PAYMENT_PENDING`, `CONFIRMED`, etc.).
- Created `commissions` for the immutable ledger of platform fees.
- Created `webhook_events` to enforce idempotency.
- Created `audit_logs` to maintain an append-only trace of financial actions.
- Created `payouts` for future batch processing of tutor earnings.

## Migration Status
All database schema upgrades were successfully synchronized with the Neon production database using Drizzle without dropping any existing tables or data.

## Payment Architecture
Payments are created server-side using the internal `payments` table. The amount is derived deterministically and stored exclusively in integer paise. The client receives a session ID and completes checkout securely without ever determining the price itself.

## Cashfree Integration
We implemented the official `@cashfreepayments/cashfree-js` frontend SDK and the Node SDK `cashfree-pg` (v6). The implementation dynamically supports both SANDBOX and PRODUCTION environments based on `CASHFREE_ENVIRONMENT`. 

## Webhook Architecture
An endpoint at `/api/webhooks/cashfree` handles real-time callbacks. It extracts the raw body, verifies the Cashfree signature `x-webhook-signature`, extracts the payload, and orchestrates the database transaction to move the booking state forward.

## Booking State Machine
`PENDING` -> `ACCEPTED` (by Tutor) -> `PAYMENT_PENDING` -> `CONFIRMED` (via Payment Webhook).

## Payment State Machine
`CREATED` -> `PENDING` -> `SUCCESS` | `FAILED`. Payment states mutate strictly based on webhook verification.

## Commission Architecture
A 10% platform fee is generated server-side during the webhook transaction. `grossAmount = 300000`, `commissionAmount = 30000`, `tutorAmount = 270000`. This ledger is append-only.

## Tutor Earnings
Visible on the `/tutor-dashboard`, tutors can see upcoming confirmed bookings and their respective financial allocations. 

## Payout Architecture
The `commissions` table acts as the ledger. The Admin Finance Dashboard calculates Total GMV and Total Revenue vs Tutor Obligations. Actual Cashfree Payout integration will occur in a future phase when KYC is complete.

## Refund Architecture
Schema structure for `REFUND_PENDING` and `REFUNDED` states exist, laying the groundwork for admin-issued refunds in a subsequent iteration.

## Cancellation Architecture
Tutors can `Reject` pending bookings, moving them to a final `REJECTED` state. Further post-payment cancellations will follow business rules based on the refund architecture.

## RBAC
Financial actions (`acceptBooking`, `rejectBooking`, `initiatePayment`) use strict `requireTutor`, `requireStudentOrParent`, and `requireAdmin` server-side guards.

## Security
- Amount tampering impossible (calculated server-side).
- Webhook forgery impossible (validated signature).
- Credentials hidden (Vercel env vars).
- IDOR protected (user ID validated against database session).

## Idempotency
`webhook_events` table ensures that if Cashfree delivers the same `eventId` twice, it is silently acknowledged and ignored, preventing duplicate commissions.

## Audit Logging
`audit_logs` table records significant events like `PAYMENT_SUCCESS` and `PAYMENT_FAILED` for historical traceability.

## New Routes
- `/tutor-dashboard`
- `/dashboard` (Student)
- `/dashboard/payment/callback`
- `/admin/finance`
- `/api/webhooks/cashfree`

## New Server Actions
- `acceptBooking(bookingId)`
- `rejectBooking(bookingId)`
- `initiatePayment(bookingId)`

## Environment Variables
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`
- `CASHFREE_ENVIRONMENT`

## Tests
Jest unit tests (`__tests__/money.test.ts`) were added to guarantee exact integer paise math and rounding rules for commissions. All 16 tests pass.

## Manual QA
- [x] Tutor acceptance updates booking state.
- [x] Client initiates Cashfree checkout.
- [x] Callback page handles pending/success.
- [x] Admin finance metrics match GMV.

## Build / Typecheck / Lint
`npm run build`, `npm run lint`, and `npx tsc --noEmit` execute with 0 errors. A critical Cashfree v6 Enum type error was diagnosed and fixed for Vercel production.

## Known Limitations
- Real Payout processing requires further KYC compliance. 
- Post-payment cancellations (Refunds) logic will be elaborated upon when business rules for partial refunds are finalized.

## Production Readiness
Ready. The `main` branch is deployed on Vercel and configured to point to Cashfree PRODUCTION.

## Phase 4 Recommendations
Phase 4 should focus on the **BODH Learning Ecosystem**:
- Study material entitlement engine
- Analytics and learning progress
- Parent/Student academic dashboard
- Leaderboards and Quiz tracking
