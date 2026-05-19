import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const [bookmarks, flagged, quizHistory, attempts, missed, studyProgress, studyBookmarks, studyPlan, studyPlanProgress] =
    await Promise.all([
      prisma.bookmark.findMany({ where: { userId }, select: { questionId: true } }),
      prisma.flagged.findMany({ where: { userId }, select: { questionId: true } }),
      prisma.quizRecord.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 50 }),
      prisma.questionAttempt.findMany({ where: { userId } }),
      prisma.missedQuestion.findMany({ where: { userId }, select: { questionId: true } }),
      prisma.studySectionProgress.findMany({ where: { userId } }),
      prisma.studyBookmark.findMany({ where: { userId }, select: { sectionId: true } }),
      prisma.studyPlan.findUnique({ where: { userId } }),
      prisma.studyPlanProgress.findMany({ where: { userId } }),
    ]);

  const attemptsMap: Record<number, { correct: number; incorrect: number }> = {};
  for (const a of attempts) {
    attemptsMap[a.questionId] = { correct: a.correct, incorrect: a.incorrect };
  }

  const studyProgressMap: Record<string, string[]> = {};
  for (const sp of studyProgress) {
    if (!studyProgressMap[sp.topicSlug]) studyProgressMap[sp.topicSlug] = [];
    studyProgressMap[sp.topicSlug].push(sp.sectionId);
  }

  const planProgressMap: Record<string, number> = {};
  for (const pp of studyPlanProgress) {
    planProgressMap[pp.date] = pp.count;
  }

  return NextResponse.json({
    bookmarks: bookmarks.map((b) => b.questionId),
    flagged: flagged.map((f) => f.questionId),
    quizHistory: quizHistory.map((r) => ({
      date: r.date,
      score: r.score,
      total: r.total,
      topic: r.topic || undefined,
    })),
    attempts: attemptsMap,
    missedQuestions: missed.map((m) => m.questionId),
    studyProgress: studyProgressMap,
    studyBookmarks: studyBookmarks.map((b) => b.sectionId),
    studyPlan: studyPlan ? { startDate: studyPlan.startDate, targetDate: studyPlan.targetDate, days: studyPlan.days } : null,
    studyPlanProgress: planProgressMap,
  });
}

export async function POST(req: Request) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await req.json();
  const { action, payload } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "Authentication required" }, { status: 400 });
  }

  try {
    switch (action) {
      case "toggleBookmark": {
        const existing = await prisma.bookmark.findUnique({
          where: { userId_questionId: { userId, questionId: payload.questionId } },
        });
        if (existing) {
          await prisma.bookmark.delete({ where: { id: existing.id } });
          return NextResponse.json({ bookmarked: false });
        }
        await prisma.bookmark.create({ data: { userId, questionId: payload.questionId } });
        return NextResponse.json({ bookmarked: true });
      }

      case "toggleFlag": {
        const existing = await prisma.flagged.findUnique({
          where: { userId_questionId: { userId, questionId: payload.questionId } },
        });
        if (existing) {
          await prisma.flagged.delete({ where: { id: existing.id } });
          return NextResponse.json({ flagged: false });
        }
        await prisma.flagged.create({ data: { userId, questionId: payload.questionId } });
        return NextResponse.json({ flagged: true });
      }

      case "saveQuizRecord": {
        await prisma.quizRecord.create({
          data: {
            userId,
            date: payload.date,
            score: payload.score,
            total: payload.total,
            topic: payload.topic || null,
            answers: JSON.stringify(payload.answers || []),
          },
        });
        const all = await prisma.quizRecord.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          skip: 50,
        });
        if (all.length > 0) {
          await prisma.quizRecord.deleteMany({
            where: { id: { in: all.map((r) => r.id) } },
          });
        }
        return NextResponse.json({ ok: true });
      }

      case "recordAttempt": {
        const existing = await prisma.questionAttempt.findUnique({
          where: { userId_questionId: { userId, questionId: payload.questionId } },
        });
        if (existing) {
          await prisma.questionAttempt.update({
            where: { id: existing.id },
            data: payload.correct
              ? { correct: existing.correct + 1 }
              : { incorrect: existing.incorrect + 1 },
          });
        } else {
          await prisma.questionAttempt.create({
            data: {
              userId,
              questionId: payload.questionId,
              correct: payload.correct ? 1 : 0,
              incorrect: payload.correct ? 0 : 1,
            },
          });
        }
        return NextResponse.json({ ok: true });
      }

      case "addMissedQuestions": {
        for (const qId of payload.questionIds) {
          await prisma.missedQuestion.upsert({
            where: { userId_questionId: { userId, questionId: qId } },
            create: { userId, questionId: qId },
            update: {},
          });
        }
        return NextResponse.json({ ok: true });
      }

      case "removeMissedQuestion": {
        await prisma.missedQuestion.deleteMany({
          where: { userId, questionId: payload.questionId },
        });
        return NextResponse.json({ ok: true });
      }

      case "clearMissedQuestions": {
        await prisma.missedQuestion.deleteMany({ where: { userId } });
        return NextResponse.json({ ok: true });
      }

      case "markSectionViewed": {
        await prisma.studySectionProgress.upsert({
          where: { userId_sectionId: { userId, sectionId: payload.sectionId } },
          create: { userId, topicSlug: payload.topicSlug, sectionId: payload.sectionId },
          update: {},
        });
        return NextResponse.json({ ok: true });
      }

      case "unmarkSection": {
        await prisma.studySectionProgress.deleteMany({
          where: { userId, sectionId: payload.sectionId },
        });
        return NextResponse.json({ ok: true });
      }

      case "toggleStudyBookmark": {
        const existing = await prisma.studyBookmark.findUnique({
          where: { userId_sectionId: { userId, sectionId: payload.sectionId } },
        });
        if (existing) {
          await prisma.studyBookmark.delete({ where: { id: existing.id } });
          return NextResponse.json({ bookmarked: false });
        }
        await prisma.studyBookmark.create({ data: { userId, sectionId: payload.sectionId } });
        return NextResponse.json({ bookmarked: true });
      }

      case "setStudyPlan": {
        await prisma.studyPlan.upsert({
          where: { userId },
          create: { userId, startDate: payload.startDate, targetDate: payload.targetDate, days: payload.days },
          update: { startDate: payload.startDate, targetDate: payload.targetDate, days: payload.days },
        });
        return NextResponse.json({ ok: true });
      }

      case "clearStudyPlan": {
        await prisma.studyPlan.deleteMany({ where: { userId } });
        return NextResponse.json({ ok: true });
      }

      case "recordStudyDayProgress": {
        await prisma.studyPlanProgress.upsert({
          where: { userId_date: { userId, date: payload.date } },
          create: { userId, date: payload.date, count: payload.count },
          update: { count: payload.count },
        });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("Sync API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
