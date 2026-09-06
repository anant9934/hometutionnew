import { requireTutor } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { enrollments, studentProfiles, tutorProfiles, studentTopicPerformance, topics } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Users, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function TutorAcademicView() {
  const session = await requireTutor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const tutor = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, userId)
  });

  if (!tutor) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h1 className="text-2xl mb-4">Profile Required</h1>
        <p>Please complete your tutor profile.</p>
      </div>
    );
  }

  // Fetch active enrollments (students currently taught by this tutor)
  const activeStudents = await db.select({
    enrollmentId: enrollments.id,
    studentId: studentProfiles.id,
    studentName: studentProfiles.name,
    class: studentProfiles.class,
    board: studentProfiles.board,
  })
  .from(enrollments)
  .innerJoin(studentProfiles, eq(enrollments.studentId, studentProfiles.id))
  .where(and(eq(enrollments.tutorId, tutor.id), eq(enrollments.status, "ACTIVE")));

  // Extract unique students
  const uniqueStudentsMap = new Map();
  for (const s of activeStudents) {
    if (!uniqueStudentsMap.has(s.studentId)) {
      uniqueStudentsMap.set(s.studentId, s);
    }
  }
  const uniqueStudents = Array.from(uniqueStudentsMap.values());

  // Fetch performance metrics for these students
  const studentIds = uniqueStudents.map(s => s.studentId);
  
  let allPerformances: any[] = [];
  if (studentIds.length > 0) {
    allPerformances = await db.select({
      studentId: studentTopicPerformance.studentId,
      topicName: topics.name,
      accuracy: studentTopicPerformance.averageAccuracy,
      status: studentTopicPerformance.status,
    })
    .from(studentTopicPerformance)
    .innerJoin(topics, eq(studentTopicPerformance.topicId, topics.id))
    // We would use `inArray(studentTopicPerformance.studentId, studentIds)` but we can just fetch all and filter in JS for simplicity
    .orderBy(desc(studentTopicPerformance.updatedAt));
    
    // Filter to only our students
    allPerformances = allPerformances.filter(p => studentIds.includes(p.studentId));
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Academic Tracking
          </h1>
          <p className="text-[var(--foreground-secondary)] mt-2">Monitor the performance and progress of your active students.</p>
        </div>
        <Link href="/tutor-dashboard" className="text-indigo-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      {uniqueStudents.length === 0 ? (
        <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Students</h2>
          <p className="text-[var(--foreground-secondary)]">You don't have any actively enrolled students yet. When your bookings are confirmed and paid, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueStudents.map(student => {
            const studentPerformances = allPerformances.filter(p => p.studentId === student.studentId);
            const weakTopics = studentPerformances.filter(p => p.status === "WEAK");
            const strongTopics = studentPerformances.filter(p => p.status === "STRONG");

            return (
              <div key={student.studentId} className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {student.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{student.studentName}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">{student.class} • {student.board}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                    <h4 className="text-sm font-semibold flex items-center text-red-700 dark:text-red-400 mb-2">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Needs Attention
                    </h4>
                    {weakTopics.length > 0 ? (
                      <ul className="text-sm space-y-1 text-red-900 dark:text-red-300">
                        {weakTopics.map(w => <li key={w.topicName}>• {w.topicName} ({w.accuracy}%)</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-[var(--foreground-secondary)]">No weak areas identified yet.</p>
                    )}
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                    <h4 className="text-sm font-semibold flex items-center text-green-700 dark:text-green-400 mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" /> Strong Areas
                    </h4>
                    {strongTopics.length > 0 ? (
                      <ul className="text-sm space-y-1 text-green-900 dark:text-green-300">
                        {strongTopics.map(s => <li key={s.topicName}>• {s.topicName} ({s.accuracy}%)</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-[var(--foreground-secondary)]">Needs more practice data.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
