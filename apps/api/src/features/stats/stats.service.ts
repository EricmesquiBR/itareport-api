import { count, eq, and, gt, lte } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reports, users, reportVotes } from "../../db/schema.js";

export async function getStats() {
  const now = new Date();

  const [totalReports, activeReports, pendingReports, expiredReports, totalUsers, totalVotes] =
    await Promise.all([
      db.select({ value: count() }).from(reports),
      db
        .select({ value: count() })
        .from(reports)
        .where(and(eq(reports.status, "active"), gt(reports.expiresAt, now))),
      db
        .select({ value: count() })
        .from(reports)
        .where(eq(reports.status, "pending")),
      db
        .select({ value: count() })
        .from(reports)
        .where(lte(reports.expiresAt, now)),
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(reportVotes),
    ]);

  return {
    totalReports: Number(totalReports[0]?.value ?? 0),
    activeReports: Number(activeReports[0]?.value ?? 0),
    pendingReports: Number(pendingReports[0]?.value ?? 0),
    expiredReports: Number(expiredReports[0]?.value ?? 0),
    totalUsers: Number(totalUsers[0]?.value ?? 0),
    totalVotes: Number(totalVotes[0]?.value ?? 0),
  };
}
