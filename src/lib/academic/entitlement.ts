import { db } from "@/lib/db";
import { enrollments, quizzes, studyMaterials } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Checks if a student is actively enrolled in the subject of a specific quiz or study material.
 * This is the server-authoritative gate for all Phase 4 learning content.
 */
export async function canAccessLearningResource(
  studentId: string,
  resourceType: "QUIZ" | "MATERIAL",
  resourceId: string
): Promise<boolean> {
  let subjectId: string | undefined;
  
  if (resourceType === "QUIZ") {
    const quiz = await db.query.quizzes.findFirst({
      where: eq(quizzes.id, resourceId),
      columns: { subjectId: true },
    });
    subjectId = quiz?.subjectId;
  } else if (resourceType === "MATERIAL") {
    const material = await db.query.studyMaterials.findFirst({
      where: eq(studyMaterials.id, resourceId),
      columns: { subjectId: true, accessLevel: true },
    });
    
    // Public materials don't require active enrollment
    if (material?.accessLevel === "PUBLIC") return true;
    
    subjectId = material?.subjectId;
  }

  if (!subjectId) return false;

  // Check for ACTIVE enrollment in that specific subject for this student
  const activeEnrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.studentId, studentId),
      eq(enrollments.subjectId, subjectId),
      eq(enrollments.status, "ACTIVE")
    ),
  });

  return !!activeEnrollment;
}

/**
 * Retrieves all active subject IDs for a given student.
 */
export async function getActiveSubjectIds(studentId: string): Promise<string[]> {
  const activeEnrollments = await db.query.enrollments.findMany({
    where: and(
      eq(enrollments.studentId, studentId),
      eq(enrollments.status, "ACTIVE")
    ),
    columns: { subjectId: true },
  });

  return activeEnrollments.map(e => e.subjectId);
}
