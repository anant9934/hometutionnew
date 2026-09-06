import { requireAdmin } from "@/lib/auth/authorization";
import { db } from "@/lib/db";
import { payments, commissions, tutorProfiles } from "@/lib/db/schema";
import { eq, desc, sum } from "drizzle-orm";
import { paiseToRupees, formatPaise } from "@/lib/utils/money";

export default async function AdminFinancePage() {
  await requireAdmin();

  // Aggregate Metrics
  // 1. Total GMV (SUCCESS payments)
  const gmvResult = await db.select({ total: sum(payments.amountPaise) })
    .from(payments)
    .where(eq(payments.status, "SUCCESS"));
  const totalGMV = parseInt(gmvResult[0]?.total || "0", 10);

  // 2. Total Commission (EARNED)
  const commissionResult = await db.select({ total: sum(commissions.commissionAmountPaise) })
    .from(commissions)
    .where(eq(commissions.status, "EARNED"));
  const totalCommission = parseInt(commissionResult[0]?.total || "0", 10);

  // Ledger List
  const recentCommissions = await db.select({
    id: commissions.id,
    tutorName: tutorProfiles.displayName,
    grossAmount: commissions.grossAmountPaise,
    commissionAmount: commissions.commissionAmountPaise,
    tutorAmount: commissions.tutorAmountPaise,
    status: commissions.status,
    createdAt: commissions.createdAt
  })
  .from(commissions)
  .leftJoin(tutorProfiles, eq(commissions.tutorId, tutorProfiles.id))
  .orderBy(desc(commissions.createdAt))
  .limit(50);

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="font-serif text-3xl md:text-4xl mb-8">Financial Operations</h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border border-[var(--border-primary)] p-6 rounded-lg bg-[var(--background-secondary)]">
          <p className="text-[var(--foreground-secondary)] mb-2 uppercase text-sm tracking-wider font-semibold">Total GMV</p>
          <p className="text-4xl font-serif">{formatPaise(totalGMV)}</p>
        </div>
        
        <div className="border border-[var(--border-primary)] p-6 rounded-lg bg-green-50 dark:bg-green-900/10">
          <p className="text-[var(--foreground-secondary)] mb-2 uppercase text-sm tracking-wider font-semibold">Total Revenue (10%)</p>
          <p className="text-4xl font-serif text-green-700 dark:text-green-400">{formatPaise(totalCommission)}</p>
        </div>
        
        <div className="border border-[var(--border-primary)] p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
          <p className="text-[var(--foreground-secondary)] mb-2 uppercase text-sm tracking-wider font-semibold">Pending Tutor Payouts</p>
          <p className="text-4xl font-serif text-yellow-700 dark:text-yellow-400">{formatPaise(totalGMV - totalCommission)}</p>
          <p className="text-xs mt-2 opacity-70">Requires manual batch payout</p>
        </div>
      </div>

      {/* Ledger */}
      <h2 className="text-2xl font-semibold mb-4">Commission Ledger</h2>
      <div className="overflow-x-auto border border-[var(--border-primary)] rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] text-sm uppercase text-[var(--foreground-secondary)]">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Tutor</th>
              <th className="p-4 font-semibold text-right">Gross</th>
              <th className="p-4 font-semibold text-right">Platform Fee</th>
              <th className="p-4 font-semibold text-right">Tutor Due</th>
              <th className="p-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentCommissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--foreground-secondary)]">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              recentCommissions.map(comm => (
                <tr key={comm.id} className="border-b border-[var(--border-primary)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors">
                  <td className="p-4 text-sm">{comm.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{comm.tutorName}</td>
                  <td className="p-4 text-right">₹{paiseToRupees(comm.grossAmount)}</td>
                  <td className="p-4 text-right text-green-600 font-medium">₹{paiseToRupees(comm.commissionAmount)}</td>
                  <td className="p-4 text-right text-[var(--foreground-secondary)]">₹{paiseToRupees(comm.tutorAmount)}</td>
                  <td className="p-4 text-center">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase">
                      {comm.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
