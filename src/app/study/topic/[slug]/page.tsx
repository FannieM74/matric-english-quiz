import StudyTopicClient from "./client";

import studyNotes from "@/lib/study-notes.json";

export function generateStaticParams() {
  return studyNotes.map((t) => ({ slug: t.slug }));
}

export default async function StudyTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StudyTopicClient slug={slug} />;
}
