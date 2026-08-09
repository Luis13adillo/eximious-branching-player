"use client";

import { useEffect } from "react";
import { BrandMark } from "@/components/ui/BrandMark";

/**
 * Route-level error boundary. Catches render/runtime errors (including a
 * malformed lesson config) and offers a recovery path instead of a blank page.
 */
export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Eximious] Lesson render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-navy-950 px-6 text-center">
      <BrandMark size="lg" />
      <div>
        <div className="font-[family-name:var(--font-display)] text-3xl text-ink-100">
          This case couldn&apos;t be loaded
        </div>
        <p className="mt-2 max-w-md font-sans text-ink-300">
          Something went wrong while preparing the lesson. This usually means the
          lesson configuration has an invalid reference.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-gold-500 px-6 py-2.5 font-sans text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
      >
        Try again
      </button>
    </div>
  );
}
