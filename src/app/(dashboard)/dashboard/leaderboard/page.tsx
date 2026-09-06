import { requireStudentOrParent } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { studentTopicPerformance, studentProfiles } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { Trophy, Medal, Award } from "lucide-react";
import Link from "next/link";

export default async function LeaderboardPage() {
  const session = await requireStudentOrParent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id;

  const currentStudent = await db.query.studentProfiles.findFirst({
    where: eq(studentProfiles.userId, userId)
  });

  // Calculate real-time leaderboard based on total correct answers across all topics
  // Since we aren't using the full relations, we'll aggregate using raw SQL or Drizzle's SQL builder
  const leaderboardData = await db.select({
    studentId: studentTopicPerformance.studentId,
    studentName: studentProfiles.name,
    totalPoints: sql<number>`sum(${studentTopicPerformance.correctCount}) * 10`, // 10 points per correct answer
    accuracy: sql<number>`avg(${studentTopicPerformance.averageAccuracy})`
  })
  .from(studentTopicPerformance)
  .innerJoin(studentProfiles, eq(studentTopicPerformance.studentId, studentProfiles.id))
  .groupBy(studentTopicPerformance.studentId, studentProfiles.name)
  .orderBy(sql`sum(${studentTopicPerformance.correctCount}) DESC`)
  .limit(10);

  return (
    <div className="max-w-4xl mx-auto p-4 py-12">
      <div className="flex flex-col items-center mb-10 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight font-bold text-gray-900 dark:text-white">
          Global Leaderboard
        </h1>
        <p className="text-[var(--foreground-secondary)] mt-2 max-w-xl">
          Compete with students across BODH Tuition. Earn points by practicing topics and maintaining high accuracy!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-[var(--border-primary)]">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-6 w-1/2">
            <span className="w-8 text-center">Rank</span>
            <span>Student</span>
          </div>
          <div className="flex items-center space-x-6 w-1/2 justify-end">
            <span className="w-24 text-right">Accuracy</span>
            <span className="w-24 text-right">Points</span>
          </div>
        </div>
        
        <ul className="divide-y divide-[var(--border-primary)]">
          {leaderboardData.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No data available yet. Start practicing!</li>
          ) : (
            leaderboardData.map((entry, index) => {
              const isCurrentUser = currentStudent && entry.studentId === currentStudent.id;
              let rankIcon = null;
              
              if (index === 0) rankIcon = <Medal className="w-6 h-6 text-yellow-500" />;
              else if (index === 1) rankIcon = <Medal className="w-6 h-6 text-gray-400" />;
              else if (index === 2) rankIcon = <Medal className="w-6 h-6 text-amber-700" />;
              else rankIcon = <span className="font-bold text-gray-400">{index + 1}</span>;

              return (
                <li key={entry.studentId} className={`flex items-center justify-between p-4 transition-colors ${isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                  <div className="flex items-center space-x-6 w-1/2">
                    <div className="w-8 flex justify-center">{rankIcon}</div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${isCurrentUser ? 'bg-indigo-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                        {entry.studentName.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-medium ${isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                        {entry.studentName} {isCurrentUser && "(You)"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 w-1/2 justify-end">
                    <span className="w-24 text-right text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(entry.accuracy)}%
                    </span>
                    <span className="w-24 text-right font-bold text-lg text-amber-600 dark:text-amber-400">
                      {entry.totalPoints}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link href="/dashboard/learning" className="text-indigo-600 font-medium hover:underline flex items-center justify-center space-x-2">
          <span>&larr;</span> <span>Back to Learning Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
