import { notFound } from "next/navigation";
import { getAllLessonSlugs, getLesson } from "@/lib/lessons";
import { PlayerClient } from "@/components/player/PlayerClient";

/**
 * Full-page lesson player at /lesson/[slug]. One route runs every lesson in the
 * registry — adding lesson #267 needs no new page.
 */

export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: PageProps<"/lesson/[slug]">) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <div className="min-h-[100dvh] w-full bg-navy-950">
      <PlayerClient lesson={lesson} />
    </div>
  );
}
