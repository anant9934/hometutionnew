import { requireAdmin } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { subjects, chapters, topics, studyMaterials, quizzes } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Book, FileText, HelpCircle, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminLearningDashboard() {
  await requireAdmin();

  // Fetch summary metrics
  const totalSubjects = (await db.select({ count: sql<number>`count(*)` }).from(subjects))[0].count;
  const totalChapters = (await db.select({ count: sql<number>`count(*)` }).from(chapters))[0].count;
  const totalTopics = (await db.select({ count: sql<number>`count(*)` }).from(topics))[0].count;
  
  const allMaterials = await db.select().from(studyMaterials);
  const allQuizzes = await db.select().from(quizzes);

  const publishedMaterials = allMaterials.filter(m => m.isPublished).length;
  const draftMaterials = allMaterials.length - publishedMaterials;

  const publishedQuizzes = allQuizzes.filter(q => q.isPublished).length;
  const draftQuizzes = allQuizzes.length - publishedQuizzes;

  return (
    <div className="max-w-7xl mx-auto p-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-gray-900 dark:text-white">
            Content Manager
          </h1>
          <p className="text-[var(--foreground-secondary)] mt-2">Manage the entire Learning Ecosystem curriculum and resources.</p>
        </div>
        <Link href="/admin" className="text-indigo-600 hover:underline">
          &larr; Back to Admin Home
        </Link>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg"><LayoutDashboard className="w-6 h-6" /></div>
            <span className="text-3xl font-bold">{totalSubjects}</span>
          </div>
          <h3 className="font-medium text-[var(--foreground-secondary)]">Subjects</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg"><Book className="w-6 h-6" /></div>
            <span className="text-3xl font-bold">{totalChapters}</span>
          </div>
          <h3 className="font-medium text-[var(--foreground-secondary)]">Chapters</h3>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg"><FileText className="w-6 h-6" /></div>
            <span className="text-3xl font-bold">{allMaterials.length}</span>
          </div>
          <h3 className="font-medium text-[var(--foreground-secondary)]">Study Materials</h3>
          <p className="text-xs text-gray-500 mt-1">{publishedMaterials} published • {draftMaterials} drafts</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-lg"><HelpCircle className="w-6 h-6" /></div>
            <span className="text-3xl font-bold">{allQuizzes.length}</span>
          </div>
          <h3 className="font-medium text-[var(--foreground-secondary)]">Practice Quizzes</h3>
          <p className="text-xs text-gray-500 mt-1">{publishedQuizzes} published • {draftQuizzes} drafts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Materials Table */}
        <section className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center">
            <h2 className="text-xl font-bold">Study Materials</h2>
            <button className="flex items-center space-x-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
              <Plus className="w-4 h-4" /> <span>Upload New</span>
            </button>
          </div>
          <ul className="divide-y divide-[var(--border-primary)] max-h-96 overflow-y-auto">
            {allMaterials.length === 0 ? (
              <li className="p-6 text-center text-gray-500">No study materials found.</li>
            ) : (
              allMaterials.map(m => (
                <li key={m.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="text-xs text-gray-500">{m.type} • {m.accessLevel}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full uppercase ${m.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {m.isPublished ? "Published" : "Draft"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Quizzes Table */}
        <section className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border-primary)] flex justify-between items-center">
            <h2 className="text-xl font-bold">Quizzes</h2>
            <button className="flex items-center space-x-1 text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition">
              <Plus className="w-4 h-4" /> <span>Create Quiz</span>
            </button>
          </div>
          <ul className="divide-y divide-[var(--border-primary)] max-h-96 overflow-y-auto">
            {allQuizzes.length === 0 ? (
              <li className="p-6 text-center text-gray-500">No quizzes found.</li>
            ) : (
              allQuizzes.map(q => (
                <li key={q.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{q.title}</h3>
                    <p className="text-xs text-gray-500">{q.durationMinutes} mins • {q.totalMarks} marks</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs px-2 py-1 rounded-full uppercase ${q.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {q.isPublished ? "Published" : "Draft"}
                    </span>
                    {!q.isPublished && (
                      <form action={async () => {
                        "use server";
                        const { publishQuizAction } = await import('@/actions/academic');
                        await publishQuizAction(q.id);
                      }}>
                        <button type="submit" className="text-xs text-indigo-600 hover:underline">Publish now</button>
                      </form>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
