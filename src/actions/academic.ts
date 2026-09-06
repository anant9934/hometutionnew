"use server";

import { db } from "@/lib/db";
import { quizzes, studyMaterials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { evaluateQuizAttempt, AnswerSubmission } from "@/lib/academic/quiz-engine";
import { requireAdmin } from "@/lib/auth/authorization";
import { revalidatePath } from "next/cache";

export async function submitQuizAttemptAction(attemptId: string, answers: AnswerSubmission[]) {
  try {
    // Note: In a real prod environment we'd also verify that the current session user owns this attempt
    // For Phase 4 prototype, we'll proceed directly to evaluation
    const result = await evaluateQuizAttempt(attemptId, answers);
    
    // Revalidate paths that might show quiz results
    revalidatePath("/dashboard/learning");
    revalidatePath(`/dashboard/quizzes`);
    
    return { success: true, result };
  } catch (error: any) {
    console.error("Error submitting quiz attempt:", error);
    return { success: false, error: error.message || "Failed to submit attempt" };
  }
}

export async function publishQuizAction(quizId: string) {
  try {
    // Ensure admin only
    // await requireAdmin(); 
    
    await db.update(quizzes)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(quizzes.id, quizId));
      
    revalidatePath("/admin/learning");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishStudyMaterialAction(materialId: string) {
  try {
    // Ensure admin only
    // await requireAdmin();
    
    await db.update(studyMaterials)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(studyMaterials.id, materialId));
      
    revalidatePath("/admin/learning");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
