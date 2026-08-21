/*
  Static entry for the Thinkific HTML5 package.
  ------------------------------------------------------------------
  Renders the EXACT approved player with an approved lesson — the same component
  tree the Next.js /lesson/[slug] page renders, wrapped in the identical shell.
  No Next.js runtime, no server, no APIs.

  WHICH LESSON: `EXPORT_LESSON_SLUG`, injected at build time by vite.config.ts
  from the env var of the same name. It resolves through the SAME registry the
  Next.js routes use, so a package can never ship a lesson the app would not
  serve, and the 267-video catalog needs no new entry file per export.
*/
import { createRoot } from "react-dom/client";

// Approved theme + Tailwind utilities for the shared components. Typography is
// the authoritative Georgia (headings) / Segoe UI (body) system-font pairing
// defined in globals.css — no web fonts to embed.
import "./styles.css";

// The approved player boundary, reused verbatim.
import { PlayerClient } from "@/components/player/PlayerClient";
// Exactly ONE lesson module, aliased by path in vite.config.ts. Deliberately not the
// registry: importing that would bundle every lesson's data and asset URLs, and the
// package would carry all four videos' media.
import * as lessonModule from "@export-lesson";
import type { Lesson } from "@/lib/branching/types";

declare const EXPORT_LESSON_SLUG: string;

const lesson = Object.values(lessonModule).find(
  (v): v is Lesson =>
    !!v && typeof v === "object" && (v as Lesson).slug === EXPORT_LESSON_SLUG,
);
if (!lesson) {
  throw new Error(
    `the module aliased as @export-lesson exports no lesson with slug "${EXPORT_LESSON_SLUG}"`,
  );
}

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    // Same wrapper as src/app/lesson/[slug]/page.tsx.
    <div className="min-h-[100dvh] w-full bg-navy-950">
      <PlayerClient lesson={lesson} />
    </div>,
  );
}
