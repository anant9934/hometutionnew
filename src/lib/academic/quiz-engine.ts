import { db } from "@/lib/db";
import { quizAnswers, quizAttempts, quizOptions, quizQuestions, quizzes, studentTopicPerformance } from "@/lib/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string | null; // null if skipped
}

/**
 * Server-authoritative function to score a quiz attempt.
 * Prevents client-side manipulation of scores and calculates negative marking.
 */
export async function evaluateQuizAttempt(attemptId: string, answers: AnswerSubmission[]) {
  // 1. Fetch attempt and quiz details
  const attempts = await db.select()
    .from(quizAttempts)
    .where(eq(quizAttempts.id, attemptId));
    
  if (attempts.length === 0 || attempts[0].status !== "IN_PROGRESS") {
    throw new Error("Invalid or already submitted attempt");
  }

  const attempt = attempts[0];
  const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, attempt.quizId));
  if (quizRows.length === 0) throw new Error("Quiz not found");
  
  const quiz = quizRows[0];
  const quizId = quiz.id;

  // 2. Fetch authoritative correct answers from DB for this quiz
  // Since we don't have relations defined, we fetch questions and their correct options
  const questions = await db.select({
    id: quizQuestions.id,
    marks: quizQuestions.marks,
    correctOptionId: quizOptions.id
  })
  .from(quizQuestions)
  .leftJoin(quizOptions, and(
    eq(quizQuestions.id, quizOptions.questionId),
    eq(quizOptions.isCorrect, true)
  ))
  .where(eq(quizQuestions.quizId, quizId));

  // Create lookup maps for quick evaluation
  const questionMarksMap = new Map(questions.map(q => [q.id, q.marks]));
  const correctOptionMap = new Map(questions.map(q => [q.id, q.correctOptionId]));
  
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAnswers: any[] = [];

  // 3. Evaluate each submitted answer
  for (const answer of answers) {
    const qMarks = questionMarksMap.get(answer.questionId) || 0;
    const correctOptionId = correctOptionMap.get(answer.questionId);
    
    let isCorrect = false;
    let marksAwarded = 0;

    if (!answer.selectedOptionId) {
      unansweredCount++;
      marksAwarded = 0;
    } else if (answer.selectedOptionId === correctOptionId) {
      isCorrect = true;
      correctCount++;
      marksAwarded = qMarks;
      totalScore += qMarks;
    } else {
      isCorrect = false;
      incorrectCount++;
      marksAwarded = -quiz.negativeMarksPerWrongAnswer;
      totalScore += marksAwarded;
    }

    dbAnswers.push({
      attemptId: attemptId,
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect,
      marksAwarded,
      answeredAt: new Date()
    });
  }

  // Calculate percentage
  const percentage = quiz.totalMarks > 0 ? Math.max(0, Math.round((totalScore / quiz.totalMarks) * 100)) : 0;
  
  // 4. Atomically save answers, update attempt status, and update topic performance
  await db.transaction(async (tx) => {
    // Save answers
    if (dbAnswers.length > 0) {
      await tx.insert(quizAnswers).values(dbAnswers);
    }
    
    // Update attempt
    await tx.update(quizAttempts)
      .set({
        status: "SUBMITTED",
        score: totalScore,
        percentage,
        correctCount,
        incorrectCount,
        unansweredCount,
        submittedAt: new Date(),
      })
      .where(eq(quizAttempts.id, attemptId));

    // Optional: Update topic performance if topicId exists
    if (quiz.topicId) {
      const existingPerfArray = await tx.select()
        .from(studentTopicPerformance)
        .where(and(
          eq(studentTopicPerformance.studentId, attempt.studentId),
          eq(studentTopicPerformance.topicId, quiz.topicId)
        ));

      if (existingPerfArray.length > 0) {
        const existingPerf = existingPerfArray[0];
        const newTotalAttempts = existingPerf.attemptsCount + 1;
        const newTotalCorrect = existingPerf.correctCount + correctCount;
        const newTotalIncorrect = existingPerf.incorrectCount + incorrectCount;
        
        // Simple running average for accuracy
        const currentAccuracy = (correctCount / (correctCount + incorrectCount || 1)) * 100;
        const newAvgAccuracy = Math.round(((existingPerf.averageAccuracy * existingPerf.attemptsCount) + currentAccuracy) / newTotalAttempts);
        
        const newStatus = newAvgAccuracy >= 75 ? "STRONG" : (newAvgAccuracy < 50 ? "WEAK" : "AVERAGE");

        await tx.update(studentTopicPerformance)
          .set({
            attemptsCount: newTotalAttempts,
            correctCount: newTotalCorrect,
            incorrectCount: newTotalIncorrect,
            averageAccuracy: newAvgAccuracy,
            status: newStatus,
            lastAttemptAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(studentTopicPerformance.id, existingPerf.id));
      } else {
        const accuracy = Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100);
        await tx.insert(studentTopicPerformance).values({
          studentId: attempt.studentId,
          topicId: quiz.topicId,
          attemptsCount: 1,
          correctCount,
          incorrectCount,
          averageAccuracy: accuracy,
          status: accuracy >= 75 ? "STRONG" : (accuracy < 50 ? "WEAK" : "AVERAGE"),
          lastAttemptAt: new Date(),
        });
      }
    }
  });

  return {
    score: totalScore,
    percentage,
    correctCount,
    incorrectCount
  };
}
