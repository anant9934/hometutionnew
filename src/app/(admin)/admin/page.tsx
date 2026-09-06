import { requireAdmin } from "@/lib/auth/authorization";
import Link from "next/link";
import { Users, DollarSign, BookOpen } from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <div className="max-w-6xl mx-auto p-4 py-12">
      <h1 className="font-serif text-3xl md:text-5xl tracking-tight mb-8">Admin Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/tutors" className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6 hover:shadow-lg transition flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Manage Tutors</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Review pending applications and manage tutor profiles.</p>
        </Link>

        <Link href="/admin/finance" className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6 hover:shadow-lg transition flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Finance & Commissions</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Track GMV, platform revenue, and process payouts.</p>
        </Link>

        <Link href="/admin/learning" className="bg-white dark:bg-gray-900 border border-[var(--border-primary)] rounded-2xl p-6 hover:shadow-lg transition flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Learning Curriculum</h2>
          <p className="text-sm text-[var(--foreground-secondary)]">Manage subjects, chapters, study materials, and practice quizzes.</p>
        </Link>
      </div>
    </div>
  );
}
