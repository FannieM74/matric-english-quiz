"use client";

import type { QuizRecord } from "@/lib/types";
import allQuestions from "@/lib/questions.json";
import type { Question } from "@/lib/types";

const BOOKMARKS_KEY = "sc200-bookmarks";
const HISTORY_KEY = "sc200-history";
const MISSED_KEY = "sc200-missed";
const FLAGGED_KEY = "sc200-flagged";
const ATTEMPTS_KEY = "sc200-attempts";
const DEVICE_ID_KEY = "sc200-device-id";
const SYNCED_KEY = "sc200-synced";
const STORAGE_VERSION = 2;
const VERSION_KEY = "sc200-version";

let _deviceId: string | null = null;

function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  if (_deviceId) return _deviceId;
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    _deviceId = id;
    return id;
  } catch {
    return "fallback";
  }
}

function ensureStorageVersion(): void {
  if (typeof window === "undefined") return;
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v !== String(STORAGE_VERSION)) {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("sc200-") && key !== VERSION_KEY && key !== DEVICE_ID_KEY) {
          localStorage.removeItem(key);
        }
      }
      localStorage.setItem(VERSION_KEY, String(STORAGE_VERSION));
    }
  } catch {}
}

function apiCall(action: string, payload: unknown): void {
  const deviceId = getDeviceId();
  fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, action, payload }),
  }).catch(() => {});
}

export async function syncFromApi(): Promise<void> {
  if (typeof window === "undefined") return;
  const deviceId = getDeviceId();
  try {
    const res = await fetch(`/api/sync?deviceId=${encodeURIComponent(deviceId)}`);
    if (!res.ok) return;
    const data = await res.json();
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(data.flagged));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(data.quizHistory));
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data.attempts));
    localStorage.setItem(MISSED_KEY, JSON.stringify(data.missedQuestions));
    localStorage.setItem("sc200-study-progress", JSON.stringify(data.studyProgress));
    localStorage.setItem("sc200-study-bookmarks", JSON.stringify(data.studyBookmarks));
    if (data.studyPlan) {
      localStorage.setItem("sc200-study-plan", JSON.stringify(data.studyPlan));
    }
    localStorage.setItem("sc200-study-plan-progress", JSON.stringify(data.studyPlanProgress));
    localStorage.setItem(SYNCED_KEY, "true");
  } catch {}
}

// -- Bookmarks --
export function getBookmarks(): number[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
  } catch { return []; }
}

export function toggleBookmark(id: number): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(id);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    apiCall("toggleBookmark", { questionId: id });
    return false;
  }
  bookmarks.push(id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  apiCall("toggleBookmark", { questionId: id });
  return true;
}

export function isBookmarked(id: number): boolean {
  return new Set(getBookmarks()).has(id);
}

// -- Quiz History --
export function saveQuizRecord(record: QuizRecord): void {
  const history = getQuizHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  apiCall("saveQuizRecord", { ...record, answers: [] });
}

export function getQuizHistory(): QuizRecord[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch { return []; }
}

// -- Missed Questions --
export function getMissedQuestions(): number[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(MISSED_KEY) || "[]");
  } catch { return []; }
}

export function addMissedQuestions(ids: number[]): void {
  const missed = new Set(getMissedQuestions());
  for (const id of ids) missed.add(id);
  localStorage.setItem(MISSED_KEY, JSON.stringify(Array.from(missed)));
  apiCall("addMissedQuestions", { questionIds: ids });
}

export function removeMissedQuestion(id: number): void {
  const missed = getMissedQuestions().filter((x) => x !== id);
  localStorage.setItem(MISSED_KEY, JSON.stringify(missed));
  apiCall("removeMissedQuestion", { questionId: id });
}

export function clearMissedQuestions(): void {
  localStorage.setItem(MISSED_KEY, "[]");
  apiCall("clearMissedQuestions", {});
}

// -- Flagged Questions --
export function getFlagged(): number[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(FLAGGED_KEY) || "[]");
  } catch { return []; }
}

export function toggleFlag(id: number): boolean {
  const flagged = getFlagged();
  const idx = flagged.indexOf(id);
  if (idx >= 0) {
    flagged.splice(idx, 1);
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(flagged));
    apiCall("toggleFlag", { questionId: id });
    return false;
  }
  flagged.push(id);
  localStorage.setItem(FLAGGED_KEY, JSON.stringify(flagged));
  apiCall("toggleFlag", { questionId: id });
  return true;
}

export function isFlagged(id: number): boolean {
  return new Set(getFlagged()).has(id);
}

// -- Per-Question Attempt Tracking --
export function recordAttempt(id: number, correct: boolean): void {
  const attempts = getAttempts();
  if (!attempts[id]) attempts[id] = { correct: 0, incorrect: 0 };
  if (correct) attempts[id].correct++;
  else attempts[id].incorrect++;
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {}
  apiCall("recordAttempt", { questionId: id, correct });
}

export function getAttempts(): Record<number, { correct: number; incorrect: number }> {
  if (typeof window === "undefined") return {};
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "{}");
  } catch { return {}; }
}

export function clearAttempts(): void {
  try { localStorage.setItem(ATTEMPTS_KEY, "{}"); } catch {}
}

// -- Study Progress --
const STUDY_PROGRESS_KEY = "sc200-study-progress";

export function getStudyProgress(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(STUDY_PROGRESS_KEY) || "{}");
  } catch { return {}; }
}

export function markSectionViewed(topicSlug: string, sectionId: string): void {
  const progress = getStudyProgress();
  if (!progress[topicSlug]) progress[topicSlug] = [];
  if (!progress[topicSlug].includes(sectionId)) {
    progress[topicSlug].push(sectionId);
  }
  localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(progress));
  apiCall("markSectionViewed", { topicSlug, sectionId });
}

export function unmarkSection(topicSlug: string, sectionId: string): void {
  const progress = getStudyProgress();
  if (progress[topicSlug]) {
    progress[topicSlug] = progress[topicSlug].filter((s) => s !== sectionId);
    localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(progress));
  }
  apiCall("unmarkSection", { sectionId });
}

export function getTopicProgress(topicSlug: string): string[] {
  return getStudyProgress()[topicSlug] || [];
}

export function clearStudyProgress(): void {
  localStorage.setItem(STUDY_PROGRESS_KEY, "{}");
}

// -- Study Bookmarks --
const STUDY_BOOKMARKS_KEY = "sc200-study-bookmarks";

export function getStudyBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem(STUDY_BOOKMARKS_KEY) || "[]");
  } catch { return []; }
}

export function toggleStudyBookmark(sectionId: string): boolean {
  const bookmarks = getStudyBookmarks();
  const idx = bookmarks.indexOf(sectionId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem(STUDY_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    apiCall("toggleStudyBookmark", { sectionId });
    return false;
  }
  bookmarks.push(sectionId);
  localStorage.setItem(STUDY_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  apiCall("toggleStudyBookmark", { sectionId });
  return true;
}

export function isStudyBookmarked(sectionId: string): boolean {
  return getStudyBookmarks().includes(sectionId);
}

// -- Study Plan --
const STUDY_PLAN_KEY = "sc200-study-plan";

export function getStudyPlan(): { startDate: string; targetDate: string; days: number } | null {
  if (typeof window === "undefined") return null;
  ensureStorageVersion();
  try {
    const raw = localStorage.getItem(STUDY_PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setStudyPlan(days: number): void {
  const startDate = new Date().toISOString().split("T")[0];
  const targetDate = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
  const plan = { startDate, targetDate, days };
  localStorage.setItem(STUDY_PLAN_KEY, JSON.stringify(plan));
  apiCall("setStudyPlan", plan);
}

export function clearStudyPlan(): void {
  localStorage.setItem(STUDY_PLAN_KEY, "null");
  apiCall("clearStudyPlan", {});
}

export function getStudyPlanProgress(): Record<string, number> {
  if (typeof window === "undefined") return {};
  ensureStorageVersion();
  try {
    return JSON.parse(localStorage.getItem("sc200-study-plan-progress") || "{}");
  } catch { return {}; }
}

export function recordStudyDayProgress(date: string, count: number): void {
  const progress = getStudyPlanProgress();
  progress[date] = count;
  localStorage.setItem("sc200-study-plan-progress", JSON.stringify(progress));
  apiCall("recordStudyDayProgress", { date, count });
}

// -- Weakness Recommendations --
export function getTopicAccuracy(topicSlug: string): { correct: number; incorrect: number; accuracy: number } | null {
  const attempts = getAttempts();
  const qs = allQuestions as Question[];
  const topicQuestionIds = qs.filter((q) => q.topic === topicSlug).map((q) => q.id);

  let correct = 0;
  let incorrect = 0;
  for (const id of topicQuestionIds) {
    const a = attempts[id];
    if (a) {
      correct += a.correct;
      incorrect += a.incorrect;
    }
  }
  if (correct + incorrect === 0) return null;
  return { correct, incorrect, accuracy: Math.round((correct / (correct + incorrect)) * 100) };
}
