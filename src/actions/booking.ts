"use server";

import { requireStudentOrParent, requireTutor } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { bookings, studentProfiles, tutorProfiles, parentProfiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBooking(data: {
  tutorId: string;
  type: "TRIAL" | "HOURLY" | "MONTHLY";
  price: number;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}) {
  const session = await requireStudentOrParent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;

  let studentProfile = null;

  if (role === "STUDENT") {
    studentProfile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId)
    });
  } else if (role === "PARENT") {
    const parentProfile = await db.query.parentProfiles.findFirst({
      where: eq(parentProfiles.userId, userId)
    });
    if (parentProfile) {
      studentProfile = await db.query.studentProfiles.findFirst({
        where: eq(studentProfiles.parentId, parentProfile.id)
      });
    }
  }

  if (!studentProfile) {
    return { success: false, error: "Please complete your student profile first." };
  }

  try {
    await db.insert(bookings).values({
      studentId: studentProfile.id,
      tutorId: data.tutorId,
      type: data.type,
      price: data.price * 100, // convert to paise
      preferredDate: new Date(data.preferredDate),
      preferredTime: data.preferredTime,
      message: data.message,
      status: "PENDING"
    });

    revalidatePath("/dashboard");
    revalidatePath(`/tutor/${data.tutorId}`);
    return { success: true };
  } catch (error) {
    console.error("Booking creation error:", error);
    return { success: false, error: "Failed to create booking request" };
  }
}

export async function acceptBooking(bookingId: string) {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const tutorProfile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  if (!tutorProfile) return { success: false, error: "Tutor profile not found" };

  try {
    await db.update(bookings)
      .set({ status: "ACCEPTED", updatedAt: new Date() })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.tutorId, tutorProfile.id),
        eq(bookings.status, "PENDING")
      ));

    revalidatePath("/tutor-dashboard");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to accept booking:", error);
    return { success: false, error: "Failed to accept booking" };
  }
}

export async function rejectBooking(bookingId: string) {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const tutorProfile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  if (!tutorProfile) return { success: false, error: "Tutor profile not found" };

  try {
    await db.update(bookings)
      .set({ status: "REJECTED", updatedAt: new Date() })
      .where(and(
        eq(bookings.id, bookingId),
        eq(bookings.tutorId, tutorProfile.id),
        eq(bookings.status, "PENDING")
      ));

    revalidatePath("/tutor-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to reject booking:", error);
    return { success: false, error: "Failed to reject booking" };
  }
}
