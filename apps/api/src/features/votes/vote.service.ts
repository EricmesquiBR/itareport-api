import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reportVotes, reports } from "../../db/schema.js";

function calcCredibility(upvotes: number, uniqueUpvoters: number, daysSinceCreated: number): number {
  return Math.max(0, Math.min(100, upvotes * 10 + uniqueUpvoters * 5 - daysSinceCreated * 2));
}

export async function addVote(userId: string, reportId: string) {
  const [reportExists] = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);

  if (!reportExists) {
    return { notFound: true as const };
  }

  const inserted = await db
    .insert(reportVotes)
    .values({ reportId, userId })
    .onConflictDoNothing({ target: [reportVotes.reportId, reportVotes.userId] })
    .returning();

  if (inserted.length === 0) {
    return { duplicate: true as const };
  }

  const vote = inserted[0]!;

  const [report] = await db
    .update(reports)
    .set({
      upvotes: sql`${reports.upvotes} + 1`,
      uniqueUpvoters: sql`${reports.uniqueUpvoters} + 1`,
    })
    .where(eq(reports.id, reportId))
    .returning({
      upvotes: reports.upvotes,
      uniqueUpvoters: reports.uniqueUpvoters,
      status: reports.status,
      createdAt: reports.createdAt,
    });

  if (!report) return { vote };

  const daysSinceCreated = Math.floor(
    (Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const credibility = calcCredibility(report.upvotes, report.uniqueUpvoters, daysSinceCreated);
  const shouldPromote = credibility >= 30 && report.status === "pending";

  await db
    .update(reports)
    .set({
      credibility,
      ...(shouldPromote ? { status: "active" as const } : {}),
    })
    .where(eq(reports.id, reportId));

  return { vote, credibility, promoted: shouldPromote };
}

export async function getVoteCount(reportId: string) {
  const [report] = await db
    .select({ upvotes: reports.upvotes })
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);

  return { upvotes: report?.upvotes ?? 0 };
}
