import { BrandMark } from "@/components/ui/BrandMark";

/** Route-level loading UI while the lesson page streams in. */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mb-4 flex items-center justify-between">
        <BrandMark size="md" />
        <div className="h-1.5 w-24 rounded-full bg-white/10" />
      </div>
      {/* stage skeleton */}
      <div className="ex-skeleton aspect-video w-full rounded-2xl" />
      <div className="mt-4 rounded-2xl border border-white/10 bg-navy-900/40 p-6">
        <div className="ex-skeleton mb-3 h-5 w-2/3 rounded" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ex-skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3 text-ink-400">
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-white/20 border-t-gold-400"
          style={{ animation: "exSpin 0.8s linear infinite" }}
        />
        <span className="font-sans text-sm">Loading case study…</span>
      </div>
    </div>
  );
}
