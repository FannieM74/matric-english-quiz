"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";
import { saveQuizRecord, addMissedQuestions, recordAttempt } from "@/lib/storage";
import { shuffleArray, dateSeed } from "@/lib/random";
import { TOPIC_LABELS } from "@/lib/topics";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";

interface DbQuestion {
  id: number;
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: number | null;
  explanation: string;
  topic: string;
  section: string;
  year: number;
  examSession: string;
  marks?: number | null;
}

interface Passage {
  passageId: number;
  passageTitle: string;
  passageText: string;
  section: string;
  year: number;
  examSession: string;
  questions: DbQuestion[];
}

interface DbResponse {
  passages: Passage[];
  total: number;
}

function shuffleOptions(q: Question): Question {
  if (!q.options || q.options.length === 0) return q;
  const paired = q.options.map((opt, i) => ({ opt, i }));
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return {
    ...q,
    options: paired.map(p => p.opt),
    correctAnswer: paired.findIndex(p => p.i === q.correctAnswer),
  };
}

function isMcq(q: Question): boolean {
  return Array.isArray(q.options) && q.options.length > 0 && q.correctAnswer !== null;
}

function isMcqLike(q: { options: string[]; correctAnswer: number | null }): boolean {
  return Array.isArray(q.options) && q.options.length > 0 && q.correctAnswer !== null;
}

function pickQuestions<T extends { options: string[]; correctAnswer: number | null }>(
  items: T[], count: number, seed: number
): T[] {
  const mcq = [] as T[];
  const open = [] as T[];
  for (const q of items) {
    (isMcqLike(q) ? mcq : open).push(q);
  }
  const shuffleMcq = shuffleArray(mcq, seed);
  const shuffleOpen = shuffleArray(open, seed + 1);
  const needed = Math.min(count, items.length);
  return [...shuffleMcq.slice(0, needed), ...shuffleOpen.slice(0, Math.max(0, needed - shuffleMcq.length))];
}

function QuizContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const section = searchParams.get("section") || "";
  const year = searchParams.get("year") || "";
  const count = parseInt(searchParams.get("count") || "10");
  const returnTo = searchParams.get("returnTo") || "";

  const [seed, setSeed] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<"quiz" | "review">("quiz");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const daily = searchParams.get("daily") === "true";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeed(daily ? dateSeed() : Date.now());
  }, [daily]);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setAnswers({});
      setTextAnswers({});
      setCurrentIndex(0);
      setPhase("quiz");
      try {
        const params = new URLSearchParams();
        if (topic) params.set("topic", topic);
        if (section) params.set("section", section);
        if (year) params.set("year", year);

        const res = await fetch(`/api/questions?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load questions");
        const data: DbResponse = await res.json();

        if (data.total === 0) {
          const qs = allQuestions as Question[];
          let all = qs;
          if (topic) all = all.filter((q) => q.topic === topic);
          if (section) all = all.filter((q) => q.section === section);
          const selected = pickQuestions(all, count, seed).map(shuffleOptions);
          setQuestions(selected);
        } else {
          const flat = data.passages.flatMap((p) => p.questions);
          const selected = (pickQuestions(flat, count, seed) as unknown as Question[]).map(shuffleOptions);
          setQuestions(selected);
        }
      } catch {
        const qs = allQuestions as Question[];
        let all = qs;
        if (topic) all = all.filter((q) => q.topic === topic);
        if (section) all = all.filter((q) => q.section === section);
        const selected = pickQuestions(all, count, seed).map(shuffleOptions);
        setQuestions(selected);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, section, year, count]);

  const handleSelect = (optionIndex: number) => {
    if (!questions[currentIndex]) return;
    const q = questions[currentIndex];
    if (!isMcq(q)) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
  };

  const handleTextChange = (text: string) => {
    if (!questions[currentIndex]) return;
    const q = questions[currentIndex];
    if (isMcq(q)) return;
    setTextAnswers((prev) => ({ ...prev, [q.id]: text }));
  };

  const finishQuiz = () => {
    const mcqScore = questions.filter(q => isMcq(q) && answers[q.id] === q.correctAnswer).length;
    const mcqTotal = questions.filter(q => isMcq(q)).length;
    const missed = questions.filter(q => q.correctAnswer !== null && answers[q.id] !== q.correctAnswer).map((q) => q.id);
    addMissedQuestions(missed);
    questions.forEach((q) => {
      if (q.correctAnswer !== null) {
        recordAttempt(q.id, answers[q.id] === q.correctAnswer);
      }
    });
    saveQuizRecord({
      date: new Date().toLocaleDateString("en-CA"),
      score: mcqScore,
      total: mcqTotal,
      topic: topic || undefined,
    });
    setPhase("review");
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const current = questions[currentIndex];
  const answered = Object.keys(answers).length;
  const textAnswered = Object.keys(textAnswers).length;
  const selected = current ? (answers[current.id] ?? null) : null;
  const currentTextAnswer = current ? (textAnswers[current.id] ?? "") : "";

  const mcqAnswered = questions.filter(q => isMcq(q)).every(q => answers[q.id] !== undefined);
  const allMcqAnswered = mcqAnswered && questions.filter(q => isMcq(q)).length > 0;
  const canFinish = allMcqAnswered;

  const score = questions.filter(q => isMcq(q) && answers[q.id] === q.correctAnswer).length;
  const mcqCount = questions.filter(q => isMcq(q)).length;
  const pct = mcqCount > 0 ? Math.round((score / mcqCount) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 gap-4 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        <p className="text-gray-500 text-sm">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 gap-4 px-4">
        <p className="text-gray-500 text-lg">No questions found</p>
        <Link href="/" className="text-blue-600 hover:underline">Back home</Link>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center mb-8">
            <p className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</p>
            <h1 className={`text-3xl font-bold mb-2 text-balance ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-blue-600" : "text-yellow-600"}`}>
              {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort!" : "Keep practicing!"}
            </h1>
            <p className="text-gray-400 text-sm mb-2">
              {year ? `${year} ` : ""}{TOPIC_LABELS[topic]} · {questions.length} questions
              {questions.length !== mcqCount && ` (${mcqCount} graded)`}
            </p>
            <div className="flex items-center justify-center gap-1 my-4">
              <span className="text-5xl font-bold text-gray-900 tabular-nums">{score}</span>
              <span className="text-2xl text-gray-400">/</span>
              <span className="text-3xl text-gray-500 tabular-nums">{mcqCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 max-w-xs mx-auto overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : "bg-yellow-500"}`}
                style={{ width: `${pct}%` }} />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">{pct}%</p>
            {questions.length !== mcqCount && (
              <p className="text-sm text-gray-400 mb-4">
                + {questions.length - mcqCount} open-ended questions (self-mark)
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Link href={returnTo || "/"} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                {returnTo ? "Back to Study" : "New Quiz"}
              </Link>
              <Link href="/results" className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                History
              </Link>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-balance">Review Answers</h2>
          <div className="space-y-6">
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selected={answers[q.id] ?? null}
                textAnswer={textAnswers[q.id] ?? ""}
                onSelect={handleSelect}
                onTextChange={handleTextChange}
                mode="review"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topicLabel = topic ? ` · ${TOPIC_LABELS[topic]}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link href={returnTo || "/"} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shrink-0">
            ← {returnTo ? "Back to Study" : "Quit"}
          </Link>
          <span className="text-sm text-gray-500 text-right truncate">
            {year ? `${year} ` : ""}{topicLabel} · {answered + textAnswered}/{questions.length}
          </span>
        </div>

        <ProgressBar current={currentIndex} total={questions.length} answered={answered + textAnswered} />

        <div className="mt-6">
          <QuestionCard
            question={current}
            selected={selected}
            textAnswer={currentTextAnswer}
            onSelect={handleSelect}
            onTextChange={handleTextChange}
            mode="quiz"
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={goPrev} disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            ← Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button onClick={goNext}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              Next →
            </button>
          ) : (
            <button onClick={finishQuiz} disabled={!canFinish}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              {canFinish ? "Finish Quiz" : `Answer all MCQ (${questions.filter(q => isMcq(q)).length} left)`}
            </button>
          )}
        </div>

        <div className="flex justify-center mt-4 gap-1.5">
          {questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentIndex(i)}
              aria-label={`Go to question ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                i === currentIndex ? "bg-blue-600 ring-2 ring-blue-300"
                : isMcq(q) && answers[q.id] !== undefined ? "bg-green-400"
                : !isMcq(q) && textAnswers[q.id] ? "bg-amber-400"
                : "bg-gray-300"
              }`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></main>}>
      <QuizContent />
    </Suspense>
  );
}