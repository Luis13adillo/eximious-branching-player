import { notFound } from "next/navigation";
import { getAllLessonSlugs, getLesson } from "@/lib/lessons";
import { PlayerClient } from "@/components/player/PlayerClient";

/**
 * Iframe-optimized route at /embed/[slug] for embedding inside Thinkific (or
 * any LMS). Trimmed chrome, fills the iframe. Framing is permitted via the
 * `frame-ancestors` header in next.config.ts.
 *
 * Thinkific usage: add a "Multimedia / iframe" lesson and point it at
 *   https://<your-vercel-domain>/embed/water-damage-claim
 */

export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export default async function EmbedPage({ params }: PageProps<"/embed/[slug]">) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <div className="min-h-[100dvh] w-full bg-navy-950">
      <PlayerClient lesson={lesson} embed />
    </div>
  );
}
