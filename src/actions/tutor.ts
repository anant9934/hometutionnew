"use server";

import { requireTutor } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { tutorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { 
  TutorBasicInfoSchema, 
  TutorAboutSchema, 
  TutorQualificationSchema, 
  TutorLocationSchema, 
  TutorPricingSchema,
  TutorProfileCompleteSchema
} from "@/lib/validation/tutor";
import { revalidatePath } from "next/cache";

export async function getTutorProfileDraft() {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const profile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  return profile || null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveTutorDraft(step: string, data: any) {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  // Validate based on step
  let validatedData;
  try {
    switch (step) {
      case "basic":
        validatedData = TutorBasicInfoSchema.parse(data);
        break;
      case "about":
        validatedData = TutorAboutSchema.parse(data);
        break;
      case "qualification":
        validatedData = TutorQualificationSchema.parse(data);
        break;
      case "location":
        validatedData = TutorLocationSchema.parse(data);
        break;
      case "pricing":
        validatedData = TutorPricingSchema.parse(data);
        break;
      default:
        throw new Error("Invalid step");
    }
  } catch (error) {
    return { success: false, error: "Validation failed" };
  }

  // Check if profile exists
  const existingProfile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  try {
    if (existingProfile) {
      await db.update(tutorProfiles)
        .set(validatedData)
        .where(eq(tutorProfiles.id, existingProfile.id));
    } else {
      // Base slug on displayName (fallback logic)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawData = validatedData as any;
      const slugBase = rawData.displayName ? rawData.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'tutor';
      const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

      await db.insert(tutorProfiles).values({
        userId,
        slug,
        displayName: rawData.displayName || "Draft Tutor",
        ...validatedData
      });
    }
    
    revalidatePath("/become-a-tutor/apply");
    return { success: true };
  } catch (error) {
    console.error("Save draft error:", error);
    return { success: false, error: "Failed to save draft" };
  }
}

export async function submitTutorVerification() {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const profile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  // Check if profile is complete
  try {
    TutorProfileCompleteSchema.parse(profile);
  } catch (error) {
    return { success: false, error: "Profile is incomplete. Please finish all steps." };
  }

  // Submit for verification
  try {
    await db.update(tutorProfiles)
      .set({ verificationStatus: "PENDING" })
      .where(eq(tutorProfiles.id, profile.id));
      
    revalidatePath("/tutor-dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit verification" };
  }
}
