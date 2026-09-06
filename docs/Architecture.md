# Architecture (Big Picture)

Maps out the system at a high level (modules, services, data flow). Focuses on the shape of the system, not implementation details.

## Overview
BODH Tuition is a production-grade educational marketplace built using Next.js (App Router). The current architecture is designed to support the Phase 1 UI and lay the groundwork for a scalable backend.

### Frontend
- **Framework**: Next.js App Router (React, TypeScript).
- **Styling**: TailwindCSS configured with a specific UI design system token set (Cream/Amber palette, Playfair Display/Inter typography).
- **State & Routing**: Server Components by default, minimal Client Components for interactivity.

### Backend Services & Foundation (Phase 1)
- **Database**: Neon PostgreSQL via Drizzle ORM (schema definitions established in Phase 1).
- **Authentication**: NextAuth.js v5 using Google Provider. Role-based routing is structurally prepared.
- **Media**: Cloudinary (abstraction layer created for future tutor photo uploads).
- **Payments**: Cashfree (placeholder service abstraction established for Phase 2).

### Deployment
- **Hosting**: Vercel-ready with environment variables safely separated.
