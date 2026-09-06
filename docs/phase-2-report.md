# BODH Tuition - Phase 2 Execution Report

## Overview
This document summarizes the execution and architectural decisions made during **Phase 2: Tutor Marketplace Core**. Phase 2 successfully transitioned the platform from a static visual mockup into a fully functional, database-backed, secure application.

## Subsystems Implemented

### 1. Database & Authentication Integration
- **NextAuth Drizzle Adapter**: NextAuth is now strictly bound to the Neon PostgreSQL database. All OAuth sign-ins persist a `user`, `account`, and `session` record.
- **Custom Role Persistence**: The `users` table was modified to adhere to Auth.js requirements while preserving the custom `role` column (`PARENT`, `STUDENT`, `TUTOR`, `ADMIN`).

### 2. Role-Based Access Control (RBAC)
- **Role Selection Engine**: New users authenticating via Google hit a hard authorization wall requiring them to select a role (`Find a Tutor` or `Become a Tutor`) at `/role-selection`.
- **Authorization Helpers**: Centralized `requireRole`, `requireTutor`, and `requireAdmin` functions were implemented to guarantee server-side security across API routes and React Server Components.

### 3. Tutor Onboarding Funnel
- **Multi-step Validation**: A robust 5-step onboarding funnel was implemented using `Zod` schemas (`Basic Info`, `About`, `Qualifications`, `Location`, `Pricing`).
- **Draft Persistence**: The funnel saves drafts progressively to the database (`tutor_profiles` table), enabling tutors to drop off and resume without losing data.
- **Submission**: Final submission flips the `verificationStatus` flag to `PENDING`.

### 4. Admin Verification Workflow
- **Admin Dashboard**: Developed a protected `/admin/tutors` route that queries all tutors by descending application date.
- **Evaluation Sandbox**: Tutors under review possess a detailed breakout of their submitted qualifications, pricing, and bio. 
- **Actions**: Admins can officially `Approve & Publish` or `Reject` tutors. Approved tutors immediately become visible on the public discovery platform.

### 5. Live Discovery & Search Engine
- **Mock Data Elimination**: The `/find-tutor` page was rewired to execute server-side Drizzle queries against the `tutor_profiles` table.
- **Visibility Safeguards**: Queries enforce `isPublished = true` and `verificationStatus = VERIFIED` to guarantee unverified profiles remain hidden.

### 6. Dynamic Public Profiles & Booking Foundation
- **Profile Rendering**: `/tutor/[slug]` dynamically generates SEO-friendly profiles using real database records.
- **Secure Previews**: Only the profile owner or an `ADMIN` can view a profile that lacks the `VERIFIED` status.
- **Booking Engine**: A `BookingModal` client component was integrated. It securely fires Server Actions to insert `PENDING` records into the `bookings` table, establishing the foundation for the upcoming payment logic.

### 7. Secure Cloudinary Strategy
- **Signed Uploads**: Established the `/api/cloudinary/sign` endpoint. This route validates the active session and ensures the user holds a `TUTOR` role before dispensing a cryptographic signature, neutralizing unauthenticated upload vectors.

## Testing & Quality Assurance
- **Jest Suite**: A focused Jest suite was integrated.
  - Validated RBAC redirection logic (`rbac.test.ts`).
  - Proved Zod validation strictness (`validation.test.ts`).
  - Confirmed deterministic search query boundaries (`search.test.ts`).
- **Code Quality**: `npm run lint` and `tsc --noEmit` pass with zero significant architectural warnings.

## Next Steps (Phase 3 Prep)
Phase 2 establishes the core actors (Tutors & Students) and their primary interaction (Booking). Phase 3 will introduce the Cashfree payment gateway integration, parent dashboards, and attendance tracking mechanisms built upon this robust data layer.
