import { requireStudentOrParent } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { enrollments, studentProfiles, subjects, studentTopicPerformance, topics, parentProfiles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Trophy, Target, BarChart2 } from "lucide-react";

export default async function LearningDashboard() {
  const session = await requireStudentOrParent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;

  let student = null;
  if (role === "STUDENT") {
    student = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId)
    });
  } else if (role === "PARENT") {
    const parent = await db.query.parentProfiles.findFirst({
      where: eq(parentProfiles.userId, userId)
    });
    if (parent) {
      student = await db.query.studentProfiles.findFirst({
        where: eq(studentProfiles.parentId, parent.id)
      });
    }
  }

  if (!student) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h1 className="text-2xl mb-4">Profile Required</h1>
        <p>Please complete your student profile first.</p>
      </div>
    );
  }

  // Fetch active enrollments with their subjects
  const activeEnrollments = await db.select({
    id: enrollments.id,
    subjectName: subjects.name,
    subjectSlug: subjects.slug,
    status: enrollments.status,
  })
  .from(enrollments)
  .innerJoin(subjects, eq(enrollments.subjectId, subjects.id))
  .where(and(eq(enrollments.studentId, student.id), eq(enrollments.status, "ACTIVE")));

  // Fetch performance metrics
  const performance = await db.select({
    topicName: topics.name,
    accuracy: studentTopicPerformance.averageAccuracy,
    status: studentTopicPerformance.status,
    attempts: studentTopicPerformance.attemptsCount,
  })
  .from(studentTopicPerformance)
  .innerJoin(topics, eq(studentTopicPerformance.topicId, topics.id))
  .where(eq(studentTopicPerformance.studentId, student.id))
  .orderBy(desc(studentTopicPerformance.updatedAt))
  .limit(5);

  const weakTopics = performance.filter(p => p.status === "WEAK");

  return (
    <div className="max-w-7xl mx-auto p-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Learning Ecosystem
          </h1>
          <p className="text-[var(--foreground-secondary)] mt-2">Unlock your academic potential with continuous learning.</p>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <Link href="/dashboard/leaderboard" className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - Unlocked Subjects */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            <span>My Unlocked Subjects</span>
          </h2>
          
          {activeEnrollments.length === 0 ? (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 p-8 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-center">
              <p className="text-[var(--foreground-secondary)] mb-4">You don't have any active tuitions yet.</p>
              <Link href="/find-tutor" className="text-indigo-600 font-medium hover:underline">
                Find a Tutor to unlock subjects &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeEnrollments.map(enrollment => (
                <div key={enrollment.id} className="group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--background-secondary)] p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Unlocked
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{enrollment.subjectName}</h3>
                  <div className="flex flex-col space-y-2">
                    <Link href={`/dashboard/learning/${enrollment.subjectSlug}/materials`} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                      <span>Study Materials</span> <span>&rarr;</span>
                    </Link>
                    <Link href={`/dashboard/learning/${enrollment.subjectSlug}/quizzes`} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                      <span>Practice Quizzes</span> <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar - Performance & Recommendations */}
        <section className="lg:col-span-1 space-y-8">
          
          {/* Weak Topics Engine */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/50">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5" />
              <span>Target Weak Areas</span>
            </h2>
            {weakTopics.length === 0 ? (
              <p className="text-sm text-red-600/80 dark:text-red-400/80">No weak topics detected yet. Keep taking quizzes to generate insights!</p>
            ) : (
              <ul className="space-y-3">
                {weakTopics.map(topic => (
                  <li key={topic.topicName} className="bg-white/60 dark:bg-black/20 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-red-900 dark:text-red-200 text-sm">{topic.topicName}</span>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">{topic.accuracy}% avg</span>
                    </div>
                    <div className="w-full bg-red-200 dark:bg-red-900/50 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${topic.accuracy}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Performance */}
          <div className="bg-[var(--background-secondary)] rounded-2xl p-6 border border-[var(--border-primary)]">
            <h2 className="text-lg font-semibold flex items-center space-x-2 mb-4">
              <BarChart2 className="w-5 h-5 text-blue-500" />
              <span>Recent Topic Accuracy</span>
            </h2>
            {performance.length === 0 ? (
              <p className="text-sm text-[var(--foreground-secondary)]">Take a quiz to see your performance metrics.</p>
            ) : (
              <ul className="space-y-4">
                {performance.map((perf, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{perf.topicName}</p>
                      <p className="text-xs text-[var(--foreground-secondary)]">{perf.attempts} attempts</p>
                    </div>
                    <span className={`text-sm font-bold ${perf.accuracy >= 75 ? 'text-green-500' : (perf.accuracy < 50 ? 'text-red-500' : 'text-yellow-500')}`}>
                      {perf.accuracy}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </section>

      </div>
    </div>
  );
}
