import StudyTopicClient from "./client";

export function generateStaticParams() {
  return [
    { slug: "manage-soc" },
    { slug: "respond-incidents" },
    { slug: "threat-hunting" },
  ];
}

export default async function StudyTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StudyTopicClient slug={slug} />;
}
