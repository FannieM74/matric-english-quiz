import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") || undefined;
  const section = searchParams.get("section") || undefined;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

  const passages = await prisma.passage.findMany({
    where: {
      topic: topic || undefined,
      section: section || undefined,
      year: year || undefined,
    },
    orderBy: { order: "asc" },
    include: {
      questions: {
        orderBy: { id: "asc" },
      },
    },
  });

  const result = passages.map((p) => ({
    passageId: p.id,
    passageTitle: p.title,
    passageText: p.text,
    section: p.section,
    year: p.year,
    examSession: p.examSession,
    questions: p.questions.map((q) => ({
      id: q.id,
      question: q.question,
      questionType: q.questionType,
      options: q.options ? JSON.parse(q.options) : [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      topic: q.topic,
      section: q.section,
      year: q.year,
      examSession: q.examSession,
      marks: q.marks,
    })),
  }));

  return NextResponse.json({ passages: result, total: passages.reduce((s, p) => s + p.questions.length, 0) });
}