import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { reportVotes, reports } from "../../db/schema.js";

function calcCredibility(upvotes: number, uniqueUpvoters: number, daysSinceCreated: number): number {
  return Math.min(100, upvotes * 10 + uniqueUpvoters * 5 - daysSinceCreated * 2);
}

export async function addVote(userId: string, reportId: string) {
  const [existing] = await db
    .select({ id: reportVotes.id })
    .from(reportVotes)
    .where(and(eq(reportVotes.reportId, reportId), eq(reportVotes.userId, userId)))
    .limit(1);

  if (existing) {
    return { duplicate: true as const };
  }

  const [vote] = await db.insert(reportVotes).values({ reportId, userId }).returning();

  const [report] = await db
    .select({
      upvotes: reports.upvotes,
      uniqueUpvoters: reports.uniqueUpvoters,
      status: reports.status,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .where(eq(reports.id, reportId))
    .limit(1);

  if (!report) return { vote };

  const newUpvotes = report.upvotes + 1;
  const newUniqueUpvoters = report.uniqueUpvoters + 1;
  const daysSinceCreated = Math.floor(
    (Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const credibility = calcCredibility(newUpvotes, newUniqueUpvoters, daysSinceCreated);
  const shouldPromote = credibility >= 30 && report.status === "pending";

  await db
    .update(reports)
    .set({
      upvotes: newUpvotes,
      uniqueUpvoters: newUniqueUpvoters,
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
