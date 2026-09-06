"use server";

import { requireAdmin } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveTutor(tutorId: string) {
  await requireAdmin();

  try {
    await db.update(tutorProfiles)
      .set({ 
        verificationStatus: "VERIFIED",
        isPublished: true // Auto publish on verification for now
      })
      .where(eq(tutorProfiles.id, tutorId));
      
    revalidatePath("/admin/tutors");
    revalidatePath(`/admin/tutors/${tutorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to approve tutor:", error);
    return { success: false, error: "Database error" };
  }
}

export async function rejectTutor(tutorId: string, reason: string) {
  await requireAdmin();

  try {
    // In a full implementation, we'd store the reason in a notification or remarks table
    await db.update(tutorProfiles)
      .set({ 
        verificationStatus: "REJECTED",
        isPublished: false
      })
      .where(eq(tutorProfiles.id, tutorId));
      
    revalidatePath("/admin/tutors");
    revalidatePath(`/admin/tutors/${tutorId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reject tutor:", error);
    return { success: false, error: "Database error" };
  }
}
