"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { getDarkMode, setDarkMode } from "@/lib/dark";
import { getQuizHistory } from "@/lib/storage";
import allQuestions from "@/lib/questions.json";
import type { QuizRecord, Question } from "@/lib/types";
import { TOPICS } from "@/lib/topics";

const PAPERS = TOPICS.map((t) => ({ slug: t.slug, label: t.label }));

const COUNTS = [5, 10, 15, 20, 25, 30, 50];

export default function HomePage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [dark, setDark] = useState(false);
  const [paper, setPaper] = useState("paper-1");
  const [section, setSection] = useState("");
  const [count, setCount] = useState(10);

  const qs = allQuestions as Question[];

  const topicCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of qs) {
      map[q.topic] = (map[q.topic] || 0) + 1;
    }
    return map;
  }, [qs]);

  const currentSections = useMemo(() => {
    const t = TOPICS.find((p) => p.slug === paper);
    return t ? t.sections : [];
  }, [paper]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setHistory(getQuizHistory());
    setDark(getDarkMode());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSection("");
  }, [paper]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    setDarkMode(next);
  };

  const bestScore = history.length > 0
    ? Math.max(...history.map((r) => Math.round((r.score / r.total) * 100)))
    : null;

  const params = new URLSearchParams();
  params.set("topic", paper);
  if (section) params.set("section", section);
  params.set("count", String(count));
  const quizUrl = `/quiz?${params.toString()}`;
  const maxForTopic = topicCounts[paper] || 0;

  if (session?.user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <header className="text-center mb-8 relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-balance">Matric English Quiz</h1>
            <p className="text-gray-500 mt-1">Grade 12 English Home Language</p>
            <button onClick={toggleDark} className="absolute top-0 right-0 text-xl rounded-lg p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" aria-label="Toggle dark mode">
              {dark ? "☀️" : "🌙"}
            </button>
          </header>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600 tabular-nums">{qs.length}</p>
              <p className="text-xs text-gray-500 mt-1">Questions</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600 tabular-nums">{history.length}</p>
              <p className="text-xs text-gray-500 mt-1">Quizzes Taken</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-violet-600 tabular-nums">
                {bestScore !== null ? `${bestScore}%` : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Best Score</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-5">Start Quiz</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="paper" className="block text-sm font-medium text-gray-600 mb-2">Paper</label>
                <select
                  id="paper"
                  value={paper}
                  onChange={(e) => setPaper(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {PAPERS.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-600 mb-2">Section</label>
                <select
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">All Sections</option>
                  {currentSections.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="count" className="block text-sm font-medium text-gray-600 mb-2">Questions</label>
                <select
                  id="count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {COUNTS.filter((c) => c <= maxForTopic).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={quizUrl} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors text-center">
                Start Quiz
              </Link>
              <Link href="/quiz?daily=true" className="flex-1 py-3 rounded-lg border border-emerald-300 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors text-center">
                🏆 Daily Quiz
              </Link>
            </div>
          </div>

          <nav aria-label="Main navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href="/search" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">🔍 Search</Link>
            <Link href="/study" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">📖 Study</Link>
            <Link href="/study/topics" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">📚 Study Topics</Link>
            <Link href="/review" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">❌ Review</Link>
            <Link href="/bookmarks" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">★ Bookmarks</Link>
            <Link href="/flagged" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">❓ Flagged</Link>
            <Link href="/analysis" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">📈 Analysis</Link>
            <Link href="/results" className="text-center p-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">📊 History</Link>
          </nav>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
          <span className="text-3xl">📝</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Matric English Quiz</h1>
        <p className="text-emerald-200 text-lg mb-8">
          Practice for Grade 12 English Home Language
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signin"
            className="px-8 py-3 rounded-xl bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Create Account
          </Link>
        </div>
        <p className="text-emerald-300 text-sm mt-8 max-w-sm mx-auto">
          150+ questions across Papers 1, 2 & 3. Track your progress, review mistakes, and prepare with confidence.
        </p>
      </div>
    </main>
  );
}
